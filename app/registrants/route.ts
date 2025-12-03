import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

const dataFolderPath = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataFolderPath, "registrants.json");

type Registrant = {
  id: number;
  firstname: string;
  lastname: string;
  contactNumber: string;
  chapter: string;
  email: string;
  filename: string;
  timestamp: string;
};

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw || raw.trim().length === 0) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json({ message: "Invalid JSON", error: (err as Error).message }, { status: 400 });
    }

    const { firstname, lastname, contactNumber, chapter, email, filename } = body;
    if (!firstname || !lastname || !contactNumber || !chapter || !email || !filename) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath, { recursive: true });
    }

    if (!fs.existsSync(dataFilePath)) {
      await fsPromises.writeFile(dataFilePath, JSON.stringify({ registrants: [] }, null, 2), "utf-8");
    }

    const rawFile = await fsPromises.readFile(dataFilePath, "utf-8");
    let fileData: { registrants: Registrant[] } = { registrants: [] };
    if (rawFile && rawFile.trim().length > 0) {
      try {
        fileData = JSON.parse(rawFile);
        if (!Array.isArray(fileData.registrants)) fileData.registrants = [];
      } catch {
        fileData = { registrants: [] };
      }
    }

    const newId = fileData.registrants.length > 0 ? Math.max(...fileData.registrants.map(r => r.id)) + 1 : 1;

    const newRegistrant: Registrant = {
      id: newId,
      firstname,
      lastname,
      contactNumber,
      chapter,
      email,
      filename,
      timestamp: new Date().toISOString(),
    };

    fileData.registrants.push(newRegistrant);

    await fsPromises.writeFile(dataFilePath, JSON.stringify(fileData, null, 2), "utf-8");

    return NextResponse.json({ message: "Registrant added successfully", registrant: newRegistrant }, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ message: "Failed to register", error: (err as Error).message }, { status: 500 });
  }
}
