import { NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/data";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json(images, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil galeri" }, { status: 500 });
  }
}
