"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { maskPhone } from "@/lib/phone";
import type { PublicParticipant } from "@/lib/data";

const statusLabels: Record<string, { label: string; color: string }> = {
  terdaftar: { label: "Terdaftar", color: "bg-amber-100 text-amber-700" },
  lolos: { label: "Lolos", color: "bg-blue-100 text-blue-700" },
  juara1: { label: "Juara 1", color: "bg-green-100 text-green-700" },
  juara2: { label: "Juara 2", color: "bg-gray-100 text-gray-700" },
  juara3: { label: "Juara 3", color: "bg-orange-100 text-orange-700" },
  didiskualifikasi: { label: "Didiskualifikasi", color: "bg-red-100 text-red-700" },
};

interface PesertaListProps {
  participants: PublicParticipant[];
}

export default function PesertaList({ participants }: PesertaListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lombaFilter, setLombaFilter] = useState("all");

  const lombaOptions = [...new Set(participants.map((p) => p.category))].sort();

  const filtered = participants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchLomba = lombaFilter === "all" || p.category === lombaFilter;
    return matchSearch && matchStatus && matchLomba;
  });

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
          />
        </div>
        <select
          value={lombaFilter}
          onChange={(e) => setLombaFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#DC2626] sm:min-w-[180px]"
        >
          <option value="all">Semua Lomba</option>
          {lombaOptions.map((lomba) => (
            <option key={lomba} value={lomba}>
              {lomba}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#DC2626] sm:min-w-[160px]"
        >
          <option value="all">Semua Status</option>
          {Object.entries(statusLabels).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-20 text-center">
          <p className="text-gray-500">Tidak ada peserta yang ditemukan.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-700">No</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Nama</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Usia</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Telepon</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Lomba</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600">{p.age ?? "-"}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {p.phone ? maskPhone(p.phone) : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusLabels[p.status]?.color || "bg-gray-100 text-gray-700"}`}
                      >
                        {statusLabels[p.status]?.label || p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
