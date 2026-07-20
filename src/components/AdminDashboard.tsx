"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Settings,
  Trophy,
  Images,
  Users,
  LogOut,
  Save,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Check,
} from "lucide-react";

type Tab = "settings" | "lomba" | "galeri" | "peserta";

interface SiteSettings {
  aboutHighlight: string;
  aboutDescription: string;
  countdownDate: string;
  countdownLabel: string;
  announcementTitle: string;
  announcementDeadline: string;
  announcementNote: string;
  registrationOpen: boolean;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventAudience: string;
  whatsapp: string;
  whatsappLabel: string;
  whatsappLink: string;
  locationName: string;
  locationAddress: string;
  footerCopyright: string;
  footerCredit: string;
  attentionNote: string;
}

interface LombaItem {
  _id: string;
  group: string;
  age: string;
  lomba: string[];
  lombaRaw?: string;
  order: number;
}

interface GalleryItem {
  _id: string;
  src: string;
  alt: string;
  year: number;
  order: number;
}

interface Participant {
  _id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  categories?: string[];
  category?: string;
  status?: string;
  lombaStatuses?: { [key: string]: string };
}

const statusOptions = [
  { value: "terdaftar", label: "Terdaftar" },
  { value: "lolos", label: "Lolos" },
  { value: "juara1", label: "Juara 1" },
  { value: "juara2", label: "Juara 2" },
  { value: "juara3", label: "Juara 3" },
  { value: "didiskualifikasi", label: "Didiskualifikasi" },
];

const tabs = [
  { id: "settings" as Tab, label: "Pengaturan", icon: Settings },
  { id: "lomba" as Tab, label: "Lomba", icon: Trophy },
  { id: "galeri" as Tab, label: "Galeri", icon: Images },
  { id: "peserta" as Tab, label: "Peserta", icon: Users },
];

const DEFAULT_SETTINGS: SiteSettings = {
  aboutHighlight: "Kegiatan 17 Agustus 2026 RT 011",
  aboutDescription:
    "merupakan wujud rasa syukur atas kemerdekaan Indonesia. Mari kita pererat persaudaraan, junjung sportivitas, dan ciptakan momen berharga bersama.",
  countdownDate: "2026-08-17",
  countdownLabel: "MENUJU 17 AGUSTUS 2026",
  announcementTitle: "PENDAFTARAN DITUTUP",
  announcementDeadline: "16 AGUSTUS 2026 PUKUL 21.00 WIB",
  announcementNote: "Segera daftarkan diri Anda untuk mengikuti berbagai lomba menarik!",
  registrationOpen: true,
  eventDate: "17 AGUSTUS 2026",
  eventTime: "08.00 - SELESAI",
  eventLocation: "LINGKUNGAN RT 011",
  eventAudience: "BALITA HINGGA DEWASA",
  whatsapp: "0895-1787-2311",
  whatsappLabel: "Pengelola Web Lomba 17 Agustus",
  whatsappLink: "6289517872311",
  locationName: "Lingkungan RT 011",
  locationAddress: "Jl Walang Sari Raya",
  footerCopyright: "© 2026 Crew 011. Dirgahayu Republik Indonesia.",
  footerCredit: "Dibuat Oleh Shandy",
  attentionNote: "Nama yang sama tidak diperbolehkan mendaftar lebih dari satu kali\nLomba tim (Estafet Air) total 4 orang (Anda + 3 anggota tim)\nLomba tim kecil (Balap Bakiak) total 3 orang (Anda + 2 anggota tim)\nLomba tim pasangan (Joget Jeruk) total 2 orang (Anda + 1 anggota tim)\nUntuk lomba tim, gunakan kata \"dan\" antar nama anggota tim (contoh: Budi dan Andi dan Citra)\nPastikan data yang Anda isi sudah benar sebelum mengirim formulir",
};

function normalizeSettings(data: Partial<SiteSettings>): SiteSettings {
  return {
    aboutHighlight: data.aboutHighlight ?? DEFAULT_SETTINGS.aboutHighlight,
    aboutDescription: data.aboutDescription ?? DEFAULT_SETTINGS.aboutDescription,
    countdownDate: data.countdownDate ?? DEFAULT_SETTINGS.countdownDate,
    countdownLabel: data.countdownLabel ?? DEFAULT_SETTINGS.countdownLabel,
    announcementTitle: data.announcementTitle ?? DEFAULT_SETTINGS.announcementTitle,
    announcementDeadline: data.announcementDeadline ?? DEFAULT_SETTINGS.announcementDeadline,
    announcementNote: data.announcementNote ?? DEFAULT_SETTINGS.announcementNote,
    registrationOpen: data.registrationOpen ?? DEFAULT_SETTINGS.registrationOpen,
    eventDate: data.eventDate ?? DEFAULT_SETTINGS.eventDate,
    eventTime: data.eventTime ?? DEFAULT_SETTINGS.eventTime,
    eventLocation: data.eventLocation ?? DEFAULT_SETTINGS.eventLocation,
    eventAudience: data.eventAudience ?? DEFAULT_SETTINGS.eventAudience,
    whatsapp: data.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
    whatsappLabel: data.whatsappLabel ?? DEFAULT_SETTINGS.whatsappLabel,
    whatsappLink: data.whatsappLink ?? DEFAULT_SETTINGS.whatsappLink,
    locationName: data.locationName ?? DEFAULT_SETTINGS.locationName,
    locationAddress: data.locationAddress ?? DEFAULT_SETTINGS.locationAddress,
    footerCopyright: data.footerCopyright ?? DEFAULT_SETTINGS.footerCopyright,
    footerCredit: data.footerCredit ?? DEFAULT_SETTINGS.footerCredit,
    attentionNote: data.attentionNote ?? DEFAULT_SETTINGS.attentionNote,
  };
}

function Input({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DC2626]"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DC2626]"
      />
    </div>
  );
}

function TabLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC2626] mb-3"></div>
      <p>Memuat data...</p>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("settings");

  useEffect(() => {
    const savedTab = localStorage.getItem("admin_active_tab") as Tab;
    if (savedTab && ["settings", "lomba", "galeri", "peserta"].includes(savedTab)) {
      setTab(savedTab);
    }
  }, []);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    localStorage.setItem("admin_active_tab", newTab);
  };

  const [authChecking, setAuthChecking] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [lombaLoading, setLombaLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [lombaGroups, setLombaGroups] = useState<LombaItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [newLomba, setNewLomba] = useState({ group: "", age: "", lomba: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadYear, setUploadYear] = useState(String(new Date().getFullYear()));
  const [savingGalleryId, setSavingGalleryId] = useState<string | null>(null);
  const [savedGalleryId, setSavedGalleryId] = useState<string | null>(null);
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantLombaFilter, setParticipantLombaFilter] = useState("all");
  const [participantStatusFilter, setParticipantStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setAuthChecking(false);
          loadAllData();
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  async function loadAllData() {
    // Fetch settings
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(normalizeSettings(data));
        setSettingsLoading(false);
      })
      .catch(() => setSettingsLoading(false));

    // Fetch lomba
    fetch("/api/admin/lomba")
      .then((r) => r.json())
      .then((data) => {
        const dataWithRaw = Array.isArray(data) ? data.map((item: LombaItem) => ({
          ...item,
          lombaRaw: item.lomba.join(", ")
        })) : [];
        setLombaGroups(dataWithRaw);
        setLombaLoading(false);
      })
      .catch(() => setLombaLoading(false));

    // Fetch gallery
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        setGallery(Array.isArray(data) ? data : []);
        setGalleryLoading(false);
      })
      .catch(() => setGalleryLoading(false));

    // Fetch participants
    fetch(`/api/participants?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        setParticipants(Array.isArray(data) ? data : []);
        setParticipantsLoading(false);
      })
      .catch(() => setParticipantsLoading(false));
  }

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    showMsg(res.ok ? "Pengaturan berhasil disimpan!" : "Gagal menyimpan");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function addLombaGroup() {
    if (!newLomba.group || !newLomba.age) return;
    const res = await fetch("/api/admin/lomba", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group: newLomba.group,
        age: newLomba.age,
        lomba: newLomba.lomba.split(",").map((s) => s.trim()).filter(Boolean),
        order: lombaGroups.length,
      }),
    });
    if (res.ok) {
      setNewLomba({ group: "", age: "", lomba: "" });
      const data = await fetch("/api/admin/lomba").then((r) => r.json());
      setLombaGroups(data);
      showMsg("Kategori lomba ditambahkan");
    }
  }

  async function updateLombaGroup(id: string, data: Partial<LombaItem>) {
    await fetch(`/api/admin/lomba/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await fetch("/api/admin/lomba").then((r) => r.json());
    setLombaGroups(updated);
    showMsg("Lomba diperbarui");
  }

  async function deleteLombaGroup(id: string) {
    if (!confirm("Hapus kategori lomba ini?")) return;
    await fetch(`/api/admin/lomba/${id}`, { method: "DELETE" });
    setLombaGroups((prev) => prev.filter((g) => g._id !== id));
    showMsg("Kategori lomba dihapus");
  }

  async function uploadGallery() {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("year", uploadYear);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
    if (res.ok) {
      setUploadFile(null);
      const data = await fetch("/api/admin/gallery").then((r) => r.json());
      setGallery(data);
      showMsg("Gambar berhasil diupload");
    }
  }

  async function saveGalleryYear(id: string, year: number) {
    if (!year || year < 2000 || year > 2100) {
      showMsg("Tahun harus diisi antara 2000–2100");
      return;
    }

    setSavingGalleryId(id);
    setSavedGalleryId(null);

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });

      if (!res.ok) {
        showMsg("Gagal menyimpan tahun galeri");
        return;
      }

      const updated = await fetch("/api/admin/gallery").then((r) => r.json());
      setGallery(updated);
      setSavedGalleryId(id);
      showMsg("Tahun galeri berhasil disimpan!");
      setTimeout(() => {
        setSavedGalleryId((current) => (current === id ? null : current));
      }, 3000);
    } catch {
      showMsg("Gagal menyimpan tahun galeri");
    } finally {
      setSavingGalleryId(null);
    }
  }

  async function deleteGallery(id: string) {
    if (!confirm("Hapus gambar ini?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setGallery((prev) => prev.filter((g) => g._id !== id));
    showMsg("Gambar dihapus");
  }

  async function updateParticipant(id: string, lomba: string, status: string) {
    const participant = participants.find((p) => p._id === id);
    if (!participant) return;

    const updatedLombaStatuses = {
      ...(participant.lombaStatuses || {}),
      [lomba]: status,
    };

    await fetch(`/api/admin/participants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lombaStatuses: updatedLombaStatuses }),
    });
    setParticipants((prev) =>
      prev.map((p) => (p._id === id ? { ...p, lombaStatuses: updatedLombaStatuses } : p))
    );
    showMsg("Status lomba peserta diperbarui");
  }

  async function deleteParticipant(id: string) {
    const participant = participants.find((p) => p._id === id);
    if (!participant) return;

    if (participantLombaFilter === "all") {
      if (!confirm("Hapus peserta ini?")) return;
      await fetch(`/api/admin/participants/${id}`, { method: "DELETE" });
      setParticipants((prev) => prev.filter((p) => p._id !== id));
      showMsg("Peserta dihapus");
    } else {
      if (!confirm(`Hapus lomba "${participantLombaFilter}" dari peserta ini?`)) return;
      
      const updatedCategories = (participant.categories || []).filter((c) => c !== participantLombaFilter);
      const updatedLombaStatuses = participant.lombaStatuses ? Object.fromEntries(
        Object.entries(participant.lombaStatuses).filter(([key]) => key !== participantLombaFilter)
      ) : {};

      await fetch(`/api/admin/participants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          categories: updatedCategories,
          lombaStatuses: updatedLombaStatuses
        }),
      });
      
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, categories: updatedCategories, lombaStatuses: updatedLombaStatuses }
            : p
        )
      );
      showMsg(`Lomba "${participantLombaFilter}" dihapus dari peserta`);
    }
  }


  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <p className="text-gray-500 font-medium">Memuat...</p>
      </div>
    );
  }

  const lombaOptions = Array.from(
    new Set([
      ...lombaGroups.flatMap((g) => g.lomba),
      ...participants.flatMap((p) => {
        const cats = p.categories || [];
        const legacyCat = (p as any).category;
        if (legacyCat && !cats.includes(legacyCat)) {
          return [...cats, legacyCat];
        }
        return cats;
      }),
    ])
  ).sort();

  const filteredParticipants = participants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.phone.includes(participantSearch) ||
      (p.address && p.address.toLowerCase().includes(participantSearch.toLowerCase()));
    const matchLomba =
      participantLombaFilter === "all" || 
      (p.categories && p.categories.includes(participantLombaFilter)) ||
      ((p as any).category === participantLombaFilter);
    const matchStatus =
      participantStatusFilter === "all" || 
      (participantLombaFilter === "all" 
        ? (p.lombaStatuses && Object.keys(p.lombaStatuses).length > 0 
          ? Object.values(p.lombaStatuses).some((status) => status === participantStatusFilter)
          : p.status === participantStatusFilter)
        : (p.lombaStatuses?.[participantLombaFilter] || p.status) === participantStatusFilter);
    return matchSearch && matchLomba && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-[#DC2626] px-4 py-4 text-white md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold md:text-xl">ADMIN PANEL</h1>
            <p className="text-xs text-white/70">RT 011 — 17 Agustus 2026</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      {message && (
        <div className="bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white">
          {message}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "bg-[#DC2626] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {tab === "settings" && (
            settingsLoading || !settings ? (
              <TabLoader />
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-extrabold text-[#DC2626]">Pengaturan Website</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Judul Tentang Acara" value={settings.aboutHighlight} onChange={(v) => setSettings({ ...settings, aboutHighlight: v })} />
                  <Input label="Tanggal Acara" value={settings.eventDate} onChange={(v) => setSettings({ ...settings, eventDate: v })} />
                  <Input label="Waktu Acara" value={settings.eventTime} onChange={(v) => setSettings({ ...settings, eventTime: v })} />
                  <Input label="Lokasi Acara" value={settings.eventLocation} onChange={(v) => setSettings({ ...settings, eventLocation: v })} />
                  <Input label="Target Usia" value={settings.eventAudience} onChange={(v) => setSettings({ ...settings, eventAudience: v })} />
                  <Input label="Tanggal Countdown" value={settings.countdownDate} onChange={(v) => setSettings({ ...settings, countdownDate: v })} type="date" />
                  <Input label="Label Countdown" value={settings.countdownLabel} onChange={(v) => setSettings({ ...settings, countdownLabel: v })} />
                </div>

                <Textarea label="Deskripsi Tentang Acara" value={settings.aboutDescription} onChange={(v) => setSettings({ ...settings, aboutDescription: v })} />

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="mb-3 text-sm font-extrabold text-gray-800">Pengumuman & Pendaftaran</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label="Judul Pengumuman" value={settings.announcementTitle} onChange={(v) => setSettings({ ...settings, announcementTitle: v })} />
                    <Input label="Batas Pendaftaran" value={settings.announcementDeadline} onChange={(v) => setSettings({ ...settings, announcementDeadline: v })} />
                  </div>
                  <div className="mt-4">
                    <Textarea label="Catatan Pengumuman" value={settings.announcementNote} onChange={(v) => setSettings({ ...settings, announcementNote: v })} />
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, registrationOpen: !settings.registrationOpen })}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold"
                  >
                    {settings.registrationOpen ? (
                      <ToggleRight size={28} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={28} className="text-red-500" />
                    )}
                    Pendaftaran {settings.registrationOpen ? "DIBUKA" : "DITUTUP"}
                  </button>
                  <div className="mt-4">
                    <Textarea label="Catatan Perhatian di Form Pendaftaran" value={settings.attentionNote} onChange={(v) => setSettings({ ...settings, attentionNote: v })} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="mb-3 text-sm font-extrabold text-gray-800">Kontak & Footer</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label="WhatsApp" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
                    <Input label="Label WhatsApp" value={settings.whatsappLabel} onChange={(v) => setSettings({ ...settings, whatsappLabel: v })} />
                    <Input label="Link WhatsApp (62xxx)" value={settings.whatsappLink} onChange={(v) => setSettings({ ...settings, whatsappLink: v })} />
                    <Input label="Nama Lokasi" value={settings.locationName} onChange={(v) => setSettings({ ...settings, locationName: v })} />
                    <Input label="Alamat Lokasi" value={settings.locationAddress} onChange={(v) => setSettings({ ...settings, locationAddress: v })} />
                    <Input label="Copyright Footer" value={settings.footerCopyright} onChange={(v) => setSettings({ ...settings, footerCopyright: v })} />
                    <Input label="Credit Footer" value={settings.footerCredit} onChange={(v) => setSettings({ ...settings, footerCredit: v })} />
                  </div>
                </div>

                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#DC2626] px-6 py-3 text-sm font-bold text-white hover:bg-[#B91C1C] disabled:opacity-60"
                >
                  <Save size={16} /> {saving ? "Menyimpan..." : "SIMPAN PENGATURAN"}
                </button>
              </div>
            )
          )}

          {tab === "lomba" && (
            lombaLoading ? (
              <TabLoader />
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-extrabold text-[#DC2626]">Kelola Lomba</h2>

                {lombaGroups.map((group) => (
                <div key={group._id} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="grid flex-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Nama kategori</label>
                        <input
                          value={group.group}
                          onChange={(e) =>
                            setLombaGroups((prev) =>
                              prev.map((g) =>
                                g._id === group._id ? { ...g, group: e.target.value } : g
                              )
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#DC2626]"
                          placeholder="Nama kategori"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">Rentang usia</label>
                        <input
                          value={group.age}
                          onChange={(e) =>
                            setLombaGroups((prev) =>
                              prev.map((g) =>
                                g._id === group._id ? { ...g, age: e.target.value } : g
                              )
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                          placeholder="Rentang usia"
                        />
                      </div>
                    </div>
                    <button onClick={() => deleteLombaGroup(group._id)} className="mt-5 text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Daftar lomba</label>
                  <textarea
                    value={group.lombaRaw || group.lomba.join(", ")}
                    onChange={(e) =>
                      setLombaGroups((prev) =>
                        prev.map((g) =>
                          g._id === group._id
                            ? { ...g, lombaRaw: e.target.value }
                            : g
                        )
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    rows={2}
                    placeholder="Pisahkan dengan koma"
                  />
                  <button
                    onClick={() => {
                      if (!group.group.trim() || !group.age.trim()) {
                        showMsg("Nama kategori dan rentang usia wajib diisi");
                        return;
                      }
                      const lombaArray = (group.lombaRaw || group.lomba.join(", ")).split(",").map((s) => s.trim()).filter(Boolean);
                      updateLombaGroup(group._id, {
                        group: group.group.trim(),
                        age: group.age.trim(),
                        lomba: lombaArray,
                      });
                    }}
                    className="mt-2 text-xs font-semibold text-[#DC2626] hover:underline"
                  >
                    Simpan perubahan
                  </button>
                </div>
              ))}

              <div className="rounded-xl border border-dashed border-gray-300 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-700">Tambah Kategori Lomba</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <input placeholder="Nama kategori" value={newLomba.group} onChange={(e) => setNewLomba({ ...newLomba, group: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                  <input placeholder="Rentang usia" value={newLomba.age} onChange={(e) => setNewLomba({ ...newLomba, age: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                  <input placeholder="Lomba (pisah koma)" value={newLomba.lomba} onChange={(e) => setNewLomba({ ...newLomba, lomba: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </div>
                <button onClick={addLombaGroup} className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#DC2626]">
                  <Plus size={16} /> Tambah
                </button>
              </div>
            </div>
            )
          )}

          {tab === "galeri" && (
            galleryLoading ? (
              <TabLoader />
            ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-[#DC2626]">Kelola Galeri</h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {gallery.map((img) => (
                  <div key={img._id} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <div className="group relative aspect-square">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" />
                      <button
                        onClick={() => deleteGallery(img._id)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="space-y-2 bg-white p-3">
                      <label className="block text-xs font-semibold text-gray-600">Tahun</label>
                      <input
                        type="number"
                        min={2000}
                        max={2100}
                        value={img.year ?? new Date().getFullYear()}
                        onChange={(e) =>
                          setGallery((prev) =>
                            prev.map((g) =>
                              g._id === img._id ? { ...g, year: Number(e.target.value) } : g
                            )
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => saveGalleryYear(img._id, img.year)}
                          disabled={savingGalleryId === img._id}
                          className="text-xs font-semibold text-[#DC2626] hover:underline disabled:opacity-60"
                        >
                          {savingGalleryId === img._id ? "Menyimpan..." : "Simpan tahun"}
                        </button>
                        {savedGalleryId === img._id && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                            <Check size={14} />
                            Tersimpan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-700">Upload Gambar Baru</p>
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    placeholder="Tahun kegiatan"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={uploadGallery}
                  disabled={!uploadFile}
                  className="mt-3 flex items-center gap-1 rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Plus size={16} /> Upload
                </button>
              </div>
            </div>
            )
          )}

          {tab === "peserta" && (
            participantsLoading ? (
              <TabLoader />
            ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-[#DC2626]">
                Kelola Peserta ({filteredParticipants.length}
                {filteredParticipants.length !== participants.length
                  ? ` dari ${participants.length}`
                  : ""}
                )
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau nomor telepon..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#DC2626]"
                  />
                </div>
                <select
                  value={participantLombaFilter}
                  onChange={(e) => setParticipantLombaFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DC2626] sm:min-w-[180px]"
                >
                  <option value="all">Semua Lomba</option>
                  {lombaOptions.map((lomba) => (
                    <option key={lomba} value={lomba}>
                      {lomba}
                    </option>
                  ))}
                </select>
                <select
                  value={participantStatusFilter}
                  onChange={(e) => setParticipantStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#DC2626] sm:min-w-[160px]"
                >
                  <option value="all">Semua Status</option>
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {filteredParticipants.length === 0 ? (
                <div className="rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-500">
                  Tidak ada peserta yang cocok dengan filter.
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-700">Nama</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Usia</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Telepon</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Alamat</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Lomba</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Status</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((p) => (
                      <tr key={p._id} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3">{p.age}</td>
                        <td className="px-4 py-3">{p.phone}</td>
                        <td className="px-4 py-3">{p.address || "-"}</td>
                        <td className="px-4 py-3">
                          {participantLombaFilter === "all" 
                            ? ((p.categories && p.categories.length > 0) 
                              ? p.categories.join(", ") 
                              : (p as any).category || "-")
                            : ((p.categories && p.categories.includes(participantLombaFilter)) 
                              ? participantLombaFilter 
                              : ((p as any).category === participantLombaFilter ? participantLombaFilter : "-"))
                          }
                        </td>
                        <td className="px-4 py-3">
                          {participantLombaFilter === "all" ? (
                            <div className="space-y-1">
                              {(p.categories || [(p as any).category])
                                .filter((cat): cat is string => Boolean(cat))
                                .filter((cat) => 
                                  participantStatusFilter === "all" || 
                                  (p.lombaStatuses?.[cat] || "terdaftar") === participantStatusFilter
                                )
                                .map((cat: string) => (
                                <div key={cat} className="flex items-center gap-1">
                                  <span className="text-xs text-gray-600 w-24 truncate">{cat}:</span>
                                  <select
                                    value={(p.lombaStatuses?.[cat]) || "terdaftar"}
                                    onChange={(e) => updateParticipant(p._id, cat, e.target.value)}
                                    className="rounded border border-gray-200 px-2 py-0.5 text-xs"
                                  >
                                    {statusOptions.map((s) => (
                                      <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <select
                              value={(p.lombaStatuses?.[participantLombaFilter]) || "terdaftar"}
                              onChange={(e) => updateParticipant(p._id, participantLombaFilter, e.target.value)}
                              className="rounded border border-gray-200 px-2 py-1 text-xs"
                            >
                              {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteParticipant(p._id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
