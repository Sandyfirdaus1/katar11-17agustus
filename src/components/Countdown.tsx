"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Megaphone, UserPlus } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  settings: {
    countdownDate: string;
    countdownLabel: string;
    announcementTitle: string;
    announcementDeadline: string;
    announcementNote: string;
    registrationOpen: boolean;
  };
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate + "T00:00:00");
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return ZERO;

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatCount(value: number, label: string): string {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return label === "Hari" ? String(safe) : String(safe).padStart(2, "0");
}

function createStore(targetDate: string) {
  function getSnapshot(): string {
    const t = getTimeLeft(targetDate);
    return `${t.days}|${t.hours}|${t.minutes}|${t.seconds}`;
  }

  function parseSnapshot(snapshot: string): TimeLeft {
    const [days, hours, minutes, seconds] = snapshot.split("|").map(Number);
    return { days, hours, minutes, seconds };
  }

  function subscribe(callback: () => void) {
    const interval = setInterval(callback, 1000);
    const resync = () => {
      if (document.visibilityState === "visible") callback();
    };
    document.addEventListener("visibilitychange", resync);
    window.addEventListener("focus", resync);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", resync);
      window.removeEventListener("focus", resync);
    };
  }

  return { getSnapshot, parseSnapshot, subscribe };
}

export default function Countdown({ settings }: CountdownProps) {
  const store = createStore(settings.countdownDate);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, () => "0|0|0|0");
  const time = store.parseSnapshot(snapshot);

  const units = [
    { value: time.days, label: "Hari" },
    { value: time.hours, label: "Jam" },
    { value: time.minutes, label: "Menit" },
    { value: time.seconds, label: "Detik" },
  ];

  return (
    <section className="bg-[#fafafa] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="mb-6 text-xl font-extrabold tracking-wide text-[#DC2626] md:text-2xl">
              {settings.countdownLabel}
            </h2>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {units.map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-1 py-4 shadow-sm sm:px-4 sm:py-6"
                >
                  <span className="block w-full text-center text-xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
                    {formatCount(unit.value, unit.label)}
                  </span>
                  <span className="mt-2 block w-full text-center text-[10px] font-medium text-gray-500 sm:text-xs">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#DC2626] shadow-lg">
            <div className="flex items-start gap-4 p-6 md:p-8">
              <div className="flex-1">
                <h3 className="mb-4 text-lg font-extrabold text-white md:text-xl">
                  PENGUMUMAN PENTING
                </h3>
                <div className="rounded-xl bg-white p-5 shadow-inner">
                  <p className="text-sm font-bold leading-relaxed text-gray-900 md:text-base">
                    {settings.announcementTitle}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#DC2626] md:text-base">
                    {settings.announcementDeadline}
                  </p>
                  <p className="mt-3 text-xs text-gray-500">
                    {settings.announcementNote}
                  </p>
                  {settings.registrationOpen && (
                    <Link
                      href="/daftar"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B91C1C]"
                    >
                      <UserPlus size={18} />
                      DAFTAR SEKARANG
                    </Link>
                  )}
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Megaphone size={40} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
