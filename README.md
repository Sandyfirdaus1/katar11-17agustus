# Lomba 17 Agustus RT 011 / Katar 11

Website informasi dan pendaftaran lomba 17 Agustus 2026 untuk Lingkungan RT 011 / Katar 11.

**Stack:** Next.js 16, Tailwind CSS v4, MongoDB Atlas

## Fitur

- Beranda dinamis (countdown, pengumuman, lomba, galeri)
- Pendaftaran peserta online
- Daftar peserta publik dengan filter lomba & status
- Admin panel (pengaturan, lomba, galeri, peserta)

## Persiapan Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Environment variables

Salin file contoh:

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan kredensial MongoDB Atlas dan secret JWT.

### 3. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 4. Seed data awal (opsional)

Setelah server jalan, jalankan seed untuk membuat admin, pengaturan, lomba, dan galeri default:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

Login admin: `/admin/login`

---

## Upload ke GitHub

Repositori Git ada di folder `web/` (root project Next.js).

### 1. Buat repository di GitHub

Buat repo baru di GitHub (misalnya `katar11-lomba17agustus`), **tanpa** README/gitignore (sudah ada di project).

### 2. Push kode

```bash
cd web
git add .
git commit -m "Initial commit: website lomba 17 Agustus RT 011"
git branch -M main
git remote add origin https://github.com/USERNAME/katar11-lomba17agustus.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

> **Penting:** Jangan commit file `.env.local` — sudah di-ignore oleh `.gitignore`.

---

## Deploy ke Vercel

### 1. MongoDB Atlas (wajib)

1. Buat cluster di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat database user (username + password)
3. **Network Access** → Add IP Address → `0.0.0.0/0` (agar Vercel bisa connect)
4. Copy connection string, ganti `<password>` dan set database name: `katar11-lomba`

Format URI:

```
mongodb+srv://user:password@cluster.mongodb.net/katar11-lomba?retryWrites=true&w=majority
```

### 2. Import project ke Vercel

1. Login [vercel.com](https://vercel.com)
2. **Add New → Project**
3. Import repository GitHub
4. **Root Directory:** biarkan `./` (karena repo root = folder `web`)
5. Framework: Next.js (terdeteksi otomatis)
6. Build Command: `npm run build` (default)
7. Output Directory: `.next` (default)

### 3. Environment Variables di Vercel

Di **Settings → Environment Variables**, tambahkan:

| Variable | Keterangan |
|---|---|
| `MONGODB_URI` | Connection string MongoDB Atlas |
| `JWT_SECRET` | String acak kuat (min. 32 karakter) |
| `ADMIN_USERNAME` | Username admin |
| `ADMIN_PASSWORD` | Password admin (ganti dari default!) |
| `SEED_SECRET` | Token rahasia untuk menjalankan seed di production |

Set semua untuk **Production**, **Preview**, dan **Development**.

### 4. Deploy

Klik **Deploy**. Vercel akan build otomatis setiap push ke GitHub.

### 5. Seed data setelah deploy

Jalankan sekali setelah deploy pertama:

```bash
curl -X POST https://DOMAIN-ANDA.vercel.app/api/admin/seed \
  -H "Authorization: Bearer SEED_SECRET_ANDA"
```

Ganti `DOMAIN-ANDA` dan `SEED_SECRET_ANDA` sesuai environment Vercel.

Setelah admin & data awal terbuat, login di:

```
https://DOMAIN-ANDA.vercel.app/admin/login
```

---

## Catatan Production

### Upload galeri via admin

Upload gambar baru lewat admin panel **menyimpan file ke disk server**. Di Vercel (serverless), file tersebut **tidak permanen** dan bisa hilang setelah redeploy.

Untuk production jangka panjang, pertimbangkan:
- Menyimpan gambar di folder `public/` lalu commit ke GitHub, atau
- Integrasi cloud storage (Vercel Blob, Cloudinary, S3)

Gambar default yang sudah ada di `public/images/galeri-kegiatan/` akan tetap tampil setelah deploy.

### Keamanan

- Ganti `ADMIN_PASSWORD` dan `JWT_SECRET` sebelum go-live
- Jangan bagikan `SEED_SECRET` ke publik
- Endpoint seed memerlukan `Authorization: Bearer <SEED_SECRET>` di production

---

## Struktur Halaman

| Route | Keterangan |
|---|---|
| `/` | Beranda |
| `/daftar` | Form pendaftaran |
| `/peserta` | Daftar peserta publik |
| `/galeri` | Galeri kegiatan |
| `/admin/login` | Login admin |
| `/admin` | Dashboard admin |

## Scripts

```bash
npm run dev      # Development
npm run build    # Build production
npm run start    # Jalankan build production
npm run lint     # ESLint
```
