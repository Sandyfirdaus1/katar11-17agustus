import { NextResponse } from "next/server";
import { getParticipantStats } from "@/lib/data";

export async function GET() {
  try {
    const counts = await getParticipantStats();
    return NextResponse.json(counts, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json(
      { terdaftar: 0, lolos: 0, juara1: 0, juara2: 0, juara3: 0, didiskualifikasi: 0 }
    );
  }
}
