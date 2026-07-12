import { NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/data";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil galeri" }, { status: 500 });
  }
}
