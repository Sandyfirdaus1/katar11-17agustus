import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { LombaGroup } from "@/models/LombaGroup";
import { Gallery } from "@/models/Gallery";
import { Participant } from "@/models/Participant";

export type ParticipantStats = {
  terdaftar: number;
  lolos: number;
  juara1: number;
  juara2: number;
  juara3: number;
  didiskualifikasi: number;
};

export type PublicParticipant = {
  _id: string;
  name: string;
  age?: number;
  phone?: string;
  category: string;
  status: string;
};

const emptyStats: ParticipantStats = {
  terdaftar: 0,
  lolos: 0,
  juara1: 0,
  juara2: 0,
  juara3: 0,
  didiskualifikasi: 0,
};

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

async function fetchSettings() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) settings = await SiteSettings.create({});
    return JSON.parse(JSON.stringify(settings));
  } catch {
    return defaultSettings;
  }
}

async function fetchLombaGroups() {
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

async function fetchGalleryImages() {
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

async function fetchParticipantStats(): Promise<ParticipantStats> {
  try {
    await connectDB();
    const results = await Participant.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const counts = { ...emptyStats };
    for (const row of results) {
      if (row._id in counts) {
        counts[row._id as keyof ParticipantStats] = row.count;
      }
    }
    return counts;
  } catch {
    return emptyStats;
  }
}

async function fetchParticipants(): Promise<PublicParticipant[]> {
  try {
    await connectDB();
    const participants = await Participant.find()
      .sort({ createdAt: -1 })
      .select("name age phone category status")
      .lean();
    return JSON.parse(JSON.stringify(participants));
  } catch {
    return [];
  }
}

const getCachedSettings = unstable_cache(fetchSettings, ["site-settings"], {
  revalidate: 60,
  tags: ["site-settings"],
});

const getCachedLombaGroups = unstable_cache(fetchLombaGroups, ["lomba-groups"], {
  revalidate: 60,
  tags: ["lomba-groups"],
});

const getCachedGalleryImages = unstable_cache(fetchGalleryImages, ["gallery-images"], {
  revalidate: 60,
  tags: ["gallery-images"],
});

const getCachedParticipantStats = unstable_cache(fetchParticipantStats, ["participant-stats"], {
  revalidate: 60,
  tags: ["participant-stats"],
});

const getCachedParticipants = unstable_cache(fetchParticipants, ["participants"], {
  revalidate: 60,
  tags: ["participants"],
});

export async function getSettings() {
  return getCachedSettings();
}

export async function getLombaGroups() {
  return getCachedLombaGroups();
}

export async function getGalleryImages() {
  return getCachedGalleryImages();
}

export async function getParticipantStats() {
  return getCachedParticipantStats();
}

export async function getParticipants() {
  return getCachedParticipants();
}

export async function getUniqueLomba(): Promise<string[]> {
  const groups = await getLombaGroups();
  const all = groups.flatMap((g: { lomba: string[] }) => g.lomba);
  return Array.from(new Set(all));
}

export async function getFreshSettings() {
  return fetchSettings();
}
