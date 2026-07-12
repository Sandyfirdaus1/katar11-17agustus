import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { revalidateLombaData } from "@/lib/revalidate-public";
import { connectDB } from "@/lib/mongodb";
import { LombaGroup } from "@/models/LombaGroup";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const groups = await LombaGroup.find().sort({ order: 1 });
    return NextResponse.json(groups);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    const group = await LombaGroup.create(body);
    revalidateLombaData();
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal menambah lomba" }, { status: 500 });
  }
}
