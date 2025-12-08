import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ------------------------------
// File paths
// ------------------------------
const chaptersFilePath = path.join(process.cwd(), "data", "chapters.json");
const registrantsFilePath = path.join(process.cwd(), "data", "registrants.json");

// ------------------------------
// Types
// ------------------------------
interface Chapter {
  id: string;
  name: string;
  createdAt: string;
}

interface Registrant {
  id: string;
  firstname: string;
  lastname: string;
  contactnumber: string;
  chapter: string;
  email: string;
  filename: string;
}

// ------------------------------
// Generic helpers
// ------------------------------
async function readJSONFile<T>(filePath: string, arrayKey: string): Promise<{ [key: string]: T[] }> {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);
    if (!data[arrayKey] || !Array.isArray(data[arrayKey])) {
      return { [arrayKey]: [] };
    }
    return data;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return { [arrayKey]: [] };
  }
}

async function writeJSONFile<T>(filePath: string, arrayKey: string, data: T[]) {
  await fs.writeFile(filePath, JSON.stringify({ [arrayKey]: data }, null, 2), "utf-8");
}

// ------------------------------
// Chapters API
// ------------------------------
export async function GET() {
  const data = await readJSONFile<Chapter>(chaptersFilePath, "chapters");
  return NextResponse.json(data.chapters, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chaptersToAdd = Array.isArray(body) ? body : [body];

    if (!chaptersToAdd.length) {
      return NextResponse.json({ message: "No chapter data provided." }, { status: 400 });
    }

    const data = await readJSONFile<Chapter>(chaptersFilePath, "chapters");
    const { chapters } = data;

    const newChapters: Chapter[] = chaptersToAdd.map((chapter: any) => {
      if (!chapter.name) throw new Error("Chapter name is required");
      return { id: crypto.randomUUID(), name: chapter.name, createdAt: new Date().toISOString() };
    });

    chapters.push(...newChapters);
    await writeJSONFile<Chapter>(chaptersFilePath, "chapters", chapters);

    return NextResponse.json(newChapters, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/chapters:", error);
    return NextResponse.json({ message: error.message || "Failed to create chapter(s)" }, { status: 500 });
  }
}

// ------------------------------
// Example: Read registrants (can be used in another API route)
// ------------------------------
export async function getRegistrants() {
  const data = await readJSONFile<Registrant>(registrantsFilePath, "registrants");
  return data.registrants;
}
