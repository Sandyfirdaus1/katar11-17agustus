export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#fafafa]">
      <div className="h-40 bg-[#DC2626]/80" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-3 md:px-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200" />
        ))}
      </div>
    </main>
  );
}
