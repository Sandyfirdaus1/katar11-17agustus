import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { assertSeedAllowed } from "@/lib/seed-auth";
import { Admin } from "@/models/Admin";
import { SiteSettings } from "@/models/SiteSettings";
import { LombaGroup } from "@/models/LombaGroup";
import { Gallery } from "@/models/Gallery";

export async function POST(request: Request) {
  try {
    assertSeedAllowed(request);
    await connectDB();

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || "admin";
      const password = process.env.ADMIN_PASSWORD || "admin123";
      const hashed = await bcrypt.hash(password, 10);
      await Admin.create({ username, password: hashed });
    }

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) await SiteSettings.create({});

    const lombaCount = await LombaGroup.countDocuments();
    if (lombaCount === 0) {
      await LombaGroup.insertMany([
        { group: "Balita", age: "0–5 tahun", lomba: ["Lomba Gerak Jalan", "Mewarnai Tema Kemerdekaan", "Menyanyi Lagu Anak"], order: 0 },
        { group: "Anak-anak", age: "6–12 tahun", lomba: ["Balap Karung", "Makan Kerupuk", "Balap Kelereng", "Paku Bendera", "Estafet Air"], order: 1 },
        { group: "Remaja", age: "13–17 tahun", lomba: ["Balap Karung", "Tarik Tambang", "Balap Bakiak", "Futsal", "Voli"], order: 2 },
        { group: "Dewasa", age: "18+ tahun", lomba: ["Tarik Tambang", "Panjat Pinang", "Balap Karung", "Balap Bakiak", "Domino"], order: 3 },
      ]);
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany(
        Array.from({ length: 11 }, (_, i) => ({
          src: `/images/galeri-kegiatan/gambar${i + 1}.JPG`,
          alt: `Dokumentasi kegiatan 17 Agustus ${i + 1}`,
          order: i,
        }))
      );
    }

    return NextResponse.json({ message: "Data awal berhasil dibuat" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal seed data";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
