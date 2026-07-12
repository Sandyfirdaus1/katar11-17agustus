import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { LombaGroup } from "@/models/LombaGroup";
import { Gallery } from "@/models/Gallery";

const defaultSettings = {
  aboutHighlight: "Kegiatan 17 Agustus 2026 RT 011",
  aboutDescription:
    "merupakan wujud rasa syukur atas kemerdekaan Indonesia. Mari kita pererat persaudaraan, junjung sportivitas, dan ciptakan momen berharga bersama.",
  countdownDate: "2026-08-17",
  countdownLabel: "MENUJU 17 AGUSTUS 2026",
  announcementTitle: "PENDAFTARAN DITUTUP",
  announcementDeadline: "16 AGUSTUS 2026 PUKUL 21.00 WIB",
  announcementNote: "Segera daftarkan diri Anda untuk mengikuti berbagai lomba menarik!",
  registrationOpen: true,
  eventDate: "17 AGUSTUS 2026",
  eventTime: "08.00 - SELESAI",
  eventLocation: "LINGKUNGAN RT 011",
  eventAudience: "BALITA HINGGA DEWASA",
  whatsapp: "0812-3456-7890",
  whatsappLabel: "(Ketua Katar 11)",
  whatsappLink: "6281234567890",
  locationName: "Lingkungan RT 011",
  locationAddress: "Jl Walang Sari Raya",
  footerCopyright: "© 2026 Katar 11. Dirgahayu Republik Indonesia.",
  footerCredit: "Dibuat Oleh Shandy",
};

const defaultLomba = [
  { group: "Balita", age: "0–5 tahun", lomba: ["Lomba Gerak Jalan", "Mewarnai Tema Kemerdekaan", "Menyanyi Lagu Anak"], order: 0 },
  { group: "Anak-anak", age: "6–12 tahun", lomba: ["Balap Karung", "Makan Kerupuk", "Balap Kelereng", "Paku Bendera", "Estafet Air"], order: 1 },
  { group: "Remaja", age: "13–17 tahun", lomba: ["Balap Karung", "Tarik Tambang", "Balap Bakiak", "Futsal", "Voli"], order: 2 },
  { group: "Dewasa", age: "18+ tahun", lomba: ["Tarik Tambang", "Panjat Pinang", "Balap Karung", "Balap Bakiak", "Domino"], order: 3 },
];

const defaultGallery = Array.from({ length: 11 }, (_, i) => ({
  src: `/images/galeri-kegiatan/gambar${i + 1}.JPG`,
  alt: `Dokumentasi kegiatan 17 Agustus ${i + 1}`,
  order: i,
}));

export async function getSettings() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) settings = await SiteSettings.create({});
    return JSON.parse(JSON.stringify(settings));
  } catch {
    return defaultSettings;
  }
}

export async function getLombaGroups() {
  try {
    await connectDB();
    let groups = await LombaGroup.find().sort({ order: 1 }).lean();
    if (groups.length === 0) {
      await LombaGroup.insertMany(defaultLomba);
      groups = await LombaGroup.find().sort({ order: 1 }).lean();
    }
    return JSON.parse(JSON.stringify(groups));
  } catch {
    return defaultLomba;
  }
}

export async function getGalleryImages() {
  try {
    await connectDB();
    let images = await Gallery.find().sort({ order: 1 }).lean();
    if (images.length === 0) {
      await Gallery.insertMany(defaultGallery);
      images = await Gallery.find().sort({ order: 1 }).lean();
    }
    return JSON.parse(JSON.stringify(images));
  } catch {
    return defaultGallery;
  }
}

export async function getUniqueLomba() {
  const groups = await getLombaGroups();
  return [...new Set(groups.flatMap((g: { lomba: string[] }) => g.lomba))];
}
