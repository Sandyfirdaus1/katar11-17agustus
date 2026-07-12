import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil pengaturan" }, { status: 500 });
  }
}
