# NEXALORA Demo

Salinan mandiri untuk deployment dan rekaman video. Tidak memerlukan Supabase, backend API, database, atau environment variables. Folder proyek utama tidak diubah.

## Jalankan

npm ci
npm run dev

## Deploy

Import folder ini sebagai proyek Next.js di hosting yang mendukung Next.js (misalnya Vercel). Jika diunggah sebagai bagian repo induk, atur Root Directory menjadi nexalora-demo. Build command: npm run build. Install command: npm ci. Tidak perlu environment variables. Untuk server Node: npm run build lalu npm start. Ini bukan static export untuk hosting HTML biasa.

## Rekaman

1. Buka /masuk lalu pilih profil contoh Rani untuk dashboard yang sudah terisi.
2. Jelajahi jurusan, sematkan pilihan, bandingkan, lalu buka simulasi.
3. Pilih berkas kecil yang sesuai format tugas. Pengumpulan hanya mencatat metadata berkas dan memberikan contoh review berlabel demo.
4. Isi refleksi, buka rekomendasi, rencana 30 hari, dan paspor. Paspor bisa dicetak lewat dialog browser.
5. Tombol Reset Demo mengembalikan profil contoh untuk pengambilan ulang. Mulai sesi baru melalui /daftar untuk merekam onboarding.

Progres disimpan pada localStorage nexalora_demo_state_v1. Tidak ada akun sungguhan, pengiriman email, unggahan server, atau sertifikat terverifikasi. Berkas yang dipilih tidak disimpan; hanya nama dan ukuran dicatat. Font/ikon eksternal masih membutuhkan internet.

## Validasi

npx tsc --noEmit
npm test
node --test tests/adversarial_challenge.test.mjs
npm run test:demo
npm run build
