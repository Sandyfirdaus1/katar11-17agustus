import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Participant } from "@/models/Participant";
import { getSettings } from "@/lib/data";

export async function GET() {
  try {
    await connectDB();
    const participants = await Participant.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(participants);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data peserta" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const settings = await getSettings();

    if (!settings.registrationOpen) {
      return NextResponse.json(
        { error: "Pendaftaran sudah ditutup. Silakan hubungi panitia." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, age, phone, category } = body;

    if (!name?.trim() || !age || !phone?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const existing = await Participant.findOne({
      name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Nama sudah terdaftar. Setiap peserta hanya boleh mendaftar satu kali." },
        { status: 409 }
      );
    }

    const participant = await Participant.create({
      name: trimmedName,
      age: Number(age),
      phone: phone.trim(),
      category: category.trim(),
      status: "terdaftar",
    });

    return NextResponse.json(participant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambah peserta" }, { status: 500 });
  }
}
