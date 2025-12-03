import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// File locations
const dataFolder = path.join(process.cwd(), "data");
const dataFile = path.join(dataFolder, "registrants.json");


// Ensures the /data folder and JSON file exist
async function ensureDataFile() {
  await fs.mkdir(dataFolder, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(
      dataFile,
      JSON.stringify({ registrants: [] }, null, 2),
      "utf-8"
    );
  }
}

// Read JSON and return array
async function readRegistrants() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw).registrants || [];
}

// Write updated list to file
async function saveRegistrants(registrants: any[]) {
  await fs.writeFile(
    dataFile,
    JSON.stringify({ registrants }, null, 2),
    "utf-8"
  );
}

// --------------------------------Get------------------------------------------ //

// GET all registrants
export async function GET() {
  try {
    const registrants = await readRegistrants();

    return NextResponse.json({
      success: true,
      message: "Registrants retrieved successfully",
      count: registrants.length,
      data: registrants,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error retrieving registrants",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// --------------------------------Put------------------------------------------ //

// Update registrant
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    // validation para if theres no id
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing registrant ID" },
        { status: 400 }
      );
    }
    // validation para if no updates or invalid fields
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    // Ccheck nya if andun yung ID then return error if not found
    const registrants = await readRegistrants();
    const index = registrants.findIndex((r: any) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Registrant with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Merge updates sa existing registrant data and save
    const updated = { ...registrants[index], ...updates };
    registrants[index] = updated;

    await saveRegistrants(registrants);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}