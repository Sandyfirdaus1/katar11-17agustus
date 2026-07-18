export interface LombaGroup {
  group: string;
  age: string;
  lomba: string[];
  isTeam?: boolean;
  teamSize?: 2 | 3 | 4;
}

export const lombaGroups: LombaGroup[] = [
  {
    group: "Balita",
    age: "0–5 tahun",
    lomba: [
      "Lomba Gerak Jalan",
      "Mewarnai Tema Kemerdekaan",
      "Menyanyi Lagu Anak",
    ],
  },
  {
    group: "Anak-anak",
    age: "6–12 tahun",
    lomba: [
      "Balap Karung",
      "Makan Kerupuk",
      "Balap Kelereng",
      "Paku Bendera",
      "Estafet Air",
    ],
  },
  {
    group: "Remaja",
    age: "13–17 tahun",
    lomba: [
      "Balap Karung",
      "Tarik Tambang",
      "Balap Bakiak",
      "Joget Jeruk",
    ],
  },
  {
    group: "Dewasa",
    age: "18+ tahun",
    lomba: [
      "Tarik Tambang",
      "Panjat Pinang",
      "Balap Karung",
      "Balap Bakiak",
      "Domino",
      "Joget Jeruk",
    ],
  },
  {
    group: "Tim",
    age: "Semua Usia",
    lomba: [
      "Estafet Air",
    ],
    isTeam: true,
    teamSize: 4,
  },
  {
    group: "Tim Kecil",
    age: "Semua Usia",
    lomba: [
      "Balap Bakiak",
      "Bakiak",
      "Joget Jeruk",
    ],
    isTeam: true,
    teamSize: 3,
  },
  {
    group: "Tim Pasangan",
    age: "Semua Usia",
    lomba: [
      "Joget Jeruk",
    ],
    isTeam: true,
    teamSize: 2,
  },
];

export const allLomba = lombaGroups.flatMap((g) => g.lomba);

export const uniqueLomba = [...new Set(allLomba)];
