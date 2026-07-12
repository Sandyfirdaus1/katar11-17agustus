import Hero from "@/components/Hero";
import About from "@/components/About";
import Lomba from "@/components/Lomba";
import Countdown from "@/components/Countdown";
import ParticipantInfo from "@/components/ParticipantInfo";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { getSettings, getLombaGroups, getGalleryImages, getParticipantStats } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [counts, settings, lombaGroups, gallery] = await Promise.all([
    getParticipantStats(),
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
