import Image from "next/image";
import Link from "next/link";
import { Images, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: { src: string; alt: string }[];
}

export default function Gallery({ images }: GalleryProps) {
  const preview = images.slice(0, 4);

  return (
    <section className="bg-[#fafafa] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-extrabold tracking-wide text-[#DC2626] md:text-3xl">
          GALERI KEGIATAN
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {preview.map((item, index) => (
            <div
              key={item.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-md transition-transform hover:scale-[1.02]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index < 2}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#DC2626] bg-white px-8 py-3 text-sm font-bold text-[#DC2626] transition-all hover:bg-[#DC2626] hover:text-white md:text-base"
          >
            <Images size={18} />
            LIHAT SEMUA GALERI
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
