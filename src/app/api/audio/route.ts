import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "public", "audio");

    const files = fs
      .readdirSync(audioDir)
      .filter((file) =>
        /\.(mp3|wav|m4a|ogg|flac)$/i.test(file)
      );

    const tracks = files.map((file) => ({
      name: file.replace(/\.[^/.]+$/, ""),
      url: `/audio/${file}`,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], { status: 200 });
  }
}