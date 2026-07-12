"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-white hover:text-[#DC2626] md:left-6 md:top-6"
      >
        <ArrowLeft size={16} />
        Beranda
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
      >
        <h1 className="mb-1 text-center text-xl font-extrabold text-[#DC2626]">ADMIN PANEL</h1>
        <p className="mb-6 text-center text-sm text-gray-500">RT 011 — 17 Agustus 2026</p>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-gray-700">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626]"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#DC2626]"
          />
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#DC2626] py-3 text-sm font-bold text-white hover:bg-[#B91C1C] disabled:opacity-60"
        >
          {loading ? "Masuk..." : "MASUK"}
        </button>
      </form>
    </main>
  );
}
