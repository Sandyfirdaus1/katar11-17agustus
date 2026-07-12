import { NextResponse } from "next/server";
import { getLombaGroups } from "@/lib/data";

export async function GET() {
  try {
    const groups = await getLombaGroups();
    return NextResponse.json(groups);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data lomba" }, { status: 500 });
  }
}
