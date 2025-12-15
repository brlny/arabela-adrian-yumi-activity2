import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * Disable default body parsing
 * (required for FormData handling)
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract fields
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const chapter = formData.get("chapter") as string;
    const receipt = formData.get("receipt") as File;

    if (!receipt) {
      return NextResponse.json(
        { message: "Receipt file is required" },
        { status: 400 }
      );
    }

    /**
     * Save receipt file
     */
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/receipts"
    );
    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await receipt.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = path.extname(receipt.name);
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${fileExt}`;

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    /**
     * Read existing registrants.json
     */
    const dataFilePath = path.join(
      process.cwd(),
      "data/registrants.json"
    );

    const jsonData = await fs.readFile(dataFilePath, "utf-8");
    const parsed = JSON.parse(jsonData);

    /**
     * Append new registration
     */
    const newRegistrant = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      contactNumber,
      chapter,
      receiptUrl: `/uploads/receipts/${fileName}`,
      createdAt: new Date().toISOString(),
    };

    parsed.registrants.push(newRegistrant);

    /**
     * Save back to file
     */
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(parsed, null, 2)
    );

    return NextResponse.json(
      { message: "Registration successful", registrant: newRegistrant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
