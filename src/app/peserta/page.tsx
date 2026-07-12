import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getParticipants } from "@/lib/data";
import PesertaList from "./PesertaList";

export const revalidate = 60;

export default async function PesertaPage() {
  const participants = await getParticipants();

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="bg-[#DC2626] py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-extrabold md:text-3xl">DAFTAR PESERTA</h1>
          <p className="mt-1 text-sm text-white/80">
            Lomba 17 Agustus 2026 - Lingkungan RT 011
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PesertaList participants={participants} />
      </div>
    </main>
  );
}
