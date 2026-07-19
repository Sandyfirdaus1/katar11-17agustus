import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSettings, getLombaGroups } from "@/lib/data";
import DaftarForm from "./DaftarForm";

export const revalidate = 60;

export default async function DaftarPage() {
  const [settings, lombaGroups] = await Promise.all([getSettings(), getLombaGroups()]);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="bg-[#DC2626] py-8 text-white">
        <div className="mx-auto max-w-lg px-4 md:px-6">
          <a
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </a>
          <h1 className="text-2xl font-extrabold md:text-3xl">PENDAFTARAN LOMBA</h1>
          <p className="mt-1 text-sm text-white/80">17 Agustus 2026 — Lingkungan RT 011</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8 md:px-6">
        <DaftarForm
          lombaGroups={lombaGroups}
          registrationOpen={settings.registrationOpen !== false}
          attentionNote={settings.attentionNote || "Nama yang sama tidak diperbolehkan mendaftar lebih dari satu kali\nLomba tim (Estafet Air) total 4 orang (Anda + 3 anggota tim)\nLomba tim kecil (Balap Bakiak) total 3 orang (Anda + 2 anggota tim)\nLomba tim pasangan (Joget Jeruk) total 2 orang (Anda + 1 anggota tim)\nUntuk lomba tim, gunakan kata \"dan\" antar nama anggota tim (contoh: Budi dan Andi dan Citra)\nPastikan data yang Anda isi sudah benar sebelum mengirim formulir"}
        />
      </div>
    </main>
  );
}
