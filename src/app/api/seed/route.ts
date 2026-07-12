import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { assertSeedAllowed } from "@/lib/seed-auth";
import { Participant } from "@/models/Participant";

const seedData = [
  { name: "Budi Santoso", age: 25, phone: "081234567801", category: "Balap Karung", status: "terdaftar" },
  { name: "Siti Aminah", age: 22, phone: "081234567802", category: "Balap Karung", status: "terdaftar" },
  { name: "Ahmad Rizki", age: 28, phone: "081234567803", category: "Tarik Tambang", status: "lolos" },
  { name: "Dewi Lestari", age: 24, phone: "081234567804", category: "Tarik Tambang", status: "lolos" },
  { name: "Rudi Hartono", age: 30, phone: "081234567805", category: "Panjat Pinang", status: "juara1" },
  { name: "Maya Sari", age: 19, phone: "081234567806", category: "Balap Karung", status: "juara2" },
  { name: "Joko Widodo", age: 35, phone: "081234567807", category: "Tarik Tambang", status: "juara3" },
  { name: "Ani Yudhoyono", age: 27, phone: "081234567808", category: "Balap Karung", status: "didiskualifikasi" },
  { name: "Eko Prasetyo", age: 21, phone: "081234567809", category: "Panjat Pinang", status: "terdaftar" },
  { name: "Rina Wulandari", age: 23, phone: "081234567810", category: "Tarik Tambang", status: "terdaftar" },
  { name: "Hendra Gunawan", age: 26, phone: "081234567811", category: "Balap Karung", status: "lolos" },
  { name: "Fitri Handayani", age: 20, phone: "081234567812", category: "Panjat Pinang", status: "terdaftar" },
];

export async function POST(request: Request) {
  try {
    assertSeedAllowed(request);
    await connectDB();
    const count = await Participant.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Data sudah ada", count });
    }
    await Participant.insertMany(seedData);
    return NextResponse.json({ message: "Data berhasil di-seed", count: seedData.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal seed data";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
