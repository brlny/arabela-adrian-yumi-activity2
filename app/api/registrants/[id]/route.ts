import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Path to <project-root>/data/registrants.json
const dataFilePath = path.join(process.cwd(), "data", "registrants.json");

// Registrant type (based on your JSON)
interface Registrant {
  id: string;
  firstname: string;
  lastname: string;
  contactnumber: string;
  chapter: string;
  email: string;
  filename: string;
}

// Read registrants.json
async function readData(): Promise<{ registrants: Registrant[] }> {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(file);

    if (!data.registrants || !Array.isArray(data.registrants)) {
      return { registrants: [] };
    }

    return data;
  } catch (error) {
    console.error("Error reading registrants.json:", error);
    return { registrants: [] };
  }
}

// GET one registrant by ID
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // <-- this should now be defined

  const data = await readData();
  const registrant = data.registrants.find((r) => r.id === id);

  if (!registrant) {
    return NextResponse.json(
      { message: `Registrant with id ${id} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(registrant, { status: 200 });
}