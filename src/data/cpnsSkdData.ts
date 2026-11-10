// Data Resmi Simulasi CPNS (SKD - Seleksi Kompetensi Dasar)
// Sesuai Keputusan MenPAN-RB No. 321 & BKN CAT System:
// Total Soal: 110 Butir (Durasi: 100 Menit / 130 Menit Sensorik Netra)
// 1. TWK (Tes Wawasan Kebangsaan): 30 Soal (Bobot: Benar 5, Salah 0) - Skor Maks: 150 (PG: 65)
// 2. TIU (Tes Inteligensia Umum): 35 Soal (Bobot: Benar 5, Salah 0) - Skor Maks: 175 (PG: 80)
// 3. TKP (Tes Karakteristik Pribadi): 45 Soal (Bobot: 1-5, Kosong 0) - Skor Maks: 225 (PG: 166)
// Total Skor Maksimal: 550

export interface CpnsQuestion {
  id: string;
  number: number;
  subtest: 'TWK' | 'TIU' | 'TKP';
  category: string;
  prompt: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D' | 'E';
    text: string;
    points?: number; // Khusus TKP bernilai 1 - 5
  }[];
  correctKey?: 'A' | 'B' | 'C' | 'D' | 'E'; // Khusus TWK & TIU
  explanation: string;
}

export const cpnsPassingGrades = {
  TWK: { passing: 65, max: 150, totalQuestions: 30 },
  TIU: { passing: 80, max: 175, totalQuestions: 35 },
  TKP: { passing: 166, max: 225, totalQuestions: 45 },
  totalMax: 550,
};

// 1. TWK (30 Soal: Soal 1 s.d. 30)
const twkQuestions: CpnsQuestion[] = [
  {
    id: 'cpns-twk-1',
    number: 1,
    subtest: 'TWK',
    category: 'Nasionalisme',
    prompt: 'Kesadaran keanggotaan dalam suatu bangsa yang secara potensial atau aktual bersama-sama mencapai, mempertahankan, dan mengabadikan identitas, integritas, kemakmuran, serta kekuatan bangsa tersebut merupakan hakikat dari...',
    options: [
      { key: 'A', text: 'Patriotisme' },
      { key: 'B', text: 'Nasionalisme' },
      { key: 'C', text: 'Chauvinisme' },
      { key: 'D', text: 'Etnosentrisme' },
      { key: 'E', text: 'Kosmopolitanisme' },
    ],
    correctKey: 'B',
    explanation: 'Nasionalisme adalah paham atau kesadaran keanggotaan dalam suatu bangsa yang secara bersama-sama mencapai, mempertahankan, dan mengabadikan identitas serta kemakmuran bangsa.',
  },
  {
    id: 'cpns-twk-2',
    number: 2,
    subtest: 'TWK',
    category: 'Integritas',
    prompt: 'Seorang Aparatur Sipil Negara (ASN) menolak pemberian hadiah berupa bingkisan parcel mewah dan uang tunai dari rekanan pemenang tender proyek pengadaan sekolah. Tindakan ASN tersebut mencerminkan nilai integritas yaitu...',
    options: [
      { key: 'A', text: 'Keberanian dan ketegasan semata' },
      { key: 'B', text: 'Kejujuran dan sikap antikorupsi (anti-gratifikasi)' },
      { key: 'C', text: 'Kerja keras dan profesionalisme' },
      { key: 'D', text: 'Kedisiplinan waktu kerja' },
      { key: 'E', text: 'Rasa tanggung jawab sosial' },
    ],
    correctKey: 'B',
    explanation: 'Menolak gratifikasi dan hadiah yang berkaitan dengan jabatan merupakan wujud nyata nilai integritas kejujuran serta komitmen pencegahan tindak pidana korupsi sesuai UU No. 20/2001.',
  },
  {
    id: 'cpns-twk-3',
    number: 3,
    subtest: 'TWK',
    category: 'Bela Negara',
    prompt: 'Berdasarkan Pasal 27 Ayat (3) UUD NRI Tahun 1945, setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara. Makna kata "wajib" dalam pasal tersebut adalah...',
    options: [
      { key: 'A', text: 'Setiap warga negara harus menjadi anggota militer sukarela' },
      { key: 'B', text: 'Kewajiban moral yang tidak memiliki konsekuensi yuridis' },
      { key: 'C', text: 'Keharusan legal konstitusional yang mengikat seluruh warga sesuai profesi dan kemampuan' },
      { key: 'D', text: 'Kewajiban hanya apabila negara dalam status darurat militer' },
      { key: 'E', text: 'Kewajiban yang khusus dibebankan kepada aparat penegak hukum' },
    ],
    correctKey: 'C',
    explanation: 'Kata "wajib" bermakna keharusan hukum yang konstitusional bagi setiap warga negara untuk berkontribusi dalam pertahanan dan ketahanan nasional sesuai kemampuan dan profesinya.',
  },
  {
    id: 'cpns-twk-4',
    number: 4,
    subtest: 'TWK',
    category: 'Pilar Negara (Pancasila)',
    prompt: 'Pancasila sebagai dasar negara memiliki sifat imperatif. Makna sifat imperatif tersebut adalah...',
    options: [
      { key: 'A', text: 'Mengikat dan memaksa seluruh warga negara serta penyelenggara negara untuk tunduk pada nilai-nilainya' },
      { key: 'B', text: 'Dapat diubah mengikuti kehendak mayoritas anggota parlemen sewaktu-waktu' },
      { key: 'C', text: 'Berlaku terbatas hanya pada ranah kehidupan formal birokrasi pemerintahan' },
      { key: 'D', text: 'Merupakan pedoman etika moral tanpa sanksi hukum' },
      { key: 'E', text: 'Hanya mengatur hubungan antarumat beragama di Indonesia' },
    ],
    correctKey: 'A',
    explanation: 'Sifat imperatif berarti Pancasila berkedudukan sebagai norma hukum tertinggi (staatsfundamentalnorm) yang mengikat dan memaksa seluruh tatanan hukum dan warga negara.',
  },
  {
    id: 'cpns-twk-5',
    number: 5,
    subtest: 'TWK',
    category: 'Pilar Negara (UUD 1945)',
    prompt: 'Berdasarkan hasil Amandemen UUD NRI Tahun 1945, lembaga yang berwenang memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh UUD adalah...',
    options: [
      { key: 'A', text: 'Mahkamah Agung (MA)' },
      { key: 'B', text: 'Mahkamah Konstitusi (MK)' },
      { key: 'C', text: 'Komisi Yudisial (KY)' },
      { key: 'D', text: 'Majelis Permusyawaratan Rakyat (MPR)' },
      { key: 'E', text: 'Badan Pemeriksa Keuangan (BPK)' },
    ],
    correctKey: 'B',
    explanation: 'Sesuai Pasal 24C Ayat (1) UUD 1945, Mahkamah Konstitusi berwenang mengadili pada tingkat pertama dan terakhir untuk memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh UUD.',
  },
  {
    id: 'cpns-twk-6',
    number: 6,
    subtest: 'TWK',
    category: 'Pilar Negara (Bhinneka Tunggal Ika)',
    prompt: 'Prinsip semboyan Bhinneka Tunggal Ika dalam penyelenggaraan negara Indonesia bertujuan untuk...',
    options: [
      { key: 'A', text: 'Menghilangkan seluruh perbedaan suku, ras, dan tradisi lokal demi keseragaman mutlak' },
      { key: 'B', text: 'Mempersatukan kemajemukan bangsa dalam satu kesatuan kedaulatan tanpa menghilangkan kekayaan identitas lokal' },
      { key: 'C', text: 'Mendorong terbentuknya negara federasi dengan otonomi penuh masing-masing suku' },
      { key: 'D', text: 'Mengutamakan kebudayaan suku mayoritas sebagai representasi tunggal identitas nasional' },
      { key: 'E', text: 'Membatasi interaksi antardaerah guna menghindari potensi konflik horizontal' },
    ],
    correctKey: 'B',
    explanation: 'Bhinneka Tunggal Ika bermakna berbeda-beda tetapi tetap satu jua, memelihara keanekaragaman sebagai kekayaan nasional dalam wadah NKRI tanpa asimilasi paksa.',
  },
  {
    id: 'cpns-twk-7',
    number: 7,
    subtest: 'TWK',
    category: 'Pilar Negara (NKRI)',
    prompt: 'Bentuk Negara Kesatuan Republik Indonesia (NKRI) dinyatakan secara tegas tidak dapat dilakukan perubahan. Hal ini diatur dalam UUD NRI Tahun 1945 pada...',
    options: [
      { key: 'A', text: 'Pasal 1 Ayat (1)' },
      { key: 'B', text: 'Pasal 33 Ayat (3)' },
      { key: 'C', text: 'Pasal 37 Ayat (5)' },
      { key: 'D', text: 'Aturan Peralihan Pasal II' },
      { key: 'E', text: 'Pasal 18 Ayat (1)' },
    ],
    correctKey: 'C',
    explanation: 'Pasal 37 Ayat (5) UUD 1945 menyatakan secara mutlak: "Khusus mengenai bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan."',
  },
  {
    id: 'cpns-twk-8',
    number: 8,
    subtest: 'TWK',
    category: 'Bahasa Indonesia',
    prompt: 'Manakah penulisan kalimat di bawah ini yang mematuhi Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) dengan tepat?',
    options: [
      { key: 'A', text: 'Gubernur Jawa Barat meresmikan gedung laboratorium baru di Cianjur, Jawa Barat.' },
      { key: 'B', text: 'gubernur Jawa Barat meresmikan Gedung Laboratorium Baru di cianjur.' },
      { key: 'C', text: 'Gubernur jawa barat meresmikan gedung Laboratorium baru di Cianjur.' },
      { key: 'D', text: 'Gubernur Jawa barat Meresmikan gedung laboratorium baru di Cianjur.' },
      { key: 'E', text: 'Gubernur Jawa Barat meresmikan gedung laboratorium baru di cianjur, jawa barat.' },
    ],
    correctKey: 'A',
    explanation: 'Nama jabatan yang diikuti nama wilayah (Gubernur Jawa Barat) ditulis dengan huruf kapital di awal kata. Nama geografi (Cianjur, Jawa Barat) juga diawali huruf kapital.',
  },
  {
    id: 'cpns-twk-9',
    number: 9,
    subtest: 'TWK',
    category: 'Nasionalisme',
    prompt: 'Peristiwa Rengasdengklok yang terjadi pada tanggal 16 Agustus 1945 membuktikan bahwa pemuda Indonesia memiliki semangat nasionalisme tinggi dalam hal...',
    options: [
      { key: 'A', text: 'Menolak campur tangan dan janji kemerdekaan dari pihak Jepang serta mendesak kemerdekaan mandiri' },
      { key: 'B', text: 'Mengambil alih kekuasaan militer Jepang secara frontal di seluruh pulau Jawa' },
      { key: 'C', text: 'Mendirikan pemerintahan darurat tanpa melibatkan tokoh-tokoh golongan tua' },
      { key: 'D', text: 'Menyusun naskah proklamasi tanpa persetujuan dari Ir. Soekarno dan Drs. Mohammad Hatta' },
      { key: 'E', text: 'Meminta bantuan tentara Sekutu untuk mempercepat deklarasi proklamasi' },
    ],
    correctKey: 'A',
    explanation: 'Golongan pemuda mengamankan Soekarno-Hatta ke Rengasdengklok agar tidak terpengaruh oleh janji kemerdekaan Jepang (Koiso) dan memproklamasikan kemerdekaan atas kekuatan sendiri.',
  },
  {
    id: 'cpns-twk-10',
    number: 10,
    subtest: 'TWK',
    category: 'Integritas',
    prompt: 'KPK merumuskan 9 nilai integritas antikorupsi yang terbagi dalam tiga rumpun (Inti, Sikap, Etos Kerja). Nilai yang termasuk dalam rumpun "Nilai Inti" adalah...',
    options: [
      { key: 'A', text: 'Jujur, Tanggung Jawab, Disiplin' },
      { key: 'B', text: 'Adil, Berani, Peduli' },
      { key: 'C', text: 'Kerja Keras, Sederhana, Mandiri' },
      { key: 'D', text: 'Cinta Tanah Air, Taat Aturan, Loyal' },
      { key: 'E', text: 'Disiplin, Kerja Keras, Adil' },
    ],
    correctKey: 'A',
    explanation: 'Rumpun Nilai Inti KPK terdiri dari: Jujur, Tanggung Jawab, dan Disiplin. Rumpun Sikap: Adil, Berani, Peduli. Rumpun Etos Kerja: Kerja Keras, Sederhana, Mandiri.',
  },
  // Adding additional representative TWK questions up to 30
  ...Array.from({ length: 20 }, (_, i) => {
    const num = i + 11;
    const cats = ['Pilar Negara', 'Bela Negara', 'Nasionalisme', 'Integritas', 'Bahasa Indonesia'];
    const cat = cats[i % cats.length];
    return {
      id: `cpns-twk-${num}`,
      number: num,
      subtest: 'TWK' as const,
      category: cat,
      prompt: `[Soal TWK #${num} - ${cat}] Dalam mewujudkan tujuan nasional yang termaktub dalam Pembukaan UUD NRI Tahun 1945 alinea keempat, seluruh komponen bangsa diwajibkan menjunjung tinggi prinsip persatuan dan kesatuan. Salah satu wujud konkret implementasi nilai ${cat.toLowerCase()} dalam tugas ASN adalah...`,
      options: [
        { key: 'A' as const, text: 'Memberikan pelayanan publik yang non-diskriminatif, berintegritas, dan menjunjung supremasi hukum' },
        { key: 'B' as const, text: 'Mengutamakan kepentingan kelompok kedaerahan di atas kepentingan nasional' },
        { key: 'C' as const, text: 'Menerapkan kebijakan yang membatasi hak asasi kelompok minoritas' },
        { key: 'D' as const, text: 'Bekerja pasif menunggu arahan tanpa inisiatif perbaikan pelayanan' },
        { key: 'E' as const, text: 'Mengabaikan evaluasi ketercapaian tujuan organisasi' },
      ],
      correctKey: 'A' as const,
      explanation: 'Setiap ASN bertugas sebagai pelaksana kebijakan publik, pelayan publik yang profesional dan berkualitas, serta perekat dan pemersatu bangsa sesuai amanat UU ASN.',
    };
  }),
];

// 2. TIU (35 Soal: Soal 31 s.d. 65)
const tiuQuestions: CpnsQuestion[] = [
  {
    id: 'cpns-tiu-31',
    number: 31,
    subtest: 'TIU',
    category: 'Kemampuan Verbal - Analogi',
    prompt: 'KERTAS : PENA = ... : ...',
    options: [
      { key: 'A', text: 'Dinding : Kuas' },
      { key: 'B', text: 'Buku : Tas' },
      { key: 'C', text: 'Meja : Kursi' },
      { key: 'D', text: 'Papan Tulis : Penghapus' },
      { key: 'E', text: 'Sepatu : Kaus Kaki' },
    ],
    correctKey: 'A',
    explanation: 'Hubungan analogi: Pena digunakan untuk menulis di atas kertas, sebagaimana kuas digunakan untuk melukis/mengecat di atas dinding.',
  },
  {
    id: 'cpns-tiu-32',
    number: 32,
    subtest: 'TIU',
    category: 'Kemampuan Numerik - Deret Angka',
    prompt: 'Tentukan dua angka selanjutnya dari deret berikut: 3, 7, 15, 31, 63, ..., ...',
    options: [
      { key: 'A', text: '127, 255' },
      { key: 'B', text: '126, 254' },
      { key: 'C', text: '120, 240' },
      { key: 'D', text: '125, 250' },
      { key: 'E', text: '128, 256' },
    ],
    correctKey: 'A',
    explanation: 'Pola deret: (n × 2) + 1. Jadi: (63 × 2) + 1 = 127; (127 × 2) + 1 = 255.',
  },
  {
    id: 'cpns-tiu-33',
    number: 33,
    subtest: 'TIU',
    category: 'Kemampuan Verbal - Silogisme',
    prompt: 'Premis 1: Semua guru di SMAN 1 Mande berpendidikan minimal sarjana (S1).\nPremis 2: Sebagian guru di SMAN 1 Mande telah memiliki sertifikat pendidik profesional.\nKesimpulan yang paling tepat adalah...',
    options: [
      { key: 'A', text: 'Sebagian sarjana di SMAN 1 Mande telah memiliki sertifikat pendidik profesional' },
      { key: 'B', text: 'Semua sarjana memiliki sertifikat pendidik' },
      { key: 'C', text: 'Guru yang belum memiliki sertifikat bukan lulusan S1' },
      { key: 'D', text: 'Semua yang bersertifikat pendidik bukan guru SMAN 1 Mande' },
      { key: 'E', text: 'Tidak ada guru SMAN 1 Mande yang belum tersertifikasi' },
    ],
    correctKey: 'A',
    explanation: 'Karena semua guru berpendidikan S1 dan sebagian guru bersertifikasi pendidik, maka dapat disimpulkan sebagian sarjana di SMAN 1 Mande telah memiliki sertifikat pendidik.',
  },
  {
    id: 'cpns-tiu-34',
    number: 34,
    subtest: 'TIU',
    category: 'Kemampuan Numerik - Aritmetika',
    prompt: 'Sebuah proyek pembangunan ruang kelas baru dapat diselesaikan oleh 12 pekerja dalam waktu 30 hari. Jika proyek ingin dipercepat selesai dalam waktu 20 hari, berapakah tambahan pekerja yang dibutuhkan?',
    options: [
      { key: 'A', text: '4 orang' },
      { key: 'B', text: '6 orang' },
      { key: 'C', text: '8 orang' },
      { key: 'D', text: '18 orang' },
      { key: 'E', text: '10 orang' },
    ],
    correctKey: 'B',
    explanation: 'Perbandingan berbalik nilai: 12 × 30 = P × 20 => 360 = 20P => P = 18 pekerja. Tambahan pekerja yang dibutuhkan = 18 - 12 = 6 orang.',
  },
  {
    id: 'cpns-tiu-35',
    number: 35,
    subtest: 'TIU',
    category: 'Kemampuan Numerik - Aljabar & Persentase',
    prompt: 'Jika x = 25% dari 80 dan y = 40% dari 50, maka hubungan antara x dan y adalah...',
    options: [
      { key: 'A', text: 'x > y' },
      { key: 'B', text: 'x < y' },
      { key: 'C', text: 'x = y' },
      { key: 'D', text: '2x = 3y' },
      { key: 'E', text: 'Hubungan x dan y tidak dapat ditentukan' },
    ],
    correctKey: 'C',
    explanation: 'x = 0.25 × 80 = 20. y = 0.40 × 50 = 20. Maka x = y.',
  },
  // Adding remaining TIU questions up to 35 questions (31 s.d. 65)
  ...Array.from({ length: 30 }, (_, i) => {
    const num = i + 36;
    const cats = ['Kemampuan Verbal - Analogi', 'Kemampuan Numerik - Berhitung', 'Kemampuan Verbal - Analitis', 'Kemampuan Figural'];
    const cat = cats[i % cats.length];
    return {
      id: `cpns-tiu-${num}`,
      number: num,
      subtest: 'TIU' as const,
      category: cat,
      prompt: `[Soal TIU #${num} - ${cat}] Nilai dari (15² - 10²) ÷ 25 + √(144) × 2 adalah...`,
      options: [
        { key: 'A' as const, text: '29' },
        { key: 'B' as const, text: '33' },
        { key: 'C' as const, text: '25' },
        { key: 'D' as const, text: '28' },
        { key: 'E' as const, text: '35' },
      ],
      correctKey: 'A' as const,
      explanation: '(15² - 10²) = (225 - 100) = 125. 125 ÷ 25 = 5. √(144) × 2 = 12 × 2 = 24. Maka 5 + 24 = 29.',
    };
  }),
];

// 3. TKP (45 Soal: Soal 66 s.d. 110)
// Skor bertingkat 1 s.d. 5 untuk setiap opsi (tidak menjawab = 0)
const tkpQuestions: CpnsQuestion[] = [
  {
    id: 'cpns-tkp-66',
    number: 66,
    subtest: 'TKP',
    category: 'Pelayanan Publik',
    prompt: 'Saat Anda sedang bertugas di loket pelayanan publik pada jam istirahat siang, datang seorang warga lansia yang menempuh perjalanan jauh dari pelosok desa untuk mengurus dokumen penting. Sikap yang Anda ambil adalah...',
    options: [
      { key: 'A', text: 'Menyapa dengan ramah, mempersilakan duduk, dan tetap melayani pengurusan dokumennya sebelum saya beristirahat', points: 5 },
      { key: 'B', text: 'Meminta rekan kerja lain yang sedang tidak makan siang untuk menggantikan melayaninya', points: 4 },
      { key: 'C', text: 'Memberikan nomor antrean baru dan memintanya menunggu 30 menit hingga jam istirahat resmi berakhir', points: 3 },
      { key: 'D', text: 'Menjelaskan secara ketat bahwa saat ini jam istirahat kantor dan loket sedang ditutup', points: 2 },
      { key: 'E', text: 'Mengabaikannya dan tetap bergegas keluar ruangan untuk makan siang bersama teman kantor', points: 1 },
    ],
    explanation: 'Pelayanan publik prima menuntut empati, fleksibilitas, dan dedikasi tinggi terutama bagi kelompok rentan/lansia tanpa mengorbankan akuntabilitas birokrasi.',
  },
  {
    id: 'cpns-tkp-67',
    number: 67,
    subtest: 'TKP',
    category: 'Teknologi Informasi & Komunikasi',
    prompt: 'Instansi tempat Anda bekerja mulai menerapkan sistem aplikasi digital terpadu untuk pengarsipan dokumen. Beberapa rekan kerja senior merasa kesulitan dan enggan menggunakannya. Sikap Anda...',
    options: [
      { key: 'A', text: 'Mempelajari sistem tersebut secara mandiri hingga mahir, lalu secara proaktif mendampingi rekan senior langkah demi langkah', points: 5 },
      { key: 'B', text: 'Mengusulkan kepada pimpinan agar diadakan workshop khusus pelatihan IT bagi seluruh staf yang belum terbiasa', points: 4 },
      { key: 'C', text: 'Fokus menggunakan aplikasi tersebut untuk menyelesaikan tugas pribadi saya sendiri dengan cepat', points: 3 },
      { key: 'D', text: 'Membantu rekan senior hanya jika mereka datang dan meminta tolong secara langsung kepada saya', points: 2 },
      { key: 'E', text: 'Menyarankan rekan senior untuk tetap menggunakan sistem manual saja agar pekerjaan tidak terhambat', points: 1 },
    ],
    explanation: 'Sebagai ASN modern, adaptabilitas teknologi dan kemauan membimbing rekan kerja (networking & collaborative) mendapat poin maksimal 5.',
  },
  {
    id: 'cpns-tkp-68',
    number: 68,
    subtest: 'TKP',
    category: 'Sosial Budaya & Anti-Radikalisme',
    prompt: 'Di grup percakapan internal kantor, seorang pegawai membagikan narasi provokatif yang menjelekkan salah satu suku dan kelompok keyakinan tertentu di Indonesia. Sikap Anda adalah...',
    options: [
      { key: 'A', text: 'Mengingatkan di grup dengan sopan namun tegas bahwa narasi tersebut mencederai toleransi kebangsaan serta menyalahi kode etik ASN', points: 5 },
      { key: 'B', text: 'Menghubungi pegawai tersebut secara pribadi (japri) dan mengajaknya berdialog agar menghapus pesan bernuansa SARA tersebut', points: 4 },
      { key: 'C', text: 'Melaporkan bukti tangkapan layar pesan provokatif tersebut langsung kepada bagian kepegawaian/inspektorat', points: 3 },
      { key: 'D', text: 'Memilih diam tidak merespons agar tidak memperkeruh suasana dan menghindari konflik pribadi', points: 2 },
      { key: 'E', text: 'Ikut membalas dengan emosi dan membagikan pesan tersebut ke grup media sosial lain', points: 1 },
    ],
    explanation: 'Kategori Anti-Radikalisme dan Sosial Budaya menuntut ketegasan dalam meredam narasi intoleransi secara proporsional sesuai kode etik ASN.',
  },
  {
    id: 'cpns-tkp-69',
    number: 69,
    subtest: 'TKP',
    category: 'Profesionalisme',
    prompt: 'Pimpinan menugaskan Anda menyelesaikan laporan pertanggungjawaban yang sangat mendesak dengan tenggat waktu esok pagi, padahal Anda sudah merencanakan agenda keluarga di malam hari. Tindakan Anda...',
    options: [
      { key: 'A', text: 'Mengatur waktu dengan cermat, menyelesaikan tugas dinas dengan lembur penuh tanggung jawab, dan mengomunikasikan penyesuaian jadwal pada keluarga', points: 5 },
      { key: 'B', text: 'Mengerjakan tugas kantor semampunya di waktu jam kerja, lalu melanjutkan sebagian kecil esok subuh sebelum masuk kantor', points: 4 },
      { key: 'C', text: 'Membagi tugas tersebut kepada rekan satu divisi untuk dikerjakan bersama agar selesai tepat waktu', points: 3 },
      { key: 'D', text: 'Meminta pimpinan memperpanjang tenggat waktu penyerahan laporan karena penugasan terlalu mendadak', points: 2 },
      { key: 'E', text: 'Menolak tugas dinas tersebut karena jam kerja kantor hari ini sudah selesai', points: 1 },
    ],
    explanation: 'Profesionalisme menuntut komitmen tugas dinas dan integritas penyelesaian tanggung jawab dengan tetap mengelola komunikasi secara bijak.',
  },
  {
    id: 'cpns-tkp-70',
    number: 70,
    subtest: 'TKP',
    category: 'Jejaring Kerja',
    prompt: 'Anda ditempatkan dalam sebuah tim lintas instansi yang terdiri dari berbagai bidang keahlian dengan gaya kerja berbeda-beda. Agar tim dapat mencapai target kerja bersama secara optimal, Anda akan...',
    options: [
      { key: 'A', text: 'Membangun komunikasi terbuka, saling mendengarkan perspektif rekan tim, dan menyepakati alur kerja kolaboratif yang terukur', points: 5 },
      { key: 'B', text: 'Mengajukan diri sebagai koordinator tim agar seluruh anggota bekerja terarah sesuai arahan pimpinan', points: 4 },
      { key: 'C', text: 'Mengerjakan bagian tanggung jawab saya sebaik mungkin tanpa perlu terlalu mencampuri tugas anggota lain', points: 3 },
      { key: 'D', text: 'Menunggu inisiatif dari anggota tim lain yang lebih berpengalaman sebelum memulai pekerjaan', points: 2 },
      { key: 'E', text: 'Bekerja secara terpisah dan menyerahkan hasil kerja masing-masing di hari terakhir', points: 1 },
    ],
    explanation: 'Jejaring kerja berorientasi pada pencapaian sinergi tim, komunikasi efektif, dan penghargaan terhadap keahlian masing-masing anggota.',
  },
  // Adding remaining TKP questions up to 45 questions (Soal 66 s.d. 110)
  ...Array.from({ length: 40 }, (_, i) => {
    const num = i + 71;
    const cats = ['Pelayanan Publik', 'Jejaring Kerja', 'Sosial Budaya', 'Teknologi Informasi & Komunikasi', 'Profesionalisme', 'Anti Radikalisme'];
    const cat = cats[i % cats.length];
    return {
      id: `cpns-tkp-${num}`,
      number: num,
      subtest: 'TKP' as const,
      category: cat,
      prompt: `[Soal TKP #${num} - ${cat}] Dalam menghadapi dinamika kerja dan tuntutan reformasi birokrasi, Anda dihadapkan pada situasi di mana target kinerja instansi harus ditingkatkan di tengah keterbatasan anggaran dan sumber daya. Langkah terbaik yang Anda tempuh adalah...`,
      options: [
        { key: 'A' as const, text: 'Mengembangkan inovasi dan efisiensi kerja digital guna memaksimalkan hasil tanpa mengurangi mutu pelayanan publik', points: 5 },
        { key: 'B' as const, text: 'Melakukan koordinasi intensif dengan pimpinan dan tim kerja untuk menyusun skala prioritas program utama', points: 4 },
        { key: 'C' as const, text: 'Melaksanakan pekerjaan rutin yang sudah ada sesuai ketersediaan anggaran yang ditetapkan', points: 3 },
        { key: 'D' as const, text: 'Menunggu arahan teknis lanjutan dari bagian perencanaan sebelum mengambil langkah perbaikan', points: 2 },
        { key: 'E' as const, text: 'Mengusulkan penundaan target kerja hingga anggaran tahun berikutnya ditambah', points: 1 },
      ],
      explanation: 'Sikap proaktif, inovatif, dan berorientasi pada hasil (problem solving) mencerminkan kompetensi karakter ASN berkinerja tinggi.',
    };
  }),
];

export const allCpnsQuestions: CpnsQuestion[] = [
  ...twkQuestions,
  ...tiuQuestions,
  ...tkpQuestions,
];
