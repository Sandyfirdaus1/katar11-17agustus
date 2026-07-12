export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#fafafa]">
      <div className="h-40 bg-[#DC2626]/80" />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 md:px-6">
        <div className="h-12 rounded-xl bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    </main>
  );
}
