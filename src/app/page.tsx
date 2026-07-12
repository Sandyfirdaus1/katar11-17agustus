import Hero from "@/components/Hero";
import About from "@/components/About";
import Lomba from "@/components/Lomba";
import Countdown from "@/components/Countdown";
import ParticipantInfo from "@/components/ParticipantInfo";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { connectDB } from "@/lib/mongodb";
import { Participant } from "@/models/Participant";
import { getSettings, getLombaGroups, getGalleryImages } from "@/lib/data";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    await connectDB();
    const statuses = ["terdaftar", "lolos", "juara1", "juara2", "juara3", "didiskualifikasi"] as const;
    const counts = { terdaftar: 0, lolos: 0, juara1: 0, juara2: 0, juara3: 0, didiskualifikasi: 0 };
    for (const status of statuses) {
      counts[status] = await Participant.countDocuments({ status });
    }
    return counts;
  } catch {
    return { terdaftar: 0, lolos: 0, juara1: 0, juara2: 0, juara3: 0, didiskualifikasi: 0 };
  }
}

export default async function Home() {
  const [counts, settings, lombaGroups, gallery] = await Promise.all([
    getStats(),
    getSettings(),
    getLombaGroups(),
    getGalleryImages(),
  ]);

  return (
    <main className="min-h-screen">
      <Hero />
      <About settings={settings} />
      <Lomba groups={lombaGroups} />
      <Countdown settings={settings} />
      <ParticipantInfo counts={counts} />
      <Gallery images={gallery} />
      <Footer settings={settings} />
    </main>
  );
}
