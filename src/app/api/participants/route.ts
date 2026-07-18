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
      headers: { "Cache-Control": "no-store" },
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
    const { name, age, phone, address, categories, teamName, teamMembers } = body;

    if (!name?.trim() || !age || !phone?.trim() || !address?.trim() || !categories || !Array.isArray(categories) || categories.length === 0) {
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
    const trimmedCategories = categories.map((c: string) => c.trim()).filter(Boolean);
    
    // Validate each category
    for (const category of trimmedCategories) {
      if (!isLombaValidForAge(lombaGroups, ageNum, category)) {
        return NextResponse.json(
          { error: `Pilihan lomba "${category}" tidak sesuai dengan usia peserta.` },
          { status: 400 }
        );
      }
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

    // Initialize lombaStatuses with "terdaftar" for each category
    const lombaStatuses: { [key: string]: "terdaftar" | "lolos" | "juara1" | "juara2" | "juara3" | "didiskualifikasi" } = {};
    trimmedCategories.forEach((cat: string) => {
      lombaStatuses[cat] = "terdaftar";
    });

    const participant = await Participant.create({
      name: trimmedName,
      age: ageNum,
      phone: phone.trim(),
      address: address.trim(),
      categories: trimmedCategories,
      category: trimmedCategories[0], // Legacy field for backward compatibility
      teamName: teamName?.trim() || undefined,
      teamMembers: teamMembers && Array.isArray(teamMembers) ? teamMembers.map((m: string) => m.trim()).filter(Boolean) : undefined,
      lombaStatuses,
      status: "terdaftar", // Legacy field
    });

    console.log("Participant created:", participant);

    revalidateParticipantData();

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Gagal menambah peserta: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Gagal menambah peserta" }, { status: 500 });
  }
}
