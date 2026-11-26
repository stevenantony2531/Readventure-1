# Readventure

Prototype web aplikasi membaca interaktif untuk anak usia SD (8–12 tahun) dengan pendampingan orang tua secara sinkron antar perangkat.

## Fitur Utama
- **Perangkat Anak**: Beranda misi harian/mingguan, kuis pemahaman akhir bab, peti hadiah & studio kostum, pembaca cerita multi-bab & komik berseri, pencarian & filter dunia cerita, serta zona pendampingan terbatas berbasis PIN (`1234`).
- **Perangkat Orang Tua**: Dasbor pemantauan mingguan, pelacakan kosakata baru, mode fokus baca, kirim kartu semangat, serta otorisasi & pembayaran eksklusif untuk Readventure Plus dan Koin Bintang.
- **Sinkronisasi Otomatis**: Progres tersimpan otomatis di `localStorage` dan tersinkron antar tab (`?device=child` dan `?device=parent`).

---

## Cara Upload ke GitHub & Dapat Link Website Langsung (Gratis)

Repositori ini sudah dilengkapi konfigurasi **GitHub Actions** untuk langsung men-deploy website ke **GitHub Pages** tanpa pengaturan rumit.

### 1. Upload Proyek ke GitHub
Buat repositori baru di GitHub (misalnya `readventure`), lalu jalankan perintah berikut di terminal folder proyek:

```bash
git init
git add .
git commit -m "Deploy Readventure prototype"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/readventure.git
git push -u origin main
```

### 2. Aktifkan GitHub Pages (1 Klik)
1. Buka repositori kamu di GitHub.
2. Masuk ke **Settings** → **Pages**.
3. Pada bagian **Build and deployment → Source**, pilih **GitHub Actions**.
4. Tunggu ~1 menit pada tab **Actions** hingga status berubah menjadi hijau.
5. Link prototype website langsung aktif di:
   `https://USERNAME_KAMU.github.io/readventure/`

### Alternatif Cepat (Vercel / Netlify)
Setelah kode ada di GitHub, kamu juga bisa mengimpor repositori langsung di **Vercel** atau **Netlify** (Build command: `npm run build`, Output directory: `dist`) untuk mendapatkan link `*.vercel.app` atau `*.netlify.app`.

---

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.
