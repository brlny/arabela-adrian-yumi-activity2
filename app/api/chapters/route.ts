import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
//filepath to the chapters.json file
const filePath = path.join(process.cwd(), "data", "registrants.json");
//define chapter type
type Chapter = {
  id: number;
  chapterName: string;
};
//read ekek
async function readChapters(): Promise<Chapter[]> {
  const file = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(file);
  return data.chapters as Chapter[];
}
//write ekek
async function writeChapters(chapters: Chapter[]): Promise<void> {
  const file = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(file);
  data.chapters = chapters;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

//update chapter
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

//delete chapter
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { message: "Chapter id required" },
        { status: 400 });
    }

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






