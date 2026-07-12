import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { revalidateLombaData } from "@/lib/revalidate-public";
import { connectDB } from "@/lib/mongodb";
import { LombaGroup } from "@/models/LombaGroup";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const group = await LombaGroup.findByIdAndUpdate(id, body, { new: true });
    if (!group) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    revalidateLombaData();
    return NextResponse.json(group);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal mengupdate lomba" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;
    await LombaGroup.findByIdAndDelete(id);
    revalidateLombaData();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal menghapus lomba" }, { status: 500 });
  }
}
