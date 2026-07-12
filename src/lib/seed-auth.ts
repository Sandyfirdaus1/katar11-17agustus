export function assertSeedAllowed(request: Request) {
  if (process.env.NODE_ENV !== "production") return;

  const secret = process.env.SEED_SECRET;
  if (!secret) {
    throw new Error("Seed dinonaktifkan di production. Set SEED_SECRET di Vercel.");
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    throw new Error("Unauthorized");
  }
}
