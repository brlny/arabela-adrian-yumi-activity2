import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFolder = path.join(process.cwd(), "data");
const filePath = path.join(dataFolder, "chapters.json");

type Chapter = {
  id: number;
  name: string;
  createdAt: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support single object or array
    const chaptersToAdd: { name: string }[] = Array.isArray(body) ? body : [body];

    // Validate all items
    if (!chaptersToAdd.every(c => c.name && typeof c.name === "string")) {
      return NextResponse.json({ error: "Each chapter must have a valid name" }, { status: 400 });
    }

    // Ensure data folder exists
    if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });

    // Read existing chapters
    let existingChapters: Chapter[] = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      if (data) existingChapters = JSON.parse(data);
    }

    const lastId = existingChapters.length > 0 ? Math.max(...existingChapters.map(c => c.id)) : 0;

    // Add new chapters
    const newChapters: Chapter[] = chaptersToAdd.map((c, index) => ({
      id: lastId + index + 1,
      name: c.name,
      createdAt: new Date().toISOString(),
    }));

    const updatedChapters = [...existingChapters, ...newChapters];
    fs.writeFileSync(filePath, JSON.stringify(updatedChapters, null, 2), "utf-8");

    return NextResponse.json({ message: "Chapters added", chapters: newChapters }, { status: 201 });
  } catch (err) {
    console.error("Chapters POST error:", err);
    return NextResponse.json({ error: "Failed to add chapters" }, { status: 500 });
  }
}

