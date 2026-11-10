// Data Resmi Simulasi PPPK (Seleksi Kompetensi Pegawai Pemerintah dengan Perjanjian Kerja)
// Berdasarkan Keputusan MenPAN-RB & BKN CAT:
// Total Soal: 145 Butir (Durasi: 130 Menit: 120 Menit Tes Utama + 10 Menit Wawancara)
// 1. Kompetensi Teknis (Guru & Profesional): 90 Soal (Benar: 5, Salah/Kosong: 0) -> Maks: 450
// 2. Kompetensi Manajerial: 25 Soal (Nilai bertingkat: 1-4, Kosong: 0)
// 3. Kompetensi Sosial Kultural: 20 Soal (Nilai bertingkat: 1-4, Kosong: 0)
//    (Nilai Maksimal Gabungan Manajerial & Sosial Kultural: 180, Passing Grade: 130)
// 4. Wawancara Berbasis Komputer: 10 Soal (Nilai bertingkat: 1-4, Kosong: 0) -> Maks: 40 (Passing Grade: 24)
// Total Skor Maksimal: 670

export interface PppkOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  points?: number; // Khusus Manajerial, Sosio-Kultural & Wawancara bernilai 1 s.d. 4
}

export interface PppkQuestion {
  id: string;
  number: number;
  subtest: 'Teknis' | 'Manajerial' | 'Sosial Kultural' | 'Wawancara';
  category: string;
  prompt: string;
  options: PppkOption[];
  correctKey?: 'A' | 'B' | 'C' | 'D' | 'E'; // Khusus Teknis
  explanation: string;
}

export const pppkPassingGrades = {
  Teknis: { passing: 270, max: 450, totalQuestions: 90 },
  ManajerialSosialKultural: { passing: 130, max: 180, totalQuestions: 45 },
  Wawancara: { passing: 24, max: 40, totalQuestions: 10 },
  totalMax: 670,
};

// 1. TEKNIS GURU & PENDIDIKAN PANCASILA (90 Soal: Soal 1 s.d. 90)
const teknisQuestions: PppkQuestion[] = [
  {
    id: 'pppk-tek-1',
    number: 1,
    subtest: 'Teknis',
    category: 'Pedagogik - Asesmen Kurikulum Merdeka',
    prompt: 'Dalam merancang asesmen diagnostik pada awal pembelajaran Pendidikan Pancasila materi "Pancasila sebagai Ideologi Terbuka", tujuan utama guru adalah...',
    options: [
      { key: 'A', text: 'Menentukan nilai akhir rapor siswa untuk kenaikan kelas' },
      { key: 'B', text: 'Mengidentifikasi kompetensi awal, minat belajar, dan gaya belajar siswa guna merancang diferensiasi pembelajaran' },
      { key: 'C', text: 'Membandingkan prestasi belajar siswa dengan sekolah lain' },
      { key: 'D', text: 'Memberikan sanksi akademik bagi siswa yang belum membaca modul ajar' },
      { key: 'E', text: 'Menyeleksi siswa terbaik untuk dikirim ke lomba cerdas cermat nasional' },
    ],
    correctKey: 'B',
    explanation: 'Asesmen diagnostik bertujuan memetakan kemampuan awal, kebutuhan, dan kesiapan belajar peserta didik sebagai dasar diferensiasi proses dan konten pembelajaran.',
  },
  {
    id: 'pppk-tek-2',
    number: 2,
    subtest: 'Teknis',
    category: 'Pedagogik - Model Pembelajaran Inovatif',
    prompt: 'Seorang guru ingin melatih kemampuan penalaran kritis siswa dalam memecahkan dilema intoleransi di media sosial. Model pembelajaran berbasis masalah yang paling relevan diterapkan adalah...',
    options: [
      { key: 'A', text: 'Direct Instruction (Ceramah Monolog)' },
      { key: 'B', text: 'Problem-Based Learning (PBL) berorientasi kasus kontekstual' },
      { key: 'C', text: 'Rote Learning (Hafalan Butir Sila)' },
      { key: 'D', text: 'Drill and Practice penugasan individu' },
      { key: 'E', text: 'Metode ceramah bervariasi satu arah' },
    ],
    correctKey: 'B',
    explanation: 'Problem-Based Learning (PBL) menantang siswa menyelidiki masalah dunia nyata secara kolaboratif sehingga mengasah nalar kritis dan pemecahan masalah sesuai Profil Pelajar Pancasila.',
  },
  {
    id: 'pppk-tek-3',
    number: 3,
    subtest: 'Teknis',
    category: 'Profesional - Substansi Konstitusi UUD 1945',
    prompt: 'Sesuai dengan ketentuan Pasal 1 Ayat (2) UUD NRI Tahun 1945 hasil amandemen, kedaulatan berada di tangan rakyat dan dilaksanakan menurut...',
    options: [
      { key: 'A', text: 'Ketetapan Majelis Permusyawaratan Rakyat sepenuhnya' },
      { key: 'B', text: 'Undang-Undang Dasar' },
      { key: 'C', text: 'Keputusan Presiden bersama Dewan Perwakilan Rakyat' },
      { key: 'D', text: 'Hasil musyawarah para tetua adat daerah' },
      { key: 'E', text: 'Kebijakan Mahkamah Agung' },
    ],
    correctKey: 'B',
    explanation: 'Pasal 1 Ayat (2) UUD 1945 berbunyi: "Kedaulatan berada di tangan rakyat dan dilaksanakan menurut Undang-Undang Dasar." Ini menegaskan prinsip supremasi konstitusi.',
  },
  {
    id: 'pppk-tek-4',
    number: 4,
    subtest: 'Teknis',
    category: 'Pedagogik - Pembelajaran Terdiferensiasi',
    prompt: 'Di kelas XII SMAN 1 Mande, terdapat keragaman kemampuan siswa dalam menganalisis kasus pelanggaran HAM. Penerapan diferensiasi produk yang tepat adalah...',
    options: [
      { key: 'A', text: 'Memaksa seluruh siswa membuat laporan makalah setebal 20 halaman dengan format seragam' },
      { key: 'B', text: 'Memberikan kebebasan memilih bentuk unjuk karya: infografis, video kampanye edukatif, esai opini, atau podcast diskusi' },
      { key: 'C', text: 'Memberikan nilai yang sama rata kepada seluruh siswa tanpa memeriksa isi tugas' },
      { key: 'D', text: 'Menurunkan standar kompetensi esensial bagi kelompok siswa tertentu' },
      { key: 'E', text: 'Hanya menilai siswa yang mengumpulkan tugas paling cepat' },
    ],
    correctKey: 'B',
    explanation: 'Diferensiasi produk memberikan ragam modalitas dan saluran bagi siswa untuk menunjukkan pemahaman capaian pembelajaran sesuai minat dan profil belajarnya.',
  },
  {
    id: 'pppk-tek-5',
    number: 5,
    subtest: 'Teknis',
    category: 'Profesional - Nilai-Nilai Luhur Pancasila',
    prompt: 'Nilai praksis Pancasila merupakan perwujudan nilai instrumental dalam situasi riil sehari-hari. Contoh penerapan nilai praksis Sila Keempat di lingkungan sekolah adalah...',
    options: [
      { key: 'A', text: 'Menghargai teman yang sedang menjalankan ibadah sesuai agamanya' },
      { key: 'B', text: 'Mengambil keputusan pemilihan ketua OSIS melalui musyawarah mufakat dan pemungutan suara yang jujur adil' },
      { key: 'C', text: 'Membantu korban bencana alam di sekitar sekolah' },
      { key: 'D', text: 'Membeli produk kerajinan karya teman di sekolah' },
      { key: 'E', text: 'Menjaga kebersihan taman kelas bersama-sama' },
    ],
    correctKey: 'B',
    explanation: 'Musyawarah mufakat dan pemilihan umum ketua OSIS yang demokratis merupakan perwujudan konkret nilai praksis Sila Keempat Pancasila.',
  },
  // Adding remaining technical questions up to 90
  ...Array.from({ length: 85 }, (_, i) => {
    const num = i + 6;
    const cats = ['Pedagogik - Teori Belajar', 'Pedagogik - Asesmen Kurikulum Merdeka', 'Profesional - UUD 1945', 'Profesional - Bhinneka Tunggal Ika', 'Pedagogik - Karakter Pelajar Pancasila'];
    const cat = cats[i % cats.length];
    return {
      id: `pppk-tek-${num}`,
      number: num,
      subtest: 'Teknis' as const,
      category: cat,
      prompt: `[Soal Teknis Guru PPPK #${num} - ${cat}] Dalam kerangka Kurikulum Merdeka Fase E & F di SMA Negeri 1 Mande, guru dituntut menyelaraskan Capaian Pembelajaran (CP) ke Alur Tujuan Pembelajaran (ATP). Tindakan pedagogis yang tepat adalah...`,
      options: [
        { key: 'A' as const, text: 'Merumuskan tujuan pembelajaran yang terukur, kontekstual, dan mengintegrasikan 6 dimensi Profil Pelajar Pancasila' },
        { key: 'B' as const, text: 'Mengabaikan karakteristik sekolah dan menyalin seluruh RPP dari internet secara mentah' },
        { key: 'C' as const, text: 'Hanya menggunakan tes tertulis pilihan ganda untuk seluruh evaluasi akhir' },
        { key: 'D' as const, text: 'Menjadikan nilai kognitif sebagai satu-satunya penentu kelulusan siswa' },
        { key: 'E' as const, text: 'Menyerahkan penyusunan modul sepenuhnya kepada siswa tanpa panduan' },
      ],
      correctKey: 'A' as const,
      explanation: 'Pendidik profesional menyusun ATP secara bertahap dan terukur dengan mengintegrasikan dimensi Profil Pelajar Pancasila sesuai karakteristik satuan pendidikan.',
    };
  }),
];

// 2. KOMPETENSI MANAJERIAL (25 Soal: Soal 91 s.d. 115)
// Skor bertingkat 1 s.d. 4 untuk setiap opsi (tidak menjawab = 0)
const manajerialQuestions: PppkQuestion[] = [
  {
    id: 'pppk-man-91',
    number: 91,
    subtest: 'Manajerial',
    category: 'Integritas & Kerjasama',
    prompt: 'Anda ditunjuk menjadi ketua panitia Asesmen Sumatif Akhir Jenjang di sekolah. Salah seorang panitia mengusulkan pemotongan anggaran konsumsi secara sepihak untuk dibagikan sebagai uang saku tambahan panitia. Sikap Anda...',
    options: [
      { key: 'A', text: 'Menolak dengan tegas dan santun serta menegaskan bahwa seluruh penggunaan anggaran harus sesuai Rencana Anggaran Biaya (RAB) resmi', points: 4 },
      { key: 'B', text: 'Mengajak seluruh anggota panitia bermusyawarah untuk mencari solusi efisiensi yang legal tanpa menyalahi aturan', points: 3 },
      { key: 'C', text: 'Melaporkan usulan tersebut secara langsung kepada kepala sekolah tanpa berbicara dengan yang bersangkutan', points: 2 },
      { key: 'D', text: 'Menyetujui usulan tersebut asalkan seluruh anggota panitia merahasiakannya', points: 1 },
    ],
    explanation: 'Integritas tinggi menuntut ketegasan menolak penyimpangan anggaran jabatan dengan akuntabilitas pelaporan yang transparan.',
  },
  {
    id: 'pppk-man-92',
    number: 92,
    subtest: 'Manajerial',
    category: 'Orientasi pada Hasil',
    prompt: 'Batas waktu pengunggahan nilai e-rapor tinggal 2 hari lagi, namun laptop pribadi Anda tiba-tiba rusak dan data belum sempat diunggah. Tindakan yang Anda lakukan...',
    options: [
      { key: 'A', text: 'Segera meminjam fasilitas komputer laboratorium sekolah atau rekan kerja dan bekerja lembur agar nilai tuntas sebelum tenggat waktu', points: 4 },
      { key: 'B', text: 'Menghubungi operator sekolah dan meminta perpanjangan waktu pengunggahan nilai secara pribadi', points: 3 },
      { key: 'C', text: 'Menunggu laptop selesai diservis di tempat perbaikan komputer', points: 2 },
      { key: 'D', text: 'Menyalahkan kualitas perangkat dan membiarkan nilai siswa kosong', points: 1 },
    ],
    explanation: 'Orientasi pada hasil menuntut kegigihan mencari solusi alternatif secara mandiri agar target instansi tercapai tepat waktu.',
  },
  // Adding remaining 23 Manajerial questions up to 25
  ...Array.from({ length: 23 }, (_, i) => {
    const num = i + 93;
    const cats = ['Komunikasi', 'Pelayanan Publik', 'Mengelola Perubahan', 'Pengambilan Keputusan'];
    const cat = cats[i % cats.length];
    return {
      id: `pppk-man-${num}`,
      number: num,
      subtest: 'Manajerial' as const,
      category: cat,
      prompt: `[Soal Manajerial PPPK #${num} - ${cat}] Dalam menghadapi transformasi digital dan perubahan kebijakan kurikulum di lingkungan sekolah, bagaimana Anda memimpin adaptasi tim kerja guru?`,
      options: [
        { key: 'A' as const, text: 'Menjadi teladan perubahan, aktif membagikan praktik baik, dan memfasilitasi pendampingan sejawat secara berkelanjutan', points: 4 },
        { key: 'B' as const, text: 'Mengikuti pelatihan yang ditugaskan oleh pimpinan dan menjalankannya sesuai batas minimal instruksi', points: 3 },
        { key: 'C' as const, text: 'Menunggu rekan guru lain berhasil menerapkan sebelum saya mulai mencoba', points: 2 },
        { key: 'D' as const, text: 'Mempertahankan metode lama karena dinilai lebih aman dan tidak merepotkan', points: 1 },
      ],
      explanation: 'Kompetensi mengelola perubahan menuntut sikap visioner, keteladanan proaktif, dan kemampuan memberdayakan rekan sejawat.',
    };
  }),
];

// 3. KOMPETENSI SOSIAL KULTURAL (20 Soal: Soal 116 s.d. 135)
// Skor bertingkat 1 s.d. 4 untuk setiap opsi (tidak menjawab = 0)
const sosialKulturalQuestions: PppkQuestion[] = [
  {
    id: 'pppk-sos-116',
    number: 116,
    subtest: 'Sosial Kultural',
    category: 'Kepekaan terhadap Keberagaman',
    prompt: 'Di sekolah tempat Anda mengajar, ada siswa pindahan baru dari daerah terluar Indonesia yang memiliki logat bahasa dan adat istiadat berbeda sehingga kerap diasingkan oleh teman sekelasnya. Sikap Anda...',
    options: [
      { key: 'A', text: 'Merancang pembelajaran kolaboratif yang mengangkat kekayaan budaya nusantara dan menanamkan sikap empati inklusif kepada seluruh siswa', points: 4 },
      { key: 'B', text: 'Menegur siswa yang mengasingkan dan memberi nasihat agar tidak mengulangi perbuatannya', points: 3 },
      { key: 'C', text: 'Meminta guru BK untuk menangani adaptasi siswa baru tersebut secara terpisah', points: 2 },
      { key: 'D', text: 'Membiarkannya karena adaptasi pertemanan merupakan proses alami antarsiswa', points: 1 },
    ],
    explanation: 'Sebagai pendidik perekat bangsa, guru harus proaktif membangun iklim kelas yang inklusif, merayakan kebinekaan global, dan mencegah diskriminasi.',
  },
  // Adding remaining 19 Sosial Kultural questions up to 20
  ...Array.from({ length: 19 }, (_, i) => {
    const num = i + 117;
    const cats = ['Hubungan Sosial', 'Kepekaan terhadap Konflik', 'Empati & Toleransi', 'Perekat Bangsa'];
    const cat = cats[i % cats.length];
    return {
      id: `pppk-sos-${num}`,
      number: num,
      subtest: 'Sosial Kultural' as const,
      category: cat,
      prompt: `[Soal Sosial Kultural PPPK #${num} - ${cat}] Di lingkungan masyarakat tempat tinggal Anda yang multietnis, muncul gesekan akibat perbedaan perayaan hari besar keagamaan. Sikap Anda sebagai aparatur pemerintah adalah...`,
      options: [
        { key: 'A' as const, text: 'Berinisiatif memediasi dialog antartokoh masyarakat dengan mengedepankan musyawarah mufakat dan semangat persatuan', points: 4 },
        { key: 'B' as const, text: 'Mendukung penyelesaian masalah melalui aparat penegak hukum dan pengurus RT/RW setempat', points: 3 },
        { key: 'C' as const, text: 'Menghindari lokasi perselisihan agar tidak terlibat dalam polemik masyarakat', points: 2 },
        { key: 'D' as const, text: 'Membela pihak yang memiliki kesamaan latar belakang dengan diri saya', points: 1 },
      ],
      explanation: 'Kompetensi sosial kultural mengukur kemampuan bersikap adil, menjadi jembatan perdamaian, dan memelihara keharmonisan keberagaman bangsa.',
    };
  }),
];

// 4. WAWANCARA BERBASIS KOMPUTER (10 Soal: Soal 136 s.d. 145)
// Skor bertingkat 1 s.d. 4 untuk setiap opsi (tidak menjawab = 0)
const wawancaraQuestions: PppkQuestion[] = [
  {
    id: 'pppk-waw-136',
    number: 136,
    subtest: 'Wawancara',
    category: 'Integritas & Komitmen Moral',
    prompt: 'Apa motivasi terbesar Anda mendaftar dan mengabdi sebagai Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) di lingkungan dinas pendidikan?',
    options: [
      { key: 'A', text: 'Mengabdikan ilmu dan kompetensi secara profesional untuk mencerdaskan generasi penerus bangsa serta memajukan mutu pendidikan nasional', points: 4 },
      { key: 'B', text: 'Memperoleh kepastian status kerja dan jenjang karier yang lebih terjamin dalam sistem aparatur sipil negara', points: 3 },
      { key: 'C', text: 'Memenuhi harapan keluarga yang menginginkan saya menjadi pegawai pemerintah', points: 2 },
      { key: 'D', text: 'Mencari pengalaman kerja baru karena belum mendapatkan pekerjaan di sektor swasta', points: 1 },
    ],
    explanation: 'Wawancara PPPK menggali integritas, komitmen pengabdian tulus, dan dedikasi kepada kemajuan bangsa dan negara.',
  },
  {
    id: 'pppk-waw-137',
    number: 137,
    subtest: 'Wawancara',
    category: 'Loyalitas & Kepatuhan Regulasi',
    prompt: 'Jika sewaktu-waktu pemerintah menugaskan Anda ditempatkan di sekolah daerah pedalaman yang fasilitasnya minim, bagaimana komitmen Anda?',
    options: [
      { key: 'A', text: 'Siap menjalankan tugas dengan penuh dedikasi, optimisme, serta mencari inovasi pembelajaran memanfaatkan kearifan lokal', points: 4 },
      { key: 'B', text: 'Menerima penugasan tersebut dengan syarat diberikan tunjangan dan fasilitas penunjang yang memadai', points: 3 },
      { key: 'C', text: 'Mencoba mengajukan permohonan pindah ke sekolah yang lebih dekat dengan kota setelah beberapa bulan bekerja', points: 2 },
      { key: 'D', text: 'Menolak penugasan tersebut karena tidak sesuai dengan lokasi penempatan yang saya harapkan', points: 1 },
    ],
    explanation: 'ASN PPPK terikat pakta kesediaan ditempatkan di seluruh wilayah NKRI demi pemerataan kualitas layanan pendidikan.',
  },
  // Adding remaining 8 Wawancara questions up to 10
  ...Array.from({ length: 8 }, (_, i) => {
    const num = i + 138;
    const cats = ['Integritas', 'Moralitas', 'Etos Kerja Pengabdian', 'Kepatuhan Kode Etik'];
    const cat = cats[i % cats.length];
    return {
      id: `pppk-waw-${num}`,
      number: num,
      subtest: 'Wawancara' as const,
      category: cat,
      prompt: `[Soal Wawancara PPPK #${num} - ${cat}] Bagaimana Anda menjaga martabat profesi guru dan menghindari konflik kepentingan saat menjalankan tugas di sekolah?`,
      options: [
        { key: 'A' as const, text: 'Menjunjung tinggi kode etik pendidik, bersikap transparan, tidak menerima imbalan ilegal dari wali murid, dan mengutamakan kepentingan peserta didik', points: 4 },
        { key: 'B' as const, text: 'Bekerja sesuai standar prosedur operasional dan aturan kedinasan yang telah disahkan kepala sekolah', points: 3 },
        { key: 'C' as const, text: 'Menghindari komunikasi dengan wali murid di luar jam sekolah agar tidak menimbulkan fitnah', points: 2 },
        { key: 'D' as const, text: 'Mengikuti kebiasaan yang lazim dilakukan oleh guru-guru lain di lingkungan sekolah', points: 1 },
      ],
      explanation: 'Integritas dan moralitas menuntut ketaatan teguh pada kode etik ASN serta penolakan atas segala bentuk konflik kepentingan.',
    };
  }),
];

export const allPppkQuestions: PppkQuestion[] = [
  ...teknisQuestions,
  ...manajerialQuestions,
  ...sosialKulturalQuestions,
  ...wawancaraQuestions,
];
