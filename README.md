<h1 align="center">Website HIMASI Universitas Terbuka</h1>

<p align="center">
  Website resmi Himpunan Sistem Informasi Universitas Terbuka (HIMASI UT).
  Dibuat untuk mengorganisir pencatatan (pendaftaran anggota/pengurus) dan menyalurkan
  informasi seputar Sistem Informasi di Universitas Terbuka: departemen, program kerja,
  berita, acara, dan FAQ.
</p>

---

### Ringkasannya

- Dibangun dengan: Vue 3, Vite, Pinia, Tailwind CSS, dan Vuestic UI.
- Tujuan utama: satu pintu informasi dan pengelolaan internal HIMASI UT.
- Konten utama: Beranda, Tentang, Departemen, Pengurus, Proker, Berita, FAQ, dan Pendaftaran.

### Fitur Utama

- **Informasi Terstruktur:** Halaman pengurus, departemen, proker, dan berita.
- **Pendaftaran Online:** Formulir pendaftaran anggota/pengurus.
- **Responsif & Cepat:** Optimasi Vite + Tailwind untuk performa dan tampilan mobile.
- **Tema Gelap/Terang:** Toggle tema untuk aksesibilitas dan kenyamanan.
- **I18n Siap:** Struktur mendukung internasionalisasi bila dibutuhkan.

### Menjalankan Secara Lokal

Pastikan Node.js dan npm sudah terpasang.

```bash
npm install
npm run dev
```

Build produksi dan preview:

```bash
npm run build
npm run preview
```

### Struktur Penting

- `src/pages/guest/...` — Halaman publik (beranda dan bagian-bagian situs).
- `src/layouts/GuestLayout.vue` — Layout halaman publik.
- `template/himasi/` — Template aset (HTML/CSS/JS) untuk tampilan landing.
- `public/images/` — Aset gambar publik (termasuk logo dan latar).

### Deploy

Repositori ini siap deploy ke layanan seperti Netlify (tersedia `netlify.toml`).
Umumnya cukup melakukan build (`npm run build`) lalu mengarahkannya ke folder `dist/`.

### Kredit

Proyek ini memanfaatkan komponen dan praktik dari **Vuestic UI** dan **Vuestic Admin**
untuk mempercepat pengembangan antarmuka. Terima kasih kepada para kontributor proyek tersebut.

### Lisensi

Proyek ini berlisensi **MIT**.
