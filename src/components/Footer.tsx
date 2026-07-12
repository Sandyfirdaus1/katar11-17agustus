import { Phone, MapPin } from "lucide-react";

interface FooterProps {
  settings: {
    whatsapp: string;
    whatsappLabel: string;
    whatsappLink: string;
    locationName: string;
    locationAddress: string;
    footerCopyright: string;
    footerCredit: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const contacts = [
    {
      icon: Phone,
      title: "WhatsApp",
      value: settings.whatsapp,
      sub: settings.whatsappLabel,
      href: `https://wa.me/${settings.whatsappLink}`,
    },
    {
      icon: MapPin,
      title: "Lokasi",
      value: settings.locationName,
      sub: settings.locationAddress,
      href: "#",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <svg viewBox="0 0 1200 120" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="#DC2626"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold tracking-wide text-[#DC2626] md:text-3xl">
          HUBUNGI KAMI
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {contacts.map((contact) => (
            <a
              key={contact.title}
              href={contact.href}
              className="flex w-full max-w-xs flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:border-[#DC2626]/30 hover:shadow-md sm:w-auto sm:min-w-[220px]"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#DC2626] text-white">
                <contact.icon size={22} />
              </div>
              <p className="text-xs font-medium text-gray-500">{contact.title}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{contact.value}</p>
              <p className="mt-1 text-xs text-gray-500">{contact.sub}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="relative bg-[#991B1B] px-4 py-4 text-center">
        <p className="text-xs text-white/90 md:text-sm">{settings.footerCopyright}</p>
        <p className="mt-1 text-xs text-white/70 md:text-sm">{settings.footerCredit}</p>
      </div>
    </footer>
  );
}
