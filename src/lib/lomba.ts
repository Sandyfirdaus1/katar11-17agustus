export interface LombaGroup {
  group: string;
  age: string;
  lomba: string[];
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
      "Futsal",
      "Voli",
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
    ],
  },
];

export const allLomba = lombaGroups.flatMap((g) => g.lomba);

export const uniqueLomba = [...new Set(allLomba)];
