interface LombaProps {
  groups: {
    group: string;
    age: string;
    lomba: string[];
  }[];
}

export default function Lomba({ groups }: LombaProps) {
  return (
    <section className="bg-[#f5f5f5] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-wide text-[#DC2626] md:text-3xl">
          LOMBA 17 AGUSTUS 2026
        </h2>
        <p className="mb-8 text-center text-sm text-gray-600">
          Kegiatan lomba untuk semua usia, dari balita hingga dewasa
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div
              key={group.group}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 border-b border-gray-100 pb-3">
                <p className="text-sm font-extrabold uppercase tracking-wide text-[#DC2626]">
                  {group.group}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{group.age}</p>
              </div>
              <ul className="space-y-2">
                {group.lomba.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DC2626]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
