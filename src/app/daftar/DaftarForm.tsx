"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, UserPlus, Lock } from "lucide-react";
import { getLombaForAge } from "@/lib/lomba-age";

interface LombaGroupItem {
  age: string;
  lomba: string[];
}

interface DaftarFormProps {
  lombaGroups: LombaGroupItem[];
  registrationOpen: boolean;
}

export default function DaftarForm({ lombaGroups, registrationOpen }: DaftarFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const ageNum = Number(age);
  const isValidAge = age !== "" && ageNum >= 1 && ageNum <= 120;
  const availableLomba = useMemo(
    () => (isValidAge ? getLombaForAge(lombaGroups, ageNum) : []),
    [lombaGroups, isValidAge, ageNum]
  );

  useEffect(() => {
    if (category && !availableLomba.includes(category)) {
      setCategory("");
    }
  }, [availableLomba, category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim() || !age || !phone.trim() || !category) {
      setError("Semua field wajib diisi.");
      setLoading(false);
      return;
    }

    const ageNum = Number(age);
    if (ageNum < 1 || ageNum > 120) {
      setError("Usia harus diisi dengan angka antara 1–120.");
      setLoading(false);
      return;
    }

    if (!availableLomba.includes(category)) {
      setError("Pilihan lomba tidak sesuai dengan usia Anda.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: ageNum, phone, category, status: "terdaftar" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar. Silakan coba lagi.");
        return;
      }

      setSuccess(true);
      setName("");
      setAge("");
      setPhone("");
      setCategory("");
    } catch {
      setError("Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-bold text-green-800">Pendaftaran berhasil!</p>
        <p className="mt-2 text-sm text-green-700">
          Terima kasih telah mendaftar. Sampai jumpa di acara!
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-[#DC2626] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#B91C1C]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <Lock size={32} className="mx-auto mb-3 text-red-500" />
        <p className="font-bold text-red-800">Pendaftaran Ditutup</p>
        <p className="mt-2 text-sm text-red-700">
          Pendaftaran lomba sudah ditutup. Silakan hubungi panitia untuk info lebih lanjut.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-[#DC2626] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#B91C1C]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <span className="font-bold">Perhatian:</span> Nama yang sama tidak diperbolehkan
          mendaftar lebih dari satu kali. Pastikan data yang Anda isi sudah benar sebelum
          mengirim formulir.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-700">
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="mb-1 block text-sm font-semibold text-gray-700">
            Usia
          </label>
          <input
            id="age"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            maxLength={3}
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
            placeholder="Masukkan usia (angka saja)"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-gray-700">
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="mb-1 block text-sm font-semibold text-gray-700">
            Pilihan Lomba
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!isValidAge || availableLomba.length === 0}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">
              {!isValidAge
                ? "Isi usia terlebih dahulu"
                : availableLomba.length === 0
                  ? "Tidak ada lomba untuk usia ini"
                  : "Pilih lomba"}
            </option>
            {availableLomba.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {isValidAge && availableLomba.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Menampilkan {availableLomba.length} lomba sesuai usia {ageNum} tahun
            </p>
          )}
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DC2626] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#B91C1C] disabled:opacity-60"
        >
          <UserPlus size={18} />
          {loading ? "Mendaftar..." : "DAFTAR SEKARANG"}
        </button>
      </form>
    </>
  );
}
