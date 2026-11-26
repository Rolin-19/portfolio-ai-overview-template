# Template Portofolio AI Overview

Template portofolio dwibahasa Indonesia/Inggris dengan tampilan editorial, pencarian *inline* ala Google AI Overview yang hanya merangkum data portofolio yang Anda isi, serta halaman CV ATS satu kolom yang rapi saat dicetak ke PDF.

**Live Demo:** https://rolin-19.github.io/portfolio-ai-overview-template/

Panduan ini memakai placeholder. Mohon jangan menuliskan API key, token, atau data pribadi asli ke dalam file yang akan diunggah ke GitHub.

## 1. Tentang Template & Pratinjau Langsung

Silakan buka Live Demo di atas untuk melihat hasil akhirnya. Sebelum backend AI dihubungkan, kotak pencarian akan menampilkan pesan mode pratinjau. Pesan ini normal dan tidak menghasilkan error jaringan. Setelah Worker Anda terhubung, pencarian akan menjawab hanya dari daftar fakta yang Anda isi di `worker/src/index.js`.

Isi utama template:

- Beranda bahasa Indonesia: `index.html`
- Beranda bahasa Inggris: `en/index.html`
- CV ATS bahasa Indonesia: `cv.html`
- CV ATS bahasa Inggris: `en/cv.html`
- Contoh studi kasus: `proyek/contoh-proyek.html` dan `en/proyek/sample-project.html`
- Gaya tampilan: `gaya.css`
- Pencarian dan sorotan sumber: `assets/ai-cari.js`
- Backend perangkum: `worker/src/index.js`

## 2. Prasyarat Sebelum Memulai

Sebelum memulai, mohon siapkan:

- Akun GitHub (gratis).
- Akun Cloudflare (gratis) untuk Cloudflare Workers.
- Node.js terpasang di komputer agar perintah `npx wrangler` dapat dijalankan.
- API key dari penyedia model AI yang kompatibel dengan format endpoint OpenAI. Worker ini memanggil `https://api.groq.com/openai/v1/chat/completions`, sehingga API key Groq atau penyedia sejenis dapat digunakan.

Nama variabel yang dibaca oleh `worker/src/index.js`:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `AI_API_KEY` | Ya | Kredensial penyedia model. Disimpan sebagai variabel terenkripsi Cloudflare, bukan di file repositori. |
| `ALLOWED_ORIGIN` | Ya | Alamat situs yang diizinkan memanggil Worker. Harus sama persis dengan domain GitHub Pages Anda. |
| `MODEL` | Tidak | Nama model. Jika kosong, Worker memakai `llama-3.1-8b-instant`. |
| `MAX_OUTPUT` | Tidak | Batas panjang jawaban. Jika kosong, Worker memakai `300`. |

## 3. Langkah 1 — Menyalin Template ke Akun GitHub Anda

1. Buka https://github.com/Rolin-19/portfolio-ai-overview-template.
2. Klik tombol hijau **Use this template**, lalu pilih **Create a new repository**.
3. Isi nama repository:
   - Gunakan `<username>.github.io` jika portofolio ingin menjadi situs utama.
   - Gunakan nama lain, misalnya `portfolio-saya`, jika ingin tetap menjadi repository proyek.
4. Pilih **Public**, lalu klik **Create repository**.
5. Salin repository ke komputer Anda:

```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>
```

## 4. Langkah 2 — Mengisi Data Profil, Proyek & CV ATS

Cari penanda `<!-- GANTI DENGAN DATA ANDA -->` di file HTML, lalu isi bagian tersebut dengan data Anda. File yang perlu disesuaikan:

- `index.html`: hero, chip pencarian, seksi pengalaman, proyek, keahlian, dan kontak.
- `en/index.html`: versi Inggris dari bagian yang sama.
- `cv.html`: identitas, riwayat kerja, proyek, pendidikan, sertifikat, dan kontak untuk CV ATS bahasa Indonesia.
- `en/cv.html`: versi Inggris dari CV ATS tersebut.
- `proyek/contoh-proyek.html` dan `en/proyek/sample-project.html`: judul, narasi, gambar, metrik, dan tautan studi kasus.

Ganti pula placeholder teks seperti `[Nama Lengkap Anda]`, `[Peran / Bidang Keahlian]`, `[Nama Proyek Unggulan]`, `[Kota Anda]`, `nama@email.com`, dan `username.github.io`.

Ganti aset contoh dengan milik Anda:

- `assets/foto-placeholder.svg` → foto profil Anda.
- `assets/proyek-placeholder.svg` → tangkapan layar proyek.
- `assets/grafik-placeholder.svg` → grafik atau visual lain.

Simpan perubahan, lalu commit dan push sebelum melanjutkan ke pengaturan backend.

## 5. Langkah 3 — Memasang Backend AI & API Key di Cloudflare Workers (Aman)

### 5.1 Siapkan konfigurasi Worker

Dari folder repository, salin contoh konfigurasi:

```bash
cp worker/wrangler.example.toml worker/wrangler.toml
```

File `worker/wrangler.toml` sudah diblokir oleh `.gitignore`. Mohon jangan menghapus baris tersebut agar konfigurasi pribadi tidak ikut terunggah ke GitHub.

Buka `worker/wrangler.toml` dan sesuaikan `ALLOWED_ORIGIN`:

```toml
[vars]
ALLOWED_ORIGIN = "https://<username>.github.io"
```

Jika repository Anda berupa repository proyek, nilai yang dipakai misalnya `https://<username>.github.io/<nama-repo>`. Nilai ini harus sama persis dengan alamat halaman Anda, tanpa slash di akhir.

Variabel `MODEL` dan `MAX_OUTPUT` boleh ditambahkan bila ingin mengganti nilai bawaan. Jangan menuliskan nilai `AI_API_KEY` di file ini.

### 5.2 Login ke Wrangler

Jalankan:

```bash
npx wrangler login
```

Ikuti arahan di browser untuk menyetujui akses akun Cloudflare Anda.

### 5.3 Simpan API key dengan aman

Nama variabel yang dibaca kode adalah `AI_API_KEY`. Simpan nilainya lewat terminal:

```bash
npx wrangler secret put AI_API_KEY
```

Wrangler akan meminta nilai API key. Tempel nilai tersebut hanya saat diminta; terminal tidak akan menampilkannya.

Cara alternatif lewat dashboard:

1. Buka Cloudflare Dashboard.
2. Pilih **Workers & Pages** → Worker Anda.
3. Buka **Settings** → **Variables and Secrets**.
4. Tambahkan variabel dengan nama `AI_API_KEY`, lalu simpan sebagai variabel terenkripsi.

Terapkan hal yang sama untuk `ALLOWED_ORIGIN` bila Anda lebih nyaman memakai dashboard. Keduanya harus tersedia sebelum Worker dipanggil dari situs.

### 5.4 Deploy Worker

Masuk ke folder `worker`, lalu jalankan:

```bash
cd worker
npx wrangler deploy
```

Setelah selesai, Wrangler akan menampilkan URL publik Worker. Simpan URL tersebut; pada langkah berikutnya URL ini akan dipakai dengan akhiran `/chat`.

## 6. Langkah 4 — Menghubungkan URL Worker ke Frontend

Buka `assets/ai-cari.js` dan cari baris berikut:

```js
var ENDPOINT = window.PORTFOLIO_AI_ENDPOINT || "https://YOUR-WORKER-SUBDOMAIN.workers.dev/chat";
```

Ganti bagian placeholder dengan URL Worker Anda, misalnya:

```js
var ENDPOINT = window.PORTFOLIO_AI_ENDPOINT || "https://nama-worker-anda.workers.dev/chat";
```

Pastikan URL diakhiri `/chat`. Baris `window.PORTFOLIO_AI_ENDPOINT` boleh tetap dipertahankan sebagai cara menimpa endpoint dari luar bila diperlukan.

Jika Anda mengubah `assets/ai-cari.js` atau `gaya.css`, perbarui pula nilai `?v=` di file HTML. Nilainya adalah 8 karakter hex pertama dari SHA-256 kedua file tersebut secara berurutan.

Commit dan push perubahan ini sebelum mengaktifkan GitHub Pages.

## 7. Langkah 5 — Menerbitkan Website di GitHub Pages & Uji Coba

1. Buka repository Anda di GitHub.
2. Pilih **Settings** → **Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih cabang `main` dan folder `/ (root)`, lalu simpan.
5. Tunggu beberapa menit hingga proses deploy selesai.

Alamat situs:

- Situs utama: `https://<username>.github.io/`
- Repository proyek: `https://<username>.github.io/<nama-repo>/`

Silakan uji:

- Halaman utama bahasa Indonesia dan `en/`.
- Halaman `cv.html` dan `en/cv.html`, lalu gunakan tombol cetak untuk menyimpan sebagai PDF.
- Kotak pencarian AI Overview. Klik salah satu chip atau ketik pertanyaan. Jawaban harus muncul dari data yang Anda isi.

Jika pesan mode pratinjau masih muncul, periksa kembali URL endpoint di `assets/ai-cari.js`. Jika jawaban tidak muncul, periksa `ALLOWED_ORIGIN`, variabel `AI_API_KEY`, dan status deploy Worker.

## 8. Lisensi & Atribusi

Template ini dirilis di bawah **MIT License**. Lihat file `LICENSE` untuk teks lengkapnya.

Dibuat oleh Rolin Stallin Sitorus — https://github.com/Rolin-19.

Anda bebas menggunakan dan memodifikasi template ini, dengan tetap menyertakan pemberitahuan hak cipta dan lisensi asli tersebut.
