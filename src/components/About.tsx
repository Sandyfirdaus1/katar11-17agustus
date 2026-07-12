interface AboutProps {
  settings: {
    aboutHighlight: string;
    aboutDescription: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventAudience: string;
  };
}

const infoKeys = [
  { key: "eventDate" as const, title: "TANGGAL" },
  { key: "eventTime" as const, title: "WAKTU" },
  { key: "eventLocation" as const, title: "LOKASI" },
  { key: "eventAudience" as const, title: "UNTUK SEMUA USIA" },
];

export default function About({ settings }: AboutProps) {
  return (
    <section className="bg-[#f5f5f5] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md md:p-8">
            <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <h2 className="mb-4 text-xl font-extrabold tracking-wide text-[#DC2626] md:text-2xl">
                  TENTANG ACARA
                </h2>
                <p className="text-sm leading-relaxed text-gray-800 md:text-[15px]">
                  <span className="mb-1 block whitespace-nowrap text-[11px] font-bold sm:text-sm md:text-[15px]">
                    {settings.aboutHighlight}
                  </span>
                  {settings.aboutDescription}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-center sm:w-[200px] md:w-[220px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gambar2.png"
                  alt="Ilustrasi warga merayakan kemerdekaan Indonesia"
                  className="h-auto w-full max-w-[220px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="grid grid-cols-2 divide-x divide-gray-200 md:grid-cols-4">
              {infoKeys.map((card, index) => (
                <div
                  key={card.title}
                  className={`flex flex-col items-center px-4 py-8 text-center ${
                    index % 2 === 0 ? "border-b border-gray-200 md:border-b-0" : ""
                  } ${index < 2 ? "border-b border-gray-200 md:border-b-0" : ""}`}
                >
                  <p className="mb-2 text-xs font-extrabold tracking-wide text-gray-900 md:text-sm">
                    {card.title}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 md:text-sm">
                    {settings[card.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
