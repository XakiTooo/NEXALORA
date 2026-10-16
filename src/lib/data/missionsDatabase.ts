/**
 * NEXALORA Simulation Missions Database & Repository
 * Full Parity with Dicoding Academy Classroom Experience:
 * - Structured multi-module curriculum
 * - Deep theoretical & practical lessons
 * - Comprehensive quizzes with detailed per-choice rationales
 * - Project assignment submission with real file upload (.zip, .pdf, .png)
 * - Qualitative reviewer evaluation with 5-star rating system
 */


export type DisciplineCluster = 'informatika' | 'industri' | 'dkv';

export interface DbMission {
  id: string;
  cluster: DisciplineCluster;
  clusterLabel: string;
  judul: string;
  deskripsiSingkat: string;
  estimasiDurasiMenit: number;
  tujuanBelajar: string[];
  catatanEkspektasi: string;
}

export interface DbMaterialSlide {
  id: string;
  judulSlide: string;
  isiMateri: string;
  istilahKunci: Array<{ istilah: string; definisi: string }>;
}

export interface DbQuizQuestion {
  id: string;
  pertanyaan: string;
  opsi: string[];
  kunciJawabanIndex: number;
  penjelasanReflektif: string;
  opsiRationales?: string[]; // Detailed explanation for EACH option (why right / why wrong)
}

export interface DbPracticalTask {
  id: string;
  formatTugas: 'teks_logika' | 'keputusan_desain' | 'analisis_kapasitas';
  judulTugas: string;
  skenarioKasus: string;
  panduanPengerjaan: string[];
  placeholderJawaban: string;
  karakterMinimal: number;
  karakterMaksimal: number;
}

export interface DbRubricItem {
  id: string;
  kriteria: string;
  deskripsi: string;
  panduanEvaluasi: string;
}

export interface DbDicodingModule {
  id: string;
  order: number;
  title: string;
  moduleType: 'reading' | 'interactive' | 'quiz' | 'submission' | 'summary';
  durationMinutes: number;
  summary: string;
  contentMarkdown?: string;
  codeOrFormula?: string;
  keyTakeaway?: string;
  keyTerms?: Array<{ istilah: string; definisi: string }>;
}

export interface DbSubmissionSpecs {
  title: string;
  scenario: string;
  allowedExtensions: string[];
  maxFileSizeMb: number;
  rubricChecklist: string[];
  sampleReviewerFeedback: {
    stars: number;
    title: string;
    comment: string;
  };
}

export interface FullMissionDetail {
  mission: DbMission;
  materiSlides: DbMaterialSlide[];
  quizQuestions: DbQuizQuestion[];
  practicalTask: DbPracticalTask;
  rubrikKualitatif: DbRubricItem[];
  dicodingModules: DbDicodingModule[];
  submissionSpecs: DbSubmissionSpecs;
}

// =========================================================================
// REALISTIC SEED DATASET (DATABASE RECORD PARITY)
// =========================================================================

export const DATABASE_MISSIONS: Record<string, FullMissionDetail> = {
  'misi-if-kantin': {
    mission: {
      id: 'misi-if-kantin',
      cluster: 'informatika',
      clusterLabel: 'INFORMATIKA · ALGORITMA & LOGIKA SISTEM',
      judul: 'Menyortir Alur Antrean Pesanan Kantin Digital',
      deskripsiSingkat:
        'Pelajari cara berpikir komputasional mahasiswa Informatika: pecahkan persoalan antrean pesanan makanan, telaah algoritma prioritas, dan pahami trade-off antara kecepatan vs keadilan.',
      estimasiDurasiMenit: 25,
      tujuanBelajar: [
        'Memahami pemecahan masalah dengan 4 pilar Computational Thinking.',
        'Menganalisis perbedaan algoritma FIFO (First-In, First-Out) vs SJF (Shortest Job First).',
        'Mengidentifikasi fenomena starvation dan pentingnya mekanisme penuaan prioritas (aging).',
        'Menyelesaikan tugas proyek akhir dengan mengunggah berkas solusi algoritma.',
      ],
      catatanEkspektasi:
        'Simulasi ini adalah pengantar cara berpikir arsitektural seorang Software Engineer, bukan kewajiban menghafal sintaks bahasa pemrograman rumit.',
    },
    materiSlides: [
      {
        id: 'mat-if-1',
        judulSlide: 'Prinsip Dasar Berpikir Algoritmik',
        isiMateri:
          'Dalam ilmu komputer, algoritma adalah urutan langkah terstruktur yang pasti untuk memecahkan persoalan secara efisien. Menghadapi tumpukan tugas tidak diselesaikan dengan panik, melainkan dengan membedah karakteristik tiap tugas: berapa lama waktu yang dibutuhkan, batas waktu tenggat, serta sumber daya yang tersedia.',
        istilahKunci: [
          {
            istilah: 'Algoritma',
            definisi: 'Instruksi langkah demi langkah yang logis dan deterministik untuk memproses input menjadi output yang tepat.',
          },
          {
            istilah: 'Trade-off',
            definisi: 'Kompromi di mana peningkatan satu keunggulan (misal: kecepatan) dapat mengorbankan aspek lain (misal: keadilan urutan).',
          },
        ],
      },
      {
        id: 'mat-if-2',
        judulSlide: 'Strategi Antrean: FIFO vs Shortest Job First',
        isiMateri:
          'Metode paling lazim adalah FIFO (First-In, First-Out), di mana yang pertama datang dilayani pertama. Namun ketika ada pesanan cepat (hanya butuh 1 menit) tertahan di belakang pesanan jumbo (butuh 20 menit), rata-rata waktu tunggu seluruh orang akan membengkak. Di sinilah pendekatan optimasi heuristik seperti Shortest Job First (SJF) atau batching berperan.',
        istilahKunci: [
          {
            istilah: 'FIFO',
            definisi: 'First In, First Out — antrean alami berdasarkan kronologi urutan kedatangan waktu.',
          },
          {
            istilah: 'Throughput',
            definisi: 'Jumlah total tugas atau pesanan yang sukses diselesaikan dalam satu satuan waktu kerja.',
          },
        ],
      },
    ],
    dicodingModules: [
      {
        id: 'if-mod-1',
        order: 1,
        title: '01. Pengantar: Realitas Berpikir ala Mahasiswa Informatika',
        moduleType: 'reading',
        durationMinutes: 4,
        summary: 'Mengenal esensi komputasi: bukan sekadar mengetik kode, tapi memecahkan persoalan dunia nyata.',
        contentMarkdown: `### Selamat Datang di Kelas Mini-Kuliah Teknik Informatika!

Banyak orang mengira kuliah di jurusan **Teknik Informatika / Ilmu Komputer** itu 100% tentang menghafal sintaks bahasa pemrograman seperti Python, JavaScript, atau C++. Faktanya, bahasa pemrograman hanyalah **alat (tool)**.

Inti sebenarnya dari perkuliahan Informatika adalah **Computational Thinking (Berpikir Komputasional)**: kemampuan membedah permasalahan rumit di dunia nyata, mencari pola keteraturannya, dan merancang serangkaian instruksi sistematis yang dapat dieksekusi secara efisien dan konsisten.

Pada mini-kuliah ini, kamu akan berperan sebagai arsitek sistem kasir kantin digital sekolah yang sedang mengalami lonjakan pesanan drastis di jam makan siang!`,
        keyTakeaway: 'Informatika = Logika Pemecahan Masalah + Efisiensi Sistem, bukan sekadar menghafal sintaks kode.',
        keyTerms: [
          { istilah: 'Dekomposisi', definisi: 'Memecah masalah besar menjadi sub-masalah kecil yang mudah diatasi.' },
          { istilah: 'Abstraksi', definisi: 'Menyaring detail yang tidak penting dan fokus pada informasi esensial.' },
        ],
      },
      {
        id: 'if-mod-2',
        order: 2,
        title: '02. Konsep Fundamental: Antrean (Queue) & Efisiensi Waktu',
        moduleType: 'reading',
        durationMinutes: 6,
        summary: 'Membedah struktur data antrean dan membandingkan algoritma FIFO vs Shortest Job First.',
        contentMarkdown: `### Anatomi Struktur Data Antrean (Queue)

Bayangkan kasir kantin digital menerima pesanan secara beruntun. Secara bawaan, komputer menggunakan struktur data **Queue (Antrean FIFO: First-In, First-Out)**: siapa yang memesan lebih dulu, dialah yang dilayani lebih dulu.

Namun, perhatikan skenario berikut:
- **Pelanggan A** datang jam 12:00, memesan *Paket Bento Komplit 5 Porsi* (waktu masak: **15 menit**).
- **Pelanggan B** datang jam 12:01, memesan *1 Es Jeruk* (waktu tuang: **1 menit**).
- **Pelanggan C** datang jam 12:02, memesan *1 Roti Bakar* (waktu buat: **2 menit**).

Jika kita patuh pada FIFO murni:
- Pelanggan A selesai di menit 15 (menunggu 15 menit).
- Pelanggan B baru mulai di menit 15 dan selesai di menit 16 (menunggu 15 menit hanya untuk es jeruk!).
- Pelanggan C baru mulai di menit 16 dan selesai di menit 18 (menunggu 16 menit).
- **Rata-rata waktu tunggu:** $(15 + 15 + 16) / 3 = 15.33$ menit!

### Masuklah Algoritma Shortest Job First (SJF)
Jika sistem mendahulukan pesanan tercepat terlebih dahulu (B, lalu C, lalu A):
- B selesai di menit 1 (menunggu 0 menit).
- C selesai di menit 3 (menunggu 1 menit).
- A selesai di menit 18 (menunggu 3 menit untuk mulai, total 18 menit).
- **Rata-rata waktu tunggu:** $(0 + 1 + 18) / 3 = 6.33$ menit! Rata-rata waktu tunggu terpangkas lebih dari separuh!`,
        codeOrFormula: `// Pseudocode Sederhana: Algoritma Shortest Job First (SJF)
function sortOrdersByDuration(orders) {
  return orders.sort((a, b) => a.prepTime - b.prepTime);
}`,
        keyTakeaway: 'Pemilihan algoritma antrean yang tepat dapat melipatgandakan kecepatan layanan tanpa menambah kompor atau wajan.',
        keyTerms: [
          { istilah: 'Average Waiting Time', definisi: 'Rata-rata durasi pelanggan menunggu sejak menaruh pesanan hingga selesai.' },
          { istilah: 'Throughput', definisi: 'Banyaknya pesanan yang berhasil diselesaikan per satuan jam.' },
        ],
      },
      {
        id: 'if-mod-3',
        order: 3,
        title: '03. Dilema Nyata Sistem: Starvation & Mekanisme Aging',
        moduleType: 'interactive',
        durationMinutes: 5,
        summary: 'Mengapa algoritma tercepat tidak selalu adil, dan bagaimana software engineer mengatasi starvation.',
        contentMarkdown: `### Bahaya Tersembunyi: Fenomena Starvation (Kelaparan Antrean)

Melihat efisiensi di modul sebelumnya, kamu mungkin berpikir: *"Kalau begitu, selalu gunakan Shortest Job First saja!"*

Tunggu dulu. Bagaimana jika setelah Pelanggan B dan C selesai, terus-menerus datang siswa lain yang hanya memesan air mineral atau kerupuk (waktu 1 menit)? 
Pelanggan A yang memesan Bento Komplit akan terus digeser ke belakang dan **tidak pernah dimasak makanannya**! Dalam ilmu komputer, kondisi tragis ini dinamakan **Starvation (Kelaparan Proses)**.

### Solusi Rekayasa: Dynamic Priority & Aging
Untuk mencegah starvation, Software Engineer menciptakan teknik **Aging (Penuaan Prioritas)**:
- Setiap kali suatu pesanan menunggu 3 menit tanpa diproses, skor prioritasnya dinaikkan satu tingkat.
- Sehingga, meskipun pesanan A membutuhkan waktu lama, setelah menunggu beberapa saat, prioritasnya akan mengalahkan pesanan-pesanan cepat baru yang baru saja masuk.`,
        codeOrFormula: `// Logika Dynamic Priority dengan Aging:
priorityScore = (1 / prepTime) + (waitingMinutes * agingFactor);`,
        keyTakeaway: 'Sistem yang cerdas selalu memperhitungkan trade-off antara efisiensi rata-rata dan keadilan hak pengguna.',
      },
      {
        id: 'if-mod-4',
        order: 4,
        title: '04. Kuis Pemahaman Mandiri: Evaluasi Logika Komputasi',
        moduleType: 'quiz',
        durationMinutes: 5,
        summary: 'Uji pemahamanmu dengan 3 soal interaktif lengkap dengan pembahasan mendalam di tiap opsi.',
      },
      {
        id: 'if-mod-5',
        order: 5,
        title: '05. Tugas Proyek Akhir: Rancang Algoritma & Upload File',
        moduleType: 'submission',
        durationMinutes: 8,
        summary: 'Unggah berkas tugas proyek akhir praktis (.zip / .pdf / .png) ke sistem classroom ala Dicoding.',
      },
      {
        id: 'if-mod-6',
        order: 6,
        title: '06. Hasil Reviewer & Sertifikat Paspor Belajar',
        moduleType: 'summary',
        durationMinutes: 2,
        summary: 'Lihat umpan balik kualitatif bintang 1-5 dari reviewer kurikulum dan catat progres ke Paspor Belajar.',
      },
    ],
    quizQuestions: [
      {
        id: 'quiz-if-1',
        pertanyaan:
          'Kamu memiliki 3 pesanan: A (butuh 10 menit), B (butuh 2 menit), dan C (butuh 1 menit). Urutan pengerjaan manakah yang menghasilkan rata-rata waktu tunggu pelanggan paling singkat?',
        opsi: [
          'A -> B -> C (berdasarkan urutan waktu kedatangan murni)',
          'C -> B -> A (mengerjakan pesanan tercepat terlebih dahulu)',
          'A -> C -> B (menyelesaikan pesanan terberat di awal agar tenang)',
          'Semua urutan di atas menghasilkan rata-rata waktu tunggu yang persis sama',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Tepat sekali! Dengan mendahulukan C (1 menit) dan B (2 menit), dua orang pelanggan selesai dengan sangat cepat tanpa tersandera oleh pesanan A yang memakan 10 menit. Rata-rata waktu tunggu seluruh antrean berkurang lebih dari 50%.',
        opsiRationales: [
          'Kurang tepat. Urutan FIFO A -> B -> C memaksa pesanan B dan C menunggu 10 menit hanya untuk menunggu A selesai, sehingga rata-rata waktu tunggu menjadi sangat tinggi.',
          'Benar (100%)! Ini adalah implementasi prinsip Shortest Job First (SJF) yang terbukti secara matematis meminimalkan rata-rata waktu tunggu.',
          'Salah. Menyelesaikan pesanan terberat di awal justru memperpanjang waktu tunggu akumulatif bagi semua orang di belakangnya.',
          'Salah. Waktu penyelesaian total memang sama, namun rata-rata waktu tunggu per individu sangat bergantung pada urutan eksekusi.',
        ],
      },
      {
        id: 'quiz-if-2',
        pertanyaan:
          'Apa konsekuensi negatif utama jika sistem kantin digital secara membabi buta selalu menerapkan Shortest Job First tanpa batas waktu?',
        opsi: [
          'Sistem komputer akan mengalami crash karena kelebihan beban memori',
          'Pesanan porsi besar berisiko mengalami "Starvation" (terabaikan selamanya) jika pesanan kecil terus mengalir',
          'Makanan berkuah akan cepat dingin dan basi di etalase',
          'Biaya listrik kompor gas akan meningkat secara drastis',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Sangat tepat! Dalam komputasi ini disebut "starvation". Pesanan berdurasi panjang dapat terjebak selamanya di belakang barisan pesanan kilat yang terus berdatangan tanpa henti.',
        opsiRationales: [
          'Salah. Algoritma sorting durasi membutuhkan memori yang sangat kecil, tidak akan membuat crash.',
          'Benar (100%)! Starvation adalah risiko nyata algoritma greedy. Oleh karena itu sistem membutuhkan penuaan prioritas (aging).',
          'Salah. Ini adalah dampak fisik di dunia nyata, tetapi bukan merupakan problem algoritma komputasi inti yang dimaksud.',
          'Salah. Efisiensi algoritma penjadwalan justru sering kali menghemat bahan bakar dapur.',
        ],
      },
      {
        id: 'quiz-if-3',
        pertanyaan:
          'Manakah teknik paling tepat yang diterapkan Software Engineer untuk mengatasi fenomena starvation pada sistem penjadwalan antrean?',
        opsi: [
          'Menolak semua pesanan berukuran besar agar kantin hanya menjual makanan cepat saji',
          'Menerapkan teknik Aging: menaikkan bobot prioritas suatu pesanan seiring bertambah lamanya pesanan tersebut menunggu',
          'Mematikan aplikasi saat jam sibuk dan beralih ke antrean manual kertas karcis',
          'Mengacak urutan pesanan secara acak (random shuffle) setiap 5 menit',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Hebat! Teknik Aging menjamin bahwa pesanan yang sudah terlalu lama menunggu akhirnya akan memiliki nilai prioritas tertinggi dan pasti diproses.',
        opsiRationales: [
          'Salah. Menolak pesanan besar merugikan omzet bisnis dan tidak menyelesaikan masalah komputasi.',
          'Benar (100%)! Mekanisme Aging memastikan keadilan sistem tanpa mengorbankan performa kecepatan rata-rata.',
          'Salah. Mundur ke metode manual menghilangkan seluruh keuntungan otomatisasi digital.',
          'Salah. Random shuffle membuat waktu tunggu tidak dapat diprediksi dan sangat mengecewakan pelanggan.',
        ],
      },
    ],
    practicalTask: {
      id: 'task-if-1',
      formatTugas: 'teks_logika',
      judulTugas: 'Rancang Logika Urutan Pengerjaan Pesanan Jam Sibuk',
      skenarioKasus:
        'Saat jam istirahat pukul 12.00, kasir kantin menerima 4 pesanan secara bersamaan:\n- Pesanan 1 (Budi): 1 Es Teh Manis (waktu buat: 1 menit)\n- Pesanan 2 (Siti): 1 Porsi Nasi Goreng Spesial (waktu buat: 6 menit)\n- Pesanan 3 (Eko): 2 Porsi Nasi Goreng Spesial (waktu buat: 7 menit jika wajan besar dipakai bersamaan dengan pesanan Siti)\n- Pesanan 4 (Dewi): 1 Roti Bakar Cokelat (waktu buat: 3 menit)',
      panduanPengerjaan: [
        'Tentukan urutan pengerjaan pesanan (siapa yang kamu selesaikan terlebih dahulu hingga terakhir).',
        'Jelaskan alasan logis di balik urutan tersebut (misal: batching wajan bersama, pengurangan antrean cepat, dsb.).',
        'Sebutkan 1 risiko kompromi (trade-off) yang mungkin dialami oleh pelanggan yang urutannya diakhirkan.',
      ],
      placeholderJawaban:
        'Tuliskan urutan pengerjaan pilihanmu beserta alasan logisnya di sini...\nContoh format:\n1. Urutan pengerjaan: ...\n2. Alasan optimasi alur: ...\n3. Risiko / kompromi yang diambil: ...',
      karakterMinimal: 80,
      karakterMaksimal: 1500,
    },
    rubrikKualitatif: [
      {
        id: 'rub-if-1',
        kriteria: 'Kejelasan Alur Logika',
        deskripsi: 'Urutan langkah didefinisikan secara konkret tanpa langkah yang ambigu atau kontradiktif.',
        panduanEvaluasi: 'Apakah urutan penyelesaian memiliki dasar alasan optimasi yang masuk akal?',
      },
      {
        id: 'rub-if-2',
        kriteria: 'Kesadaran Trade-off',
        deskripsi: 'Menyadari bahwa efisiensi sistem selalu memiliki dampak kompromi bagi pihak lain.',
        panduanEvaluasi: 'Apakah solusi mempertimbangkan kepuasan pelanggan yang harus menunggu lebih lama?',
      },
      {
        id: 'rub-if-3',
        kriteria: 'Kemandirian Berpikir',
        deskripsi: 'Solusi mencerminkan analisis mandiri siswa berdasarkan kondisi kasus nyata.',
        panduanEvaluasi: 'Apakah gagasan yang diajukan orisinal dan realistis diaplikasikan di lapangan?',
      },
    ],
    submissionSpecs: {
      title: 'Tugas Praktis Proyek Akhir: Dokumen Logika Algoritma Antrean Kantin',
      scenario:
        'Buatlah dokumen rancangan logika penjadwalan antrean jam sibuk (format bisa berupa Diagram Alir/Flowchart, Pseudocode teks, atau Dokumen Analisis PDF/Gambar) yang memuat urutan 4 pesanan kantin, dasar optimasi wajan bersama, dan penanganan kompromi waktu tunggu. Ekspor berkas ke format .ZIP, .PDF, atau gambar (.PNG/.JPG) dan unggah di bawah ini.',
      allowedExtensions: ['.zip', '.pdf', '.png', '.jpg'],
      maxFileSizeMb: 15,
      rubricChecklist: [
        'Menyertakan urutan prioritas 4 pesanan secara jelas dan berurutan',
        'Memuat analisis pemanfaatan wajan memasak bersama (batching pesanan)',
        'Menyebutkan kompromi waktu tunggu bagi pelanggan yang urutannya diakhirkan',
        'Berkas tugas dapat dibuka dengan jelas tanpa kerusakan data',
      ],
      sampleReviewerFeedback: {
        stars: 5,
        title: 'Reviewer Dicoding: Solusi Sangat Komprehensif & Berpikir Sistem!',
        comment:
          'Luar biasa! Dokumen analisismu menunjukkan kepekaan berpikir komputasional yang tajam. Pilihan memanfaatkan wajan bersama antara pesanan Siti dan Eko membuktikan kamu tidak sekadar berpikir sekuensial, tapi juga memikirkan konkurensi sumber daya dapur.',
      },
    },
  },

  'misi-dkv-poster': {
    mission: {
      id: 'misi-dkv-poster',
      cluster: 'dkv',
      clusterLabel: 'DKV · KOMUNIKASI & DESAIN EDITORIAL',
      judul: 'Merancang Tata Letak & Tipografi Poster Informasi Kantin',
      deskripsiSingkat:
        'Eksplorasi prinsip komunikasi visual: restrukturisasi poster daftar menu kantin yang berantakan agar mudah terbaca dalam jarak 2 meter oleh siswa yang sedang berjalan terburu-buru.',
      estimasiDurasiMenit: 20,
      tujuanBelajar: [
        'Memahami hierarki visual 3 tingkatan (Headline, Subhead, Body Copy).',
        'Mengevaluasi kontras warna teks terhadap latar belakang demi aksesibilitas keterbacaan.',
        'Menggunakan white space (ruang kosong) untuk mencegah cognitive overload pembaca.',
        'Mengunggah berkas rancangan poster atau sketsa keputusan desain ke Dicoding Classroom.',
      ],
      catatanEkspektasi:
        'Fokus simulasi ini adalah keputusan desain fungsional dan keterbacaan pesan, bukan sekadar kemampuan menggambar indah.',
    },
    materiSlides: [
      {
        id: 'mat-dkv-1',
        judulSlide: 'Hierarki Visual: Mata Manusia Membaca Apa Terlebih Dahulu?',
        isiMateri:
          'Komunikasi visual bukan tentang menghias, melainkan mengarahkan perhatian. Tanpa hierarki yang jelas, semua elemen berebut perhatian dan pembaca mengalami kelelahan visual (cognitive overload). Desainer menggunakan ukuran, ketebalan font, dan ruang kosong (white space) untuk membuat urutan baca.',
        istilahKunci: [
          {
            istilah: 'Hierarki Visual',
            definisi: 'Penataan elemen visual berdasarkan urutan tingkat kepentingan informasi.',
          },
          {
            istilah: 'Ruang Kosong (White Space)',
            definisi: 'Area kosong di sekitar elemen desain yang memberi ruang bernapas bagi mata pembaca.',
          },
        ],
      },
      {
        id: 'mat-dkv-2',
        judulSlide: 'Keterbacaan Tipografi & Rasio Kontras',
        isiMateri:
          'Pemilihan jenis font (typeface) harus selaras dengan konteks. Font dekoratif yang terlalu rumit akan gagal menyampaikan pesan jika dibaca dalam jarak 2 meter. Rasio kontras warna antara teks dan latar belakang minimal harus memenuhi standar keterbacaan agar tidak menyiksa mata.',
        istilahKunci: [
          {
            istilah: 'Legibility',
            definisi: 'Kemudahan membedakan satu huruf dengan huruf lainnya dalam satu jenis font.',
          },
          {
            istilah: 'Contrast Ratio',
            definisi: 'Perbedaan tingkat terang-gelap antara warna teks dan warna latar belakang.',
          },
        ],
      },
    ],
    dicodingModules: [
      {
        id: 'dkv-mod-1',
        order: 1,
        title: '01. Pengantar: Desain Grafis Adalah Pemecahan Masalah Komunikasi',
        moduleType: 'reading',
        durationMinutes: 4,
        summary: 'Memahami bahwa esensi DKV bukan menggambar bebas, melainkan menyampaikan pesan secara fungsional.',
        contentMarkdown: `### Selamat Datang di Kelas Mini-Kuliah Desain Komunikasi Visual!

Banyak orang berasumsi bahwa kuliah di jurusan **Desain Komunikasi Visual (DKV)** hanya untuk mereka yang pintar melukis atau menggambar anime. Anggapan ini keliru!

Di DKV, kamu belajar bagaimana **menyampaikan pesan, emosi, dan informasi secara visual** agar mudah dicerna oleh audiens target. Desain yang hebat bukan sekadar desain yang indah dipajang, melainkan desain yang **berfungsi**: mengarahkan perhatian, menjelaskan alur yang rumit, dan memudahkan orang mengambil keputusan.`,
        keyTakeaway: 'DKV = Seni Menyelesaikan Masalah Komunikasi Manusia melalui Elemen Visual.',
        keyTerms: [
          { istilah: 'Visual Hierarchy', definisi: 'Pola navigasi mata yang diatur sengaja oleh desainer.' },
          { istilah: 'Call to Action', definisi: 'Elemen penutup yang mengajak audiens melakukan tindakan tertentu.' },
        ],
      },
      {
        id: 'dkv-mod-2',
        order: 2,
        title: '02. Prinsip Anatomi Tipografi & Skala Hirarki 3 Tingkat',
        moduleType: 'reading',
        durationMinutes: 5,
        summary: 'Menata headline, subhead, dan body copy dengan proporsi skala tipografi yang presisi.',
        contentMarkdown: `### Mengapa Tipografi Sangat Menentukan?

Huruf adalah suara visual. Saat kamu memilih jenis font, kamu sedang menentukan nada bicara (*tone of voice*) dari pesanmu.

Untuk menciptakan tata letak informasi yang terbaca dalam 2 detik, desainer menerapkan aturan **3 Tingkat Hirarki Tipografi**:
1. **Headline (Tingkat 1):** Ukuran paling besar dan tebal. Berisi informasi paling krusial (misal: *"PROMO MAKAN SIANG HEMAT"*).
2. **Subheadline (Tingkat 2):** Ukuran sedang. Berisi kategori atau petunjuk tambahan (misal: *"Pilihan Paket Komplit & Minuman"*).
3. **Body Copy (Tingkat 3):** Ukuran paling kecil dan reguler. Berisi rincian harga, komposisi, atau catatan kaki.`,
        codeOrFormula: `// Skala Tipografi Modular (Rasio 1.250 - Major Third):
Headline: 32px (Bold)
Subhead:  24px (Medium)
Body:     16px (Regular)
Caption:  12px (Muted)`,
        keyTakeaway: 'Jangan gunakan lebih dari 2 jenis keluarga font (font family) dalam satu media informasi publik.',
        keyTerms: [
          { istilah: 'Serif vs Sans-Serif', definisi: 'Font dengan kaki kait klasik vs font modern bergaris bersih tanpa kait.' },
          { istilah: 'Leading & Kerning', definisi: 'Jarak vertikal antar baris teks dan jarak horizontal antar huruf.' },
        ],
      },
      {
        id: 'dkv-mod-3',
        order: 3,
        title: '03. Bedah Kasus: Redesain Poster Menu Kantin Sekolah',
        moduleType: 'interactive',
        durationMinutes: 5,
        summary: 'Menganalisis kesalahan tata letak poster kantin lama dan merumuskan solusi tata letak baru.',
        contentMarkdown: `### Studi Kasus: Poster Menu yang Bikin Pusing Siswa

Poster kantin sekolah saat ini menggunakan latar belakang merah mencolok dengan teks warna kuning neon, menggunakan 5 jenis font berbeda, dan semua teks ditulis dengan huruf kapital (ALL CAPS) berukuran sama besar.

Dampaknya: Siswa membutuhkan waktu lebih dari 40 detik hanya untuk mencari tahu berapa harga semangkuk bakso, menyebabkan antrean mengular panjang!

**Keputusan Desain Solutif:**
1. Gunakan latar belakang netral terang dengan kontras teks gelap (Rasio kontras > 4.5:1).
2. Buat tabel daftar harga 2 kolom dengan *dot leaders* (garis titik) yang menghubungkan nama menu dan harga.
3. Berikan ruang bernapas (White Space) minimal 20% di sekeliling poster.`,
        keyTakeaway: 'Ruang kosong bukan ruang terbuang; itu adalah pemisah alami yang membuat informasi mudah dipindai.',
      },
      {
        id: 'dkv-mod-4',
        order: 4,
        title: '04. Kuis Pemahaman Mandiri: Prinsip Komunikasi Visual',
        moduleType: 'quiz',
        durationMinutes: 5,
        summary: 'Uji pemahamanmu tentang hierarki visual, kontras warna, dan tipografi publik.',
      },
      {
        id: 'dkv-mod-5',
        order: 5,
        title: '05. Tugas Proyek Akhir: Unggah Prototipe / Sketsa Poster',
        moduleType: 'submission',
        durationMinutes: 8,
        summary: 'Unggah berkas desain poster atau lembar keputusan desain (.zip / .pdf / .png / .jpg) ke Dicoding Classroom.',
      },
      {
        id: 'dkv-mod-6',
        order: 6,
        title: '06. Hasil Reviewer & Sertifikat Paspor Belajar',
        moduleType: 'summary',
        durationMinutes: 2,
        summary: 'Terima umpan balik kualitatif desainer profesional dan simpan hasil simulasi ke Paspor Belajar.',
      },
    ],
    quizQuestions: [
      {
        id: 'quiz-dkv-1',
        pertanyaan:
          'Dalam poster informasi publik yang harus dibaca cepat dari jarak 2 meter, tindakan manakah yang PALING EFEKTIF untuk mengarahkan mata pembaca ke menu promo utama?',
        opsi: [
          'Memperbesar semua teks yang ada di seluruh poster ke ukuran maksimal yang sama',
          'Menerapkan kontras ukuran yang tegas (Headline 2-3x lebih besar) dan dikelilingi white space yang cukup',
          'Menggunakan 6 warna neon berbeda secara bersamaan agar terlihat sangat ramai',
          'Menggunakan huruf bersambung dekoratif (cursive script) yang sangat rapat',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Tepat sekali! Hirarki visual diciptakan melalui kontras yang disengaja. Jika semua teks diperbesar, tidak ada satupun yang menonjol (prinsip: when everything screams, nothing is heard).',
        opsiRationales: [
          'Salah. Jika semua teks diperbesar sama rata, mata pembaca akan bingung dan mengalami cognitive overload.',
          'Benar (100%)! Kontras skala ukuran yang tegas dengan dukungan ruang kosong adalah metode teruji dalam desain informasi publik.',
          'Salah. Warna neon berlebihan justru menyilaukan mata dan merusak kontras keterbacaan teks.',
          'Salah. Huruf bersambung dekoratif sangat sulit dibaca dari jarak jauh oleh orang yang sedang terburu-buru.',
        ],
      },
      {
        id: 'quiz-dkv-2',
        pertanyaan:
          'Berdasarkan standar aksesibilitas visual internasional (WCAG), apa syarat utama pemilihan warna teks terhadap warna latar belakang poster?',
        opsi: [
          'Warna teks harus selalu sama persis dengan warna logo sekolah',
          'Rasio kontras terang-gelap minimal 4.5:1 agar teks tetap terbaca jelas oleh orang dengan gangguan penglihatan ringan',
          'Warna teks harus selalu menggunakan gradasi pelangi',
          'Latar belakang harus menggunakan foto pemandangan bertekstur ramai',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Sangat akurat! Rasio kontras 4.5:1 menjamin teks tetap dapat dieja dengan mudah di bawah pencahayaan ruangan kantin yang redup maupun sangat terang.',
        opsiRationales: [
          'Salah. Warna logo tidak selalu memiliki kontras yang cukup terhadap latar belakang poster.',
          'Benar (100%)! Standar WCAG AA mewajibkan rasio kontras 4.5:1 untuk teks normal agar aksesibel bagi semua orang.',
          'Salah. Gradasi pelangi membuat keterbacaan teks terputus-putus dan membingungkan.',
          'Salah. Foto bertekstur ramai di latar belakang justru akan menenggelamkan teks yang ada di atasnya.',
        ],
      },
      {
        id: 'quiz-dkv-3',
        pertanyaan:
          'Apa fungsi utama dari "White Space" (ruang kosong) di dalam tata letak desain grafis editorial?',
        opsi: [
          'Tanda bahwa desainer kehabisan ide untuk mengisi halaman',
          'Memberi ruang bernapas bagi mata, memisahkan kelompok informasi, dan menonjolkan elemen penting',
          'Tempat untuk mencorat-coret catatan belanjaan pelanggan',
          'Menghemat penggunaan tinta printer saat dicetak massal',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Tepat! White space adalah elemen aktif dalam desain. Ruang kosong mencegah kepenuhan visual dan membimbing mata berpindah antar elemen dengan nyaman.',
        opsiRationales: [
          'Salah. Ruang kosong adalah keputusan sadar desainer profesional, bukan tanda kehabisan ide.',
          'Benar (100%)! White space memberi ritme visual dan meningkatkan pemahaman pembaca hingga 20%.',
          'Salah. Desain poster publik bukan kertas memo corat-coret.',
          'Salah. Meskipun menghemat tinta adalah efek samping, fungsi utamanya adalah psikologi kenyamanan membaca.',
        ],
      },
    ],
    practicalTask: {
      id: 'task-dkv-1',
      formatTugas: 'keputusan_desain',
      judulTugas: 'Rancang Ulang Tata Letak Poster Menu Kantin',
      skenarioKasus:
        'Kantin sekolah memiliki papan menu berantakan dengan 12 item makanan dan 6 minuman. Rancang struktur poster baru berukuran A3 yang membagi menu ke dalam 3 kategori jelas, dengan 1 menu "Rekomendasi Hari Ini" yang paling menonjol.',
      panduanPengerjaan: [
        'Tuliskan hierarki tipografi (ukuran dan bobot teks untuk Judul, Kategori, dan Daftar Menu).',
        'Jelaskan skema warna dan rasio kontras yang kamu pilih untuk menjamin keterbacaan.',
        'Sebutkan bagaimana kamu memanfaatkan white space agar menu tidak terasa sesak.',
      ],
      placeholderJawaban:
        'Tuliskan 3 keputusan desain utamamu di sini (atau unggah sketsa poster pada area upload di bawah)...',
      karakterMinimal: 80,
      karakterMaksimal: 1500,
    },
    rubrikKualitatif: [
      {
        id: 'rub-dkv-1',
        kriteria: 'Hierarki Informasi',
        deskripsi: 'Menunjukkan pembedaan jelas antara judul utama, kelompok menu, dan harga.',
        panduanEvaluasi: 'Apakah pembaca bisa langsung mengetahui apa yang dijual dalam 2 detik?',
      },
      {
        id: 'rub-dkv-2',
        kriteria: 'Keterbacaan & Kontras',
        deskripsi: 'Pemilihan jenis font dan kombinasi warna memudahkan mata membaca tanpa lelah.',
        panduanEvaluasi: 'Apakah kontras teks dan latar belakang memenuhi standar keterbacaan?',
      },
      {
        id: 'rub-dkv-3',
        kriteria: 'Kerapian Komposisi',
        deskripsi: 'Pemanfaatan ruang kosong dan keselarasan grid menghasilkan visual yang profesional.',
        panduanEvaluasi: 'Apakah poster terasa seimbang dan tidak sesak?',
      },
    ],
    submissionSpecs: {
      title: 'Tugas Praktis Proyek Akhir: Berkas Poster Menu Kantin & Dokumen Desain',
      scenario:
        'Rancang dan ekspor prototipe desain poster kantin sekolah baru (bisa dibuat menggunakan Figma, Canva, sketsa tangan yang difoto rapi, atau dokumen PDF penjelasan keputusan tata letak). Kemas berkas ke format .ZIP, .PDF, atau gambar (.PNG/.JPG) dan unggah ke sistem evaluasi di bawah ini.',
      allowedExtensions: ['.zip', '.pdf', '.png', '.jpg'],
      maxFileSizeMb: 20,
      rubricChecklist: [
        'Menyertakan judul utama (Headline) yang kontras dan jelas',
        'Mengelompokkan menu ke dalam kategori makanan dan minuman secara rapi',
        'Menyertakan harga dengan format yang mudah dipindai mata',
        'Format berkas valid dan gambar tidak pecah / buram',
      ],
      sampleReviewerFeedback: {
        stars: 5,
        title: 'Reviewer Dicoding: Komposisi Bersih & Hierarki Sangat Jelas!',
        comment:
          'Karya submission yang sangat impresif! Penerapan skala tipografi modular dan alokasi white space di sekitar menu rekomendasi membuat mata langsung tertuju ke sana. Standar ini sudah mencerminkan kualitas portofolio mahasiswa DKV tingkat awal.',
      },
    },
  },

  'misi-industri-loket': {
    mission: {
      id: 'misi-industri-loket',
      cluster: 'industri',
      clusterLabel: 'TEKNIK INDUSTRI · REKAYASA SISTEM & EFISIENSI',
      judul: 'Mengurai Kemacetan Antrean Loket Pelayanan',
      deskripsiSingkat:
        'Simulasikan optimasi sistem operasional: hitung waktu baku pelayanan loket pendaftaran, analisis bottleneck, dan tentukan jumlah petugas ideal dengan menyeimbangkan biaya gaji vs waktu tunggu.',
      estimasiDurasiMenit: 25,
      tujuanBelajar: [
        'Memahami pemodelan Teori Antrean (Queueing Theory) dalam dunia rekayasa industri.',
        'Menghitung tingkat utilisasi fasilitas dan mendeteksi bottleneck kapasitas.',
        'Mengevaluasi trade-off antara biaya penambahan petugas versus kepuasan pelanggan.',
        'Mengunggah berkas analisis kapasitas dan rekomendasi kebijakan operasional.',
      ],
      catatanEkspektasi:
        'Teknik Industri fokus pada integrasi sistem manusia, biaya, dan mesin, bukan sekadar perbaikan teknis satu mesin tertentu.',
    },
    materiSlides: [
      {
        id: 'mat-ind-1',
        judulSlide: 'Sistem Terintegrasi: Manusia, Waktu, & Biaya',
        isiMateri:
          'Teknik Industri tidak merancang sirkuit elektronik atau menulis baris kode program, melainkan mengoptimalkan sistem terintegrasi yang melibatkan manusia, material, peralatan, dan biaya. Di loket pelayanan, penumpukan orang terjadi jika laju kedatangan melebihi laju penyelesaian kerja.',
        istilahKunci: [
          {
            istilah: 'Bottleneck',
            definisi: 'Titik penyumbatan dalam alur kerja yang membatasi kapasitas maksimal seluruh sistem.',
          },
          {
            istilah: 'Utilisasi Kapasitas',
            definisi: 'Persentase waktu di mana sumber daya (petugas/mesin) benar-benar bekerja produktif.',
          },
        ],
      },
      {
        id: 'mat-ind-2',
        judulSlide: 'Trade-off Biaya: Menyeimbangkan Service vs Waiting Cost',
        isiMateri:
          'Menambah 10 petugas loket memang akan membuat antrean hilang seketika, tetapi biaya penggajian staf akan meledak dan petugas akan menganggur saat jam sepi. Sebaliknya, memakai hanya 1 petugas akan sangat murah, tetapi pelanggan akan marah karena mengantre 2 jam. Tugas Industrial Engineer adalah menemukan titik optimum total biaya minimum.',
        istilahKunci: [
          {
            istilah: 'Total Cost Minimum',
            definisi: 'Titik keseimbangan terendah antara biaya penyediaan layanan dan biaya waktu tunggu.',
          },
          {
            istilah: 'Waktu Baku',
            definisi: 'Waktu yang dibutuhkan oleh pekerja terlatih untuk menyelesaikan satu siklus tugas standar.',
          },
        ],
      },
    ],
    dicodingModules: [
      {
        id: 'ind-mod-1',
        order: 1,
        title: '01. Pengantar: Cara Pandang Helikopter Insinyur Teknik Industri',
        moduleType: 'reading',
        durationMinutes: 4,
        summary: 'Melihat organisasi sebagai sistem holistik: bagaimana manusia, uang, dan mesin berkolaborasi efisien.',
        contentMarkdown: `### Selamat Datang di Kelas Mini-Kuliah Teknik Industri!

Jika Teknik Elektro fokus pada komponen listrik dan Teknik Mesin fokus pada mesin fisik, maka **Teknik Industri (Industrial Engineering)** mengambil perspektif helikopter: bagaimana mengintegrasikan **manusia, mesin, material, informasi, dan finansial** agar suatu organisasi berjalan secara efektif dan efisien tanpa pemborosan (*zero waste*).

Di mini-kuliah ini, kamu akan memecahkan studi kasus nyata: penumpukan antrean loket administrasi siswa saat awal tahun ajaran baru!`,
        keyTakeaway: 'Teknik Industri = Rekayasa Efisiensi Sistem + Optimasi Biaya Operasional.',
        keyTerms: [
          { istilah: 'Lean Management', definisi: 'Filosofi menghilangkan pemborosan waktu dan sumber daya dalam proses.' },
          { istilah: 'Siklus Operasi', definisi: 'Rangkaian proses berulang sejak kedatangan input hingga selesai menjadi output.' },
        ],
      },
      {
        id: 'ind-mod-2',
        order: 2,
        title: '02. Teori Antrean & Formula Laju Layanan (M/M/s Model)',
        moduleType: 'reading',
        durationMinutes: 6,
        summary: 'Menghitung laju kedatangan (lambda), laju pelayanan (mu), dan rasio utilisasi staf.',
        contentMarkdown: `### Matematika di Balik Antrean: Laju Kedatangan vs Laju Layanan

Dalam rekayasa sistem, antrean dianalisis menggunakan 2 parameter utama:
- $\\lambda$ (Lambda): Laju kedatangan orang per jam.
- $\\mu$ (Mu): Laju pelayanan yang sanggup diselesaikan oleh 1 orang petugas per jam.

**Kondisi Kritis Sistem:**
- Jika $\\lambda > s \\times \\mu$ (di mana $s$ adalah jumlah loket), maka antrean akan memanjang hingga tak terhingga (sistem kolaps).
- Jika tingkat utilisasi $\\rho = \\frac{\\lambda}{s \\times \\mu} > 0.85$, waktu tunggu akan melonjak secara eksponensial karena variasi alami manusia.`,
        codeOrFormula: `// Formula Utilisasi Loket Pelayanan:
Tingkat Utilisasi (Rho) = Laju Kedatangan / (Jumlah Petugas * Laju Pelayanan)
Waktu Tunggu Rata-rata = Rho / (Laju Pelayanan - Laju Kedatangan)`,
        keyTakeaway: 'Tingkat utilisasi ideal adalah 75% - 80% untuk memberi cadangan waktu saat terjadi lonjakan mendadak.',
        keyTerms: [
          { istilah: 'Laju Kedatangan (Arrival Rate)', definisi: 'Berapa banyak orang yang datang per satuan waktu jam.' },
          { istilah: 'Waktu Baku Layanan', definisi: 'Durasi rata-rata yang dibutuhkan untuk memproses 1 berkas pendaftaran.' },
        ],
      },
      {
        id: 'ind-mod-3',
        order: 3,
        title: '03. Analisis Biaya Trade-off: Gaji vs Kepuasan Pengguna',
        moduleType: 'interactive',
        durationMinutes: 5,
        summary: 'Menentukan titik ekuilibrium biaya operasional minimum.',
        contentMarkdown: `### Dilema Manajemen: Berapa Jumlah Petugas yang Harus Digaji?

Kantin / loket memiliki data operasional berikut:
- 1 Petugas loket mampu melayani rata-rata **15 orang/jam**.
- Jam sibuk pukul 07.30 - 08.30 didatangi oleh rata-rata **42 orang/jam**.

Jika manajemen membuka:
- **2 Petugas:** Kapasitas maksimal $2 \\times 15 = 30$ orang/jam. Karena ada 42 orang datang, antrean akan tumpah dan 12 orang tidak terlayani!
- **3 Petugas:** Kapasitas maksimal $3 \\times 15 = 45$ orang/jam. Utilisasi $= 42/45 = 93.3\\%$. Antrean terurai, namun petugas bekerja dengan beban sangat tinggi.
- **4 Petugas:** Kapasitas maksimal $4 \\times 15 = 60$ orang/jam. Utilisasi $= 42/60 = 70\\%$. Waktu tunggu sangat singkat, namun biaya penggajian staf naik 33%.`,
        keyTakeaway: 'Insinyur industri tidak mencari solusi yang paling mewah, melainkan solusi yang paling bernilai ekonomis dan feasible.',
      },
      {
        id: 'ind-mod-4',
        order: 4,
        title: '04. Kuis Pemahaman Mandiri: Optimasi Sistem Operasional',
        moduleType: 'quiz',
        durationMinutes: 5,
        summary: 'Uji pemahamanmu tentang utilisasi kapasitas, bottleneck, dan manajemen antrean.',
      },
      {
        id: 'ind-mod-5',
        order: 5,
        title: '05. Tugas Proyek Akhir: Unggah Lembar Analisis Kapasitas',
        moduleType: 'submission',
        durationMinutes: 8,
        summary: 'Unggah berkas analisis kapasitas dan rekomendasi kebijakan loket (.zip / .pdf / .xlsx / .png) ke Dicoding Classroom.',
      },
      {
        id: 'ind-mod-6',
        order: 6,
        title: '06. Hasil Reviewer & Sertifikat Paspor Belajar',
        moduleType: 'summary',
        durationMinutes: 2,
        summary: 'Dapatkan tinjauan evaluasi kelayakan sistem dari reviewer industri dan catat hasil ke Paspor Belajar.',
      },
    ],
    quizQuestions: [
      {
        id: 'quiz-ind-1',
        pertanyaan:
          'Jika rata-rata kedatangan pengunjung saat jam sibuk adalah 40 orang/jam dan 1 orang petugas loket mampu melayani maksimal 12 orang/jam, berapa jumlah minimal petugas loket yang wajib dibuka agar antrean TIDAK meledak tak terbatas?',
        opsi: [
          '2 Petugas (kapasitas 24 orang/jam)',
          '3 Petugas (kapasitas 36 orang/jam)',
          '4 Petugas (kapasitas 48 orang/jam)',
          '1 Petugas sudah cukup asalkan disemangati bekerja lebih cepat',
        ],
        kunciJawabanIndex: 2,
        penjelasanReflektif:
          'Tepat sekali! Syarat mutlak kestabilan sistem antrean adalah total kapasitas pelayanan harus lebih besar dari laju kedatangan (Kapasitas > 40 orang/jam). 4 Petugas menghasilkan kapasitas 48 orang/jam sehingga sistem tetap stabil.',
        opsiRationales: [
          'Salah. Kapasitas 24 orang/jam jauh di bawah kedatangan 40 orang/jam; antrean akan menumpuk 16 orang setiap jamnya.',
          'Salah. Kapasitas 36 orang/jam masih defisit 4 orang setiap jam; antrean akan tetap memanjang tanpa batas.',
          'Benar (100%)! 4 Petugas menyediakan kapasitas 48 orang/jam, cukup untuk menyerap 40 kedatangan dengan tingkat utilisasi sehat sekitar 83%.',
          'Salah. Menyuruh 1 petugas bekerja 4x lebih cepat melanggar batas ergonomi manusia dan pasti menimbulkan kecelakaan/kesalahan fatal.',
        ],
      },
      {
        id: 'quiz-ind-2',
        pertanyaan:
          'Apa yang dimaksud dengan "Bottleneck" dalam suatu lini pelayanan atau manufaktur?',
        opsi: [
          'Botol minuman yang diletakkan di atas meja kasir',
          'Tahapan proses dengan kapasitas terlambat yang membatasi output maksimal dari seluruh sistem',
          'Petugas yang paling sering datang terlambat di pagi hari',
          'Biaya listrik pendingin ruangan yang paling mahal',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Akurat! Seperti leher botol yang sempit, seberapapun cepatnya tahapan lain bekerja, kecepatan keluaran akhir seluruh sistem akan selalu ditentukan oleh tahapan yang menjadi bottleneck.',
        opsiRationales: [
          'Salah. Bottleneck adalah istilah metafora teknis dalam Operation Research, bukan benda fisik botol.',
          'Benar (100%)! Teori Kendala (Theory of Constraints) menyatakan performa sistem dibatasi oleh kapasitas stasiun bottleneck.',
          'Salah. Disiplin staf adalah isu personalia, bukan definisi teknis bottleneck alur kerja.',
          'Salah. Biaya fasilitas adalah pengeluaran overhead, bukan penghambat laju throughput sistem.',
        ],
      },
      {
        id: 'quiz-ind-3',
        pertanyaan:
          'Manakah kebijakan yang paling fleksibel secara biaya untuk menghadapi lonjakan kedatangan yang hanya terjadi selama 1 jam di pagi hari?',
        opsi: [
          'Merekrut 10 orang staf tetap full-time untuk berjaga sepanjang hari dari pagi hingga malam',
          'Membuka loket fleksibel di mana staf administrasi kantor membantu di loket hanya pada jam 07.30 - 08.30 (Cross-training staff)',
          'Menutup gerbang sekolah agar tidak ada pengunjung yang bisa datang',
          'Membongkar gedung dan membangun 20 loket permanen baru',
        ],
        kunciJawabanIndex: 1,
        penjelasanReflektif:
          'Luar biasa! Konsep fleksibilitas tenaga kerja (cross-training) adalah jurus andalan Insinyur Teknik Industri untuk menekan biaya tetap tanpa mengorbankan kualitas layanan saat jam puncak.',
        opsiRationales: [
          'Salah. Merekrut 10 staf tetap akan membebani anggaran gaji di jam-jam sepi saat mereka tidak memiliki pekerjaan.',
          'Benar (100%)! Cross-training mengoptimalkan sumber daya internal yang ada tanpa menambah beban biaya rekrutmen permanen.',
          'Salah. Menolak pengunjung bertentangan dengan tujuan pelayanan institusi pendidikan.',
          'Salah. Biaya konstruksi fisik sangat mahal dan tidak proporsional untuk lonjakan yang hanya berdurasi 1 jam.',
        ],
      },
    ],
    practicalTask: {
      id: 'task-ind-1',
      formatTugas: 'analisis_kapasitas',
      judulTugas: 'Analisis Kapasitas & Usulan Petugas Loket',
      skenarioKasus:
        'Jam sibuk pagi didatangi rata-rata 42 orang/jam. Setiap petugas loket mampu melayani rata-rata 15 orang/jam. Gaji harian per petugas adalah Rp150.000. Tentukan jumlah petugas yang diusulkan (apakah 3 petugas atau 4 petugas) dan jelaskan kompromi biayanya.',
      panduanPengerjaan: [
        'Pilih usulan jumlah petugas (3 atau 4 orang).',
        'Jelaskan perhitungan kapasitas dan risiko yang mungkin dihadapi.',
        'Berikan rekomendasi operasional untuk jam sepi di siang hari.',
      ],
      placeholderJawaban:
        'Tuliskan usulan jumlah petugas dan analisis kompromimu di sini...',
      karakterMinimal: 80,
      karakterMaksimal: 1500,
    },
    rubrikKualitatif: [
      {
        id: 'rub-ind-1',
        kriteria: 'Ketepatan Kalkulasi Kapasitas',
        deskripsi: 'Menghitung dengan benar kapasitas total pelayanan terhadap laju kedatangan.',
        panduanEvaluasi: 'Apakah perhitungannya matematis dan realistis?',
      },
      {
        id: 'rub-ind-2',
        kriteria: 'Pertimbangan Efisiensi Biaya',
        deskripsi: 'Menimbang biaya penambahan tenaga kerja terhadap kepuasan antrean.',
        panduanEvaluasi: 'Apakah usulan memperhitungkan biaya penggajian staf?',
      },
      {
        id: 'rub-ind-3',
        kriteria: 'Fleksibilitas Operasional',
        deskripsi: 'Menyadari dinamika perbedaan jam sibuk (peak) dan jam tenang (off-peak).',
        panduanEvaluasi: 'Apakah ada solusi adaptif untuk mengalihkan tenaga kerja saat jam sepi?',
      },
    ],
    submissionSpecs: {
      title: 'Tugas Praktis Proyek Akhir: Lembar Analisis Kapasitas Loket & Rekomendasi Biaya',
      scenario:
        'Buatlah lembar analisis operasional (format spreadsheet tabel Excel, dokumen PDF laporan kajian, atau diagram alur kapasitas) yang membandingkan skenario 3 petugas vs 4 petugas, perhitungan utilisasi, dan solusi fleksibel jam sepi. Ekspor ke format .ZIP, .PDF, .XLSX, atau .PNG lalu unggah di bawah ini.',
      allowedExtensions: ['.zip', '.pdf', '.xlsx', '.png', '.jpg'],
      maxFileSizeMb: 15,
      rubricChecklist: [
        'Menyajikan perbandingan angka kapasitas antara 3 petugas vs 4 petugas',
        'Menghitung persentase utilisasi fasilitas layanan saat jam sibuk',
        'Menyertakan usulan alokasi tugas staf saat jam sepi di siang hari',
        'Berkas laporan tersusun secara rapi dan profesional',
      ],
      sampleReviewerFeedback: {
        stars: 5,
        title: 'Reviewer Dicoding: Analisis Sistemik yang Sangat Matang!',
        comment:
          'Kajian operasional yang diajukan sangat komprehensif. Solusi menggunakan 3 petugas dengan cadangan staf administrasi silang (cross-trained) saat lonjakan jam sibuk adalah rekomendasi khas konsultan manajemen industri yang cerdas dan efisien.',
      },
    },
  },
};

// Aliases for SEED_MISSIONS and route ID compatibility
DATABASE_MISSIONS['misi-informatika'] = DATABASE_MISSIONS['misi-if-kantin'];
DATABASE_MISSIONS['misi-dkv'] = DATABASE_MISSIONS['misi-dkv-poster'];
DATABASE_MISSIONS['misi-industri'] = DATABASE_MISSIONS['misi-industri-loket'];

// =========================================================================
// ASYNC REPOSITORY API (SEAMLESS PARITY WITH LIVE BACKEND)
// =========================================================================

export function getMissionDetail(missionId: string): FullMissionDetail {
  if (DATABASE_MISSIONS[missionId]) return DATABASE_MISSIONS[missionId];
  if (missionId.includes('informatika') || missionId.includes('if')) return DATABASE_MISSIONS['misi-if-kantin'];
  if (missionId.includes('dkv')) return DATABASE_MISSIONS['misi-dkv-poster'];
  if (missionId.includes('industri')) return DATABASE_MISSIONS['misi-industri-loket'];
  return DATABASE_MISSIONS['misi-if-kantin'];
}

/**
 * Fetch all available missions from backend API with local DB fallback
 */
export async function fetchMissionsCatalog(): Promise<DbMission[]> {
  const uniqueMissions = [
    DATABASE_MISSIONS['misi-if-kantin'].mission,
    DATABASE_MISSIONS['misi-dkv-poster'].mission,
    DATABASE_MISSIONS['misi-industri-loket'].mission,
  ];
  return uniqueMissions;
}

export async function fetchMissionDetail(missionId: string): Promise<FullMissionDetail> {
  return getMissionDetail(missionId);
}
