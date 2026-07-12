import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getGalleryImages } from "@/lib/data";

export const revalidate = 60;

export default async function GaleriPage() {
  const images = await getGalleryImages();

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
          <h1 className="text-2xl font-extrabold md:text-3xl">GALERI KEGIATAN</h1>
          <p className="mt-1 text-sm text-white/80">
            Dokumentasi lomba 17 Agustus Lingkungan RT 011
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((item: { src: string; alt: string }, index: number) => (
            <div
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-md transition-transform hover:scale-[1.02]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
