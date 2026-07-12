import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Participant } from "@/models/Participant";

export async function GET() {
  try {
    await connectDB();
    const statuses = ["terdaftar", "lolos", "juara1", "juara2", "juara3", "didiskualifikasi"] as const;
    const counts: Record<string, number> = {};

    for (const status of statuses) {
      counts[status] = await Participant.countDocuments({ status });
    }

    return NextResponse.json(counts);
  } catch {
    return NextResponse.json(
      { terdaftar: 0, lolos: 0, juara1: 0, juara2: 0, juara3: 0, didiskualifikasi: 0 }
    );
  }
}
