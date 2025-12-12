/**
 * API route handler for managing chapters inside `registrants.json`.
 * 
 * This module uses stuff like:
 * - "NextResponse" for sending API responses
 * - "fs/promises" for async file operations
 * - "path" for resolving file paths
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Absolute path to `registrants.json` inside the project's `data` folder.
 * 
 * Using `process.cwd()` ensures the path dynamically points to the project root,
 * rather than relying on hardcoded directory structures.
 */

const filePath = path.join(process.cwd(), "data", "registrants.json");

/**
*
*nag define ako type Chapter para ma specify yung structure ng chapter object sa json ko.
*also dapat daw i define since ayun daw ung mas ok
*/
type Chapter = {
  id: number;
  chapterName: string;
  createdAt: string;
};

/**
 * Reads the current list of chapters from `registrants.json`.
 *
 * @returns Promise<Chapter[]> - an array of Chapter objects
 *
 * This function:
 * - Loads and parses the JSON file
 * - Extracts `data.chapters`
 * - Returns the chapter list for use in update/delete operations
 */

async function readChapters(): Promise<Chapter[]> {
  const file = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(filePath);
  return data.chapters as Chapter[];
}
/**
 * Writes an updated chapters array back to `registrants.json`.
 *
 * @param chapters - updated chapters array
 *
 * This function:
 * - Loads the current JSON file
 * - Replaces its `chapters` field with the updated array
 * - Writes the modified object back to disk
 */
async function writeChapters(chapters: Chapter[]): Promise<void> {
  const file = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(file);
  data.chapters = chapters;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support single object or array
    const chaptersToAdd: { chapterName: string }[] = Array.isArray(body) ? body : [body];

    // Validate all items
    if (
      !chaptersToAdd.every(
        c => c.chapterName && typeof c.chapterName === "string"
      )
    ) {
      return NextResponse.json(
        { error: "Each chapter must have a valid chapterName" },
        { status: 400 }
      );
    }

    // Read existing chapters
    let existingChapters: Chapter[] = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      if (data) existingChapters = JSON.parse(data);
    }

    const lastId =
      existingChapters.length > 0
        ? Math.max(...existingChapters.map(c => c.id))
        : 0;

    // Add new chapters
    const newChapters: Chapter[] = chaptersToAdd.map((c, index) => ({
      id: lastId + index + 1,
      chapterName: c.chapterName,
      createdAt: new Date().toISOString(),
    }));

    const updatedChapters = [...existingChapters, ...newChapters];
    fs.writeFileSync(filePath, JSON.stringify(updatedChapters, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Chapters added", chapters: newChapters },
      { status: 201 }
    );
  } catch (err) {
    console.error("Chapters POST error:", err);
    return NextResponse.json(
      { error: "Failed to add chapters" },
      { status: 500 }
    );
  }
}



/**
 * Updates an existing chapter.
 * 
 * Request body must include:
 * - `id` — the chapter ID to update
 * - `chapterName` — the new chapter name
 * 
 * Process:
 * 1. Validate request body
 * 2. Load current chapters
 * 3. Check if the chapter exists
 * 4. Update the chapter name
 * 5. Save the updated chapters array
 * 6. Return a success response
 */

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.chapterName) {
      return NextResponse.json(
        { 
            message: "Chapter id and name required" },
        { status: 400 });
    }
    //validation ccheck nya if chapter exists
    const chapters = await readChapters();
    const chapter = chapters.find((c: Chapter) => c.id === Number(body.id));
    if (!chapter) return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 });
    //dito mag update ng chapter name
    chapter.chapterName = body.chapterName;
    await writeChapters(chapters);

    return NextResponse.json(
        { 
            message: "Chapter updated successfully", 
            data: chapter 
        }, 
            { status: 200 }
        );
    
  } catch (err: any) {
    return NextResponse.json(
        { 
            message: "Failed to update chapter", 
            error: err.message 
        },
        { status: 500 });
  }
}

/**
 * Deletes a chapter by ID.
 *
 * Request body must include:
 * - `id` — the chapter ID to remove
 *
 * Process:
 * 1. Validate request body
 * 2. Load current chapters
 * 3. Find chapter index
 * 4. Remove the chapter using `splice`
 * 5. Save the updated chapter list
 * 6. Return a success response
 */

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { message: "Chapter id required" },
        { status: 400 });
    }
    //validation check if chapter exists
    const chapters = await readChapters();
    const index = chapters.findIndex((c: Chapter) => c.id === Number(body.id));
    if (index === -1) return NextResponse.json(
        { message: "Chapter not found" }, 
        { status: 404 });

    chapters.splice(index, 1);
    await writeChapters(chapters);

    return NextResponse.json(
        { message: "Chapter deleted successfully" }, 
        { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
        { message: "Failed to delete chapter", error: err.message }, 
        { status: 500 });
  }
}






