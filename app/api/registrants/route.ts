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
};

// iprocces ng backend ung request and mapupunta sa db//
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const chapter = formData.get("chapter") as string;
    const file = formData.get("file") as File;

    if (!firstname || !lastname || !email || !contactNumber || !chapter || !file) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Save file to /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileBytes = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, file.name);

    fs.writeFileSync(filePath, fileBytes);

    // Save record
    const dataFolderPath = path.join(process.cwd(), "data");
    const dataFilePath = path.join(dataFolderPath, "registrants.json");

    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath, { recursive: true });
    }

    if (!fs.existsSync(dataFilePath)) {
      await fsPromises.writeFile(
        dataFilePath,
        JSON.stringify({ registrants: [] }, null, 2),
        "utf-8"
      );
    }

    const rawFile = await fsPromises.readFile(dataFilePath, "utf-8");
    const fileData = JSON.parse(rawFile);

    const newId = fileData.registrants.length > 0
      ? Math.max(...fileData.registrants.map((r: any) => r.id)) + 1
      : 1;

    const newRegistrant = {
      id: newId,
      firstname,
      lastname,
      contactNumber,
      chapter,
      email,
      filename: file.name, // actual filename
    };

    fileData.registrants.push(newRegistrant);

    await fsPromises.writeFile(dataFilePath, JSON.stringify(fileData, null, 2));

    return NextResponse.json(
      { message: "Registrant added successfully", registrant: newRegistrant },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to register", error: err.message },
      { status: 500 }
    );
  }
}

