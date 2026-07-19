"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, UserPlus, Lock } from "lucide-react";
import { getLombaForAge } from "@/lib/lomba-age";

interface LombaGroupItem {
  age: string;
  lomba: string[];
  isTeam?: boolean;
  teamSize?: 2 | 3 | 4;
}

interface DaftarFormProps {
  lombaGroups: LombaGroupItem[];
  registrationOpen: boolean;
}

export default function DaftarForm({ lombaGroups, registrationOpen }: DaftarFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
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
    setCategories((prev) => prev.filter((cat) => availableLomba.includes(cat)));
  }, [availableLomba]);

  useEffect(() => {
    const hasTeamLomba = categories.some(cat => {
      const group = lombaGroups.find(g => g.lomba.includes(cat));
      return group?.isTeam;
    });

    if (hasTeamLomba) {
      const teamLomba = categories.find(cat => {
        const group = lombaGroups.find(g => g.lomba.includes(cat));
        return group?.isTeam;
      });
      if (teamLomba) {
        const group = lombaGroups.find(g => g.lomba.includes(teamLomba));
        const requiredSize = group?.teamSize || 2;
        // Jumlah input = requiredSize - 1 (karena pendaftar utama + anggota tim)
        const inputCount = requiredSize - 1;

        if (teamMembers.length !== inputCount) {
          setTeamMembers(Array(inputCount).fill(""));
        }
      }
    } else {
      setTeamMembers([]);
    }
  }, [categories, lombaGroups]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Nama wajib diisi.");
      setLoading(false);
      return;
    }
    if (!age) {
      setError("Usia wajib diisi.");
      setLoading(false);
      return;
    }
    if (!phone.trim()) {
      setError("Nomor telepon wajib diisi.");
      setLoading(false);
      return;
    }
    if (!address.trim()) {
      setError("Alamat wajib diisi.");
      setLoading(false);
      return;
    }
    if (categories.length === 0) {
      setError("Pilih minimal satu lomba.");
      setLoading(false);
      return;
    }

    const ageNum = Number(age);
    if (ageNum < 1 || ageNum > 120) {
      setError("Usia harus diisi dengan angka antara 1–120.");
      setLoading(false);
      return;
    }

    // Check if any selected category is not valid for age
    const invalidCategory = categories.find(cat => !availableLomba.includes(cat));
    if (invalidCategory) {
      setError(`Pilihan lomba "${invalidCategory}" tidak sesuai dengan usia Anda.`);
      setLoading(false);
      return;
    }

    // Check if any selected category is a team competition
    const hasTeamLomba = categories.some(cat => {
      const group = lombaGroups.find(g => g.lomba.includes(cat));
      return group?.isTeam;
    });

    // Check if team member names are filled for team competitions
    if (hasTeamLomba) {
      const emptyMembers = teamMembers.filter(m => !m.trim());
      if (emptyMembers.length > 0) {
        setError(`Semua nama anggota tim wajib diisi.`);
        setLoading(false);
        return;
      }

      // Check for duplicate names in team members
      const trimmedMembers = teamMembers.map(m => m.trim().toLowerCase());
      const uniqueMembers = new Set(trimmedMembers);
      if (uniqueMembers.size !== trimmedMembers.length) {
        setError("Nama anggota tim tidak boleh ada yang sama.");
        setLoading(false);
        return;
      }

      // Check if team member name is same as main registrant name
      if (trimmedMembers.includes(name.trim().toLowerCase())) {
        setError("Nama anggota tim tidak boleh sama dengan nama pendaftar.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: ageNum, phone, address, categories, teamMembers }),
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
      setAddress("");
      setCategories([]);
      setTeamMembers([]);
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
        <a
          href="/"
          className="mt-4 inline-block rounded-lg bg-[#DC2626] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#B91C1C]"
        >
          Kembali ke Beranda
        </a>
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
        <a
          href="/"
          className="mt-4 inline-block rounded-lg bg-[#DC2626] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#B91C1C]"
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Perhatian:</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Nama yang sama tidak diperbolehkan mendaftar lebih dari satu kali</li>
            <li>Lomba tim (Estafet Air) total 4 orang (Anda + 3 anggota tim)</li>
            <li>Lomba tim kecil (Balap Bakiak) total 3 orang (Anda + 2 anggota tim)</li>
            <li>Lomba tim pasangan (Joget Jeruk) total 2 orang (Anda + 1 anggota tim)</li>
            <li>Untuk lomba tim, gunakan kata "dan" antar nama anggota tim (contoh: Budi dan Andi dan Citra)</li>
            <li>Pastikan data yang Anda isi sudah benar sebelum mengirim formulir</li>
          </ul>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-700">
            Nama
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama"
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

        <div className="mb-4">
          <label htmlFor="address" className="mb-1 block text-sm font-semibold text-gray-700">
            Alamat
          </label>
          <textarea
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat lengkap"
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Pilihan Lomba (bisa pilih lebih dari satu)
          </label>
          {!isValidAge ? (
            <p className="text-sm text-gray-500">Isi usia terlebih dahulu</p>
          ) : availableLomba.length === 0 ? (
            <p className="text-sm text-gray-500">Tidak ada lomba untuk usia ini</p>
          ) : (
            <div className="space-y-2">
              {availableLomba.map((lomba) => {
                const group = lombaGroups.find(g => g.lomba.includes(lomba));
                const isTeam = group?.isTeam;
                const teamSize = group?.teamSize;
                return (
                  <label key={lomba} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={lomba}
                      checked={categories.includes(lomba)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategories([...categories, lomba]);
                        } else {
                          setCategories(categories.filter(c => c !== lomba));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
                    />
                    <span className="text-sm text-gray-700">
                      {lomba}
                      {isTeam && teamSize && (
                        <span className="ml-2 text-xs text-blue-600 font-medium">(Tim {teamSize} Orang)</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          {isValidAge && availableLomba.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Menampilkan {availableLomba.length} lomba sesuai usia {ageNum} tahun
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Terpilih: {categories.length} lomba
          </p>
        </div>

        {categories.length > 0 && categories.some(cat => {
          const group = lombaGroups.find(g => g.lomba.includes(cat));
          return group?.isTeam;
        }) && (
          <>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Anggota Tim Lainnya <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {teamMembers.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    required
                    value={member}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = e.target.value;
                      setTeamMembers(newMembers);
                    }}
                    placeholder={`Nama anggota tim ${index + 1}`}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {teamMembers.length} orang anggota tim lainnya (selain Anda)
              </p>
            </div>
          </>
        )}

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
