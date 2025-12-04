import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Path to <project-root>/data/chapters.json
const dataFilePath = path.join(process.cwd(), "data", "chapters.json");

// Chapter type
interface Chapter {
  id: string;
  name: string;
  createdAt: string;
}

// Read chapters.json
async function readData(): Promise<{ chapters: Chapter[] }> {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(file);
    if (!data.chapters || !Array.isArray(data.chapters)) {
      return { chapters: [] };
    }
    return data;
  } catch (error) {
    console.error("Error reading chapters.json:", error);
    return { chapters: [] };
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // <-- this should now be defined

  const data = await readData();
  const chapter = data.chapters.find((c) => c.id === id);

  if (!chapter) {
    return NextResponse.json(
      { message: `Chapter with id ${id} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(chapter, { status: 200 });
}