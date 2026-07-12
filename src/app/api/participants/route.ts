import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Participant } from "@/models/Participant";
import { getFreshSettings, getFreshLombaGroups, getParticipants } from "@/lib/data";
import { revalidateParticipantData } from "@/lib/revalidate-public";
import { isLombaValidForAge } from "@/lib/lomba-age";

export async function GET() {
  try {
    const participants = await getParticipants();
    return NextResponse.json(participants, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data peserta" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const settings = await getFreshSettings();

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
    const ageNum = Number(age);

    if (ageNum < 1 || ageNum > 120) {
      return NextResponse.json(
        { error: "Usia harus diisi dengan angka antara 1–120." },
        { status: 400 }
      );
    }

    const lombaGroups = await getFreshLombaGroups();
    if (!isLombaValidForAge(lombaGroups, ageNum, category.trim())) {
      return NextResponse.json(
        { error: "Pilihan lomba tidak sesuai dengan usia peserta." },
        { status: 400 }
      );
    }

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
      age: ageNum,
      phone: phone.trim(),
      category: category.trim(),
      status: "terdaftar",
    });

    revalidateParticipantData();

    return NextResponse.json(participant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambah peserta" }, { status: 500 });
  }
}
