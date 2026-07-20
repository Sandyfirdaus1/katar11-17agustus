export default function Hero() {
  return (
    <section className="flex h-screen w-full items-start justify-center overflow-hidden bg-[#f5f0eb] md:items-center">
      <picture className="h-full w-full">
        <source media="(min-width: 1536px)" srcSet="/beranda_1920x1080.png" />
        <source media="(min-width: 1024px)" srcSet="/beranda_1366x768.png" />
        <source media="(min-width: 768px)" srcSet="/beranda-ipad.png" />
        <img
          src="/beranda-mobile.png"
          alt="Dirgahayu Republik Indonesia - Crew 011 17 Agustus 2026"
          className="h-full w-full object-contain object-top md:object-center"
          fetchPriority="high"
        />
      </picture>
    </section>
  );
}
