import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Path to: <project-root>/data/registrants.json
const dataFilePath = path.join(process.cwd(), "data", "registrants.json");

/**
 * Type representing a single registrant record.
 * This should match the structure inside registrants.json
 */
interface Registrant {
  id: string;
  firstname: string;
  lastname: string;
  contactnumber: string;
  chapter: string;
  email: string;
  filename: string;
}

/**
 * Helper function to read and parse registrants.json
 */

async function readData(): Promise<{ registrants: Registrant[] }> {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8");

    const data = JSON.parse(file); 

    if (!data.registrants || !Array.isArray(data.registrants)) {
      console.error("registrants is missing or not array");
      return { registrants: [] };
    }

    return data;
  } catch (error) {
    console.error("Error reading registrants.json:", error);
    return { registrants: [] };
  }
}

/**
 * Helper function to write data back to registrants.json
 */
async function writeData(data: { registrants: Registrant[] }) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * GET /api/registrants
 * Returns the full list of registrants.
 */
export async function GET() {
  const data = await readData();
  return NextResponse.json(data.registrants, { status: 200 });
}

/**
 * POST /api/registrants
 * Creates a new registrant and appends it to the JSON file.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstname,
      lastname,
      contactnumber,
      chapter,
      email,
      filename,
    } = body;

    if (
      !firstname ||
      !lastname ||
      !contactnumber ||
      !chapter ||
      !email ||
      !filename
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const data = await readData();
    const { registrants } = data;

    // Generate proper UUID as unique ID
    const uniqueId = crypto.randomUUID();

    const newRegistrant: Registrant = {
      id: uniqueId,
      firstname,
      lastname,
      contactnumber,
      chapter,
      email,
      filename,
    };

    registrants.push(newRegistrant);

    await writeData({ registrants });

    return NextResponse.json(newRegistrant, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/registrants:", error);
    return NextResponse.json(
      { message: "Failed to create registrant" },
      { status: 500 }
    );
  }
}
