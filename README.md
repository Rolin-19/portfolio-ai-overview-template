# Template Portofolio AI Overview

Template portofolio dwibahasa Indonesia/Inggris dengan pencarian inline bergaya Google AI Overview. Jawaban dibatasi hanya pada data portofolio yang Anda isi sendiri (closed-domain grounding), bukan obrolan bebas. Disertakan pula halaman CV ATS satu kolom yang siap dicetak ke PDF.

Ringkasan (EN): A bilingual ID/EN portfolio template with an inline Google-style AI Overview. Answers stay inside the portfolio facts you provide. It also ships one-column ATS CV pages that print cleanly to PDF.

## Fitur

- Beranda editorial ID/EN dengan navigasi, seksi pengalaman, proyek, keahlian, dan kontak.
- Widget pencarian inline: chip pertanyaan, kartu ringkasan, dan sumber yang bisa diklik dengan sorotan singkat.
- Worker perangkum dengan sumber data tertutup: menolak topik di luar portofolio dan mengikuti bahasa pertanyaan.
- CV ATS polos satu kolom, hitam di atas putih, dengan tombol cetak/simpan PDF.
- Fallback ramah di frontend bila URL Worker belum diganti.

## Struktur folder

```text
portfolio-ai-overview-template/
├── index.html                    # Beranda bahasa Indonesia
├── en/index.html                 # Beranda bahasa Inggris
├── cv.html                       # CV ATS bahasa Indonesia
├── en/cv.html                    # ATS resume bahasa Inggris
├── gaya.css                      # Gaya editorial, variabel warna, responsif
├── assets/
│   ├── ai-cari.js                # Form, chip, kartu, sorotan sumber, fallback endpoint
│   ├── favicon.ico
│   ├── foto-placeholder.svg      # Ganti dengan foto Anda
│   ├── proyek-placeholder.svg    # Ganti dengan tangkapan layar proyek
│   └── grafik-placeholder.svg    # Ganti dengan grafik proyek
├── worker/
│   ├── src/index.js              # Worker perangkum dengan prompt tertutup
│   └── wrangler.example.toml     # Contoh konfigurasi; salin ke wrangler.toml
├── proyek/contoh-proyek.html     # Satu studi kasus bahasa Indonesia
├── en/proyek/sample-project.html # Satu studi kasus bahasa Inggris
├── .env.example                  # Contoh variabel lingkungan
├── .gitignore                    # Blokir file rahasia dan dependensi
└── LICENSE                       # MIT License
```

## Mulai pakai

1. Klik tombol hijau **Use this template** di halaman repo ini, lalu buat repository baru. Cara lain: unduh ZIP lalu ekstrak.
2. Clone repository hasil ke komputer Anda:

   ```bash
   git clone https://github.com/USERNAME/NAMA-REPO.git
   cd NAMA-REPO
   ```

3. Cari penanda `<!-- GANTI DENGAN DATA ANDA -->` di file HTML. Isi bagian tersebut dengan data Anda.
4. Ganti placeholder seperti `[Nama Lengkap Anda]`, `[Peran / Bidang Keahlian]`, `[Nama Proyek Unggulan]`, `[Kota Anda]`, `nama@email.com`, dan `username.github.io` di seluruh file.
5. Bagian yang paling sering diubah:
   - `index.html`: hero, AI Overview, seksi pengalaman/proyek/kontak, dan tautan `cv.html`.
   - `en/index.html`: versi Inggris dari bagian yang sama, termasuk tautan `en/cv.html`.
   - `cv.html`: identitas, riwayat kerja, proyek, pendidikan, sertifikat, dan kontak (Bahasa Indonesia).
   - `en/cv.html`: versi Inggris dari CV ATS di atas.
   - `proyek/contoh-proyek.html` dan `en/proyek/sample-project.html`: judul, narasi, gambar, metrik, dan tautan proyek.

## Publikasikan website gratis

1. Push repository ke GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Source: Deploy from a branch**, cabang `main`, folder `/ (root)`.
4. Simpan. Tunggu beberapa menit sampai GitHub Pages aktif di `https://USERNAME.github.io/NAMA-REPO/`.
5. File `.nojekyll` sudah disertakan, jangan dihapus.

Catatan: untuk repo user dengan nama `USERNAME.github.io`, alamatnya `https://USERNAME.github.io/`.

## Pasang backend Cloudflare Worker

1. Di folder `worker/`, salin `wrangler.example.toml` menjadi `wrangler.toml`.
2. Ubah `ALLOWED_ORIGIN` menjadi alamat Pages Anda persis, misalnya `https://USERNAME.github.io`.
3. Simpan nilai `AI_API_KEY` sebagai variabel terenkripsi melalui Cloudflare Dashboard → Workers → Settings → Variables. Jangan menulis nilainya di file mana pun.
4. Deploy Worker dari folder `worker`:

   ```bash
   npx wrangler deploy
   ```

5. Salin URL Worker hasil deploy, lalu ganti `https://YOUR-WORKER-SUBDOMAIN.workers.dev/chat` di `assets/ai-cari.js` dengan URL tersebut.
6. Isi `worker/src/index.js` dengan daftar fakta Anda di `SYSTEM_PROMPT`.
7. Jika mengubah `gaya.css` atau `assets/ai-cari.js`, hitung ulang 8 hex pertama SHA-256 dari kedua file itu dan perbarui `?v=` di semua file HTML.

File `.env`, `.dev.vars`, dan `wrangler.toml` sudah diblokir oleh `.gitignore`.

## Lisensi & atribusi

Template ini dirilis di bawah **MIT License**. Lihat file `LICENSE`.

Dibuat oleh Rolin Stallin Sitorus — https://github.com/Rolin-19.
