import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { assertSeedAllowed } from "@/lib/seed-auth";
import { Participant } from "@/models/Participant";

const seedData = [
  { name: "Andi Pratama", age: 5, phone: "081234567801", address: "Jl. Walang Sari Raya No. 1", category: "Paku Dalam Botol", status: "terdaftar" },
  { name: "Sari Dewi", age: 7, phone: "081234567802", address: "Jl. Walang Sari Raya No. 5", category: "Makan Kerupuk", status: "terdaftar" },
  { name: "Budi Setiawan", age: 6, phone: "081234567803", address: "Jl. Walang Sari Raya No. 10", category: "Balap Kelereng", status: "lolos" },
  { name: "Rina Kartika", age: 15, phone: "081234567804", address: "Jl. Walang Sari Raya No. 3", category: "Balap Karung", status: "terdaftar" },
  { name: "Dani Firmansyah", age: 17, phone: "081234567805", address: "Jl. Walang Sari Raya No. 8", category: "Pukul Kendi", status: "lolos" },
  { name: "Maya Anggraini", age: 14, phone: "081234567806", address: "Jl. Walang Sari Raya No. 12", category: "Joget Jeruk", status: "juara1" },
  { name: "Ibu Siti Aminah", age: 32, phone: "081234567807", address: "Jl. Walang Sari Raya No. 7", category: "Bakiak", status: "terdaftar" },
  { name: "Ibu Dewi Lestari", age: 35, phone: "081234567808", address: "Jl. Walang Sari Raya No. 15", category: "Joget Jeruk", status: "juara2" },
  { name: "Ibu Fitri Handayani", age: 28, phone: "081234567809", address: "Jl. Walang Sari Raya No. 20", category: "Rebutan Tempat Duduk", status: "terdaftar" },
  { name: "Rizky Aditya", age: 12, phone: "081234567810", address: "Jl. Walang Sari Raya No. 2", category: "Bakiak", status: "juara3" },
  { name: "Putri Rahayu", age: 4, phone: "081234567811", address: "Jl. Walang Sari Raya No. 9", category: "Bola Keranjang", status: "terdaftar" },
  { name: "Ibu Ani Suryani", age: 30, phone: "081234567812", address: "Jl. Walang Sari Raya No. 11", category: "Kerucut", status: "lolos" },
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
