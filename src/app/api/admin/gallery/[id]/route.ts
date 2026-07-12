import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Gallery } from "@/models/Gallery";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    const image = await Gallery.findById(id);
    if (!image) return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 });

    if (image.src.startsWith("/images/galeri-kegiatan/galeri-")) {
      try {
        const filePath = path.join(process.cwd(), "public", image.src);
        await unlink(filePath);
      } catch {
        // file may not exist
      }
    }

    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal menghapus gambar" }, { status: 500 });
  }
}
