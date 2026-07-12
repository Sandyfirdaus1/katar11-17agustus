import Link from "next/link";
import {
  UserCheck,
  TrendingUp,
  Trophy,
  Medal,
  Award,
  UserX,
  ChevronRight,
  Users,
} from "lucide-react";

interface StatusCounts {
  terdaftar: number;
  lolos: number;
  juara1: number;
  juara2: number;
  juara3: number;
  didiskualifikasi: number;
}

const statusConfig = [
  {
    key: "terdaftar" as const,
    label: "Terdaftar",
    desc: "Peserta yang telah mendaftar",
    icon: UserCheck,
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-200",
  },
  {
    key: "lolos" as const,
    label: "Lolos",
    desc: "Peserta yang lolos seleksi",
    icon: TrendingUp,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-200",
  },
  {
    key: "juara1" as const,
    label: "Juara 1",
    desc: "Pemenang peringkat pertama",
    icon: Trophy,
    bg: "bg-green-100",
    iconColor: "text-green-600",
    border: "border-green-200",
  },
  {
    key: "juara2" as const,
    label: "Juara 2",
    desc: "Pemenang peringkat kedua",
    icon: Medal,
    bg: "bg-gray-100",
    iconColor: "text-gray-600",
    border: "border-gray-200",
  },
  {
    key: "juara3" as const,
    label: "Juara 3",
    desc: "Pemenang peringkat ketiga",
    icon: Award,
    bg: "bg-orange-100",
    iconColor: "text-orange-700",
    border: "border-orange-200",
  },
  {
    key: "didiskualifikasi" as const,
    label: "Didiskualifikasi",
    desc: "Peserta yang tidak memenuhi syarat",
    icon: UserX,
    bg: "bg-red-100",
    iconColor: "text-red-600",
    border: "border-red-200",
  },
];

interface ParticipantInfoProps {
  counts: StatusCounts;
}

export default function ParticipantInfo({ counts }: ParticipantInfoProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl font-extrabold tracking-wide text-[#DC2626] md:text-3xl">
          INFORMASI PESERTA
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statusConfig.map((status) => (
            <div
              key={status.key}
              className={`flex flex-col items-center rounded-xl border ${status.border} bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md md:p-5`}
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${status.bg}`}
              >
                <status.icon size={26} className={status.iconColor} />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{counts[status.key]}</p>
              <p className="mt-1 text-sm font-bold text-gray-800">{status.label}</p>
              <p className="mt-1 text-xs text-gray-500">{status.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/peserta"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#DC2626] px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all hover:bg-[#B91C1C] hover:shadow-xl md:text-base"
        >
          <Users size={20} />
          LIHAT DAFTAR PESERTA
          <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  );
}
