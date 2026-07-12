import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Gallery } from "@/models/Gallery";
import { revalidateGalleryData } from "@/lib/revalidate-public";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const images = await Gallery.find().sort({ order: 1 });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || "Dokumentasi kegiatan 17 Agustus";

    if (!file) {
      return NextResponse.json({ error: "File wajib diupload" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `galeri-${Date.now()}${path.extname(file.name) || ".jpg"}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "galeri-kegiatan");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const count = await Gallery.countDocuments();
    const image = await Gallery.create({
      src: `/images/galeri-kegiatan/${filename}`,
      alt,
      order: count,
    });

    revalidateGalleryData();

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal upload gambar" }, { status: 500 });
  }
}
