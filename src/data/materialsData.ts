import { MaterialSection } from '../types';

export const materialsData: MaterialSection[] = [
  // =================== KELAS X ===================
  {
    id: 'mat-x-1',
    grade: 'X',
    chapterNumber: 1,
    title: 'Menggali Ide Pendiri Bangsa tentang Dasar Negara',
    subtitle: 'Sejarah Perumusan Pancasila dari Sidang BPUPKI hingga Pengesahan PPKI',
    durationMinutes: 45,
    pancasilaPillars: [1, 2, 3, 4, 5],
    learningObjectives: [
      'Menganalisis gagasan para pendiri bangsa (Moh. Yamin, Soepomo, Ir. Soekarno) mengenai dasar negara Indonesia.',
      'Menjelaskan proses dialektika naskah Piagam Jakarta hingga penetapan Pancasila 18 Agustus 1945.',
      'Meneladani nilai komitmen kebangsaan, keikhlasan, dan toleransi para pendiri negara.',
    ],
    summary: 'Pancasila lahir melalui pergulatan pemikiran mendalam para pendiri bangsa dalam sidang BPUPKI (29 Mei - 1 Juni 1945). Ir. Soekarno pada 1 Juni 1945 mencetuskan nama Pancasila sebagai philosophische grondslag (fundamen filosofis bangsa). Melalui Panitia Sembilan, lahirlah Piagam Jakarta (22 Juni 1945) yang kemudian disempurnakan demi persatuan Indonesia Timur pada Sidang PPKI 18 Agustus 1945.',
    contentBlocks: [
      {
        heading: '1. Usulan Tiga Tokoh Utama dalam Sidang BPUPKI',
        text: 'Sidang pertama BPUPKI (Badan Penyelidik Usaha-usaha Persiapan Kemerdekaan Indonesia) berlangsung pada 29 Mei – 1 Juni 1945 dipimpin oleh Dr. K.R.T. Radjiman Wedyodiningrat dengan agenda mencari dasar bagi Indonesia merdeka. Tiga tokoh bangsa mengemukakan gagasannya secara berurutan:',
        keyPoints: [
          'Mr. Mohammad Yamin (29 Mei 1945): Peri Kebangsaan, Peri Kemanusiaan, Peri Ketuhanan, Peri Kerakyatan, dan Kesejahteraan Rakyat.',
          'Prof. Dr. Soepomo (31 Mei 1945): Menekankan teori negara Integralistik (negara persatuan) yang mengatasi semua golongan dan melindungi seluruh rakyat.',
          'Ir. Soekarno (1 Juni 1945): Mengusulkan lima prinsip yang dinamakan "Pancasila": Kebangsaan Indonesia, Internasionalisme (Peri Kemanusiaan), Mufakat/Demokrasi, Kesejahteraan Sosial, dan Ketuhanan yang Berkebudayaan.',
        ],
        infographicLabel: 'Kronologi Kelahiran Dasar Negara 1945',
        infographicIcon: 'Landmark',
      },
      {
        heading: '2. Piagam Jakarta dan Panitia Sembilan',
        text: 'Untuk menjembatani perbedaan pendapat antara golongan kebangsaan dan golongan Islam, dibentuklah Panitia Sembilan yang menghasilkan naskah "Mukaddimah" atau Piagam Jakarta pada 22 Juni 1945. Pada sila pertama tertulis: "Ketuhanan dengan kewajiban menjalankan syariat Islam bagi pemeluk-pemeluknya".',
        keyPoints: [
          'Anggota Panitia Sembilan: Ir. Soekarno, Drs. Moh. Hatta, Mr. A.A. Maramis, Abikoesno Tjokrosoejoso, Abdoel Kahar Moezakir, H. Agus Salim, Mr. Soebardjo, K.H. Wachid Hasjim, dan Mr. Moh. Yamin.',
          'Kompromi luhur ini membuktikan bahwa para pendiri bangsa selalu mengutamakan persatuan daripada kepentingan golongan sempit.',
        ],
      },
      {
        heading: '3. Penetapan Konsensus Nasional 18 Agustus 1945',
        text: 'Pada pagi hari 18 Agustus 1945, sebelum sidang PPKI dimulai, Drs. Mohammad Hatta menerima aspirasi dari perwakilan Indonesia bagian timur melalui opsir Jepang. Demi keutuhan Republik Indonesia yang baru merdeka, para tokoh Islam berbesar hati menyetujui perubahan rumusan sila pertama menjadi: "Ketuhanan Yang Maha Esa". Keputusan ini mencerminkan kearifan tingkat tinggi demi keutuhan NKRI.',
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Sikap Berbesar Hati Demi Persatuan Nasional',
      context: 'Saat perumusan dasar negara, Ki Bagoes Hadikoesoemo dan Kasman Singodimedjo rela mengubah rumusan 7 kata Piagam Jakarta demi saudara-saudara sebangsa dari wilayah timur agar tidak memisahkan diri dari NKRI.',
      question: 'Bagaimana kamu dapat meneladani sikap kompromi dan keikhlasan para pendiri bangsa dalam kehidupan organisasi sekolah (seperti saat musyawarah OSIS atau penentuan kegiatan kelas)?',
      moralGuidance: 'Menempatkan kepentingan bersama di atas ego pribadi adalah cerminan luhur Sila ke-3 (Persatuan Indonesia) dan Sila ke-4 (Musyawarah Mufakat).',
    },
    video: {
      title: 'Video Bedah Sejarah: Detik-detik Perumusan Pancasila 1945',
      duration: '08:24',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=60',
      summary: 'Analisis visual arsip sejarah otentik dan rekaman pidato Bung Karno mengenai dasar filsafat negara.',
      keyPoints: ['Makna philosophische grondslag', 'Dinamika Panitia Sembilan', 'Pelajaran keteladanan Bung Hatta'],
    },
    lkpd: {
      title: 'LKPD Digital: Komparasi Pemikiran Pendiri Bangsa',
      instructions: [
        'Bacalah ringkasan materi di atas dengan seksama.',
        'Jawablah pertanyaan analisis berikut dengan menyertakan argumen yang logis.',
        'Simpan hasil pekerjaanmu atau cetak sebagai laporan portofolio tugas.',
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Bandingkan konsep negara integralistik menurut Soepomo dengan konsep kebangsaan menurut Ir. Soekarno!',
          type: 'essay',
        },
        {
          id: 'q2',
          prompt: 'Tuliskan 3 bukti nyata yang menunjukkan bahwa para pendiri bangsa mengutamakan persatuan daripada kepentingan kelompok!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-x-ch1',
  },
  {
    id: 'mat-x-2',
    grade: 'X',
    chapterNumber: 2,
    title: 'Norma dan Undang-Undang Dasar NRI Tahun 1945',
    subtitle: 'Hierarki Peraturan Perundang-undangan dan Budaya Taat Hukum Remaja',
    durationMinutes: 40,
    pancasilaPillars: [2, 4, 5],
    learningObjectives: [
      'Menjelaskan kedudukan UUD NRI Tahun 1945 sebagai hukum dasar tertulis tertinggi di Indonesia.',
      'Menguraikan tata urutan peraturan perundang-undangan menurut UU No. 12 Tahun 2011.',
      'Membangun kesadaran disiplin dan kepatuhan norma hukum dalam keseharian pelajar.',
    ],
    summary: 'Konstitusi menjamin kepastian hukum dan perlindungan hak asasi manusia. Berdasarkan UU No. 12 Tahun 2011 jo UU No. 13 Tahun 2022, UUD 1945 menempati puncak piramida tata urutan peraturan perundang-undangan di Indonesia.',
    contentBlocks: [
      {
        heading: '1. Hierarki Peraturan Perundang-undangan (UU No. 12/2011)',
        text: 'Tata urutan perundang-undangan di Indonesia menganut asas lex superior derogat legi inferiori (peraturan yang lebih rendah tidak boleh bertentangan dengan peraturan yang lebih tinggi):',
        keyPoints: [
          '1. UUD Negara Republik Indonesia Tahun 1945 (Hukum tertinggi)',
          '2. Ketetapan Majelis Permusyawaratan Rakyat (Tap MPR)',
          '3. Undang-Undang (UU) / Peraturan Pemerintah Pengganti Undang-Undang (Perppu)',
          '4. Peraturan Pemerintah (PP)',
          '5. Peraturan Presiden (Perpres)',
          '6. Peraturan Daerah Provinsi (Perda Prov)',
          '7. Peraturan Daerah Kabupaten/Kota (Perda Kab/Kota)',
        ],
        infographicLabel: 'Piramida Hierarki Hukum Indonesia',
        infographicIcon: 'Scale',
      },
      {
        heading: '2. Empat Jenis Norma dalam Kehidupan Bermasyarakat',
        text: 'Masyarakat diatur oleh empat norma utama yang saling melengkapi:',
        keyPoints: [
          'Norma Agama: Berasal dari wahyu Tuhan Yang Maha Esa (Sanksi: Dosa di akhirat).',
          'Norma Kesusilaan: Berasal dari hati nurani manusia (Sanksi: Penyesalan, rasa bersalah).',
          'Norma Kesopanan: Berasal dari pergaulan dan adat istiadat setempat (Sanksi: Dicemooh, dikucilkan).',
          'Norma Hukum: Dibuat oleh lembaga resmi negara, bersifat tegas, memaksa, dan mengikat (Sanksi: Denda, kurungan, pidana penjara).',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Pelanggaran Lalu Lintas Remaja Tanpa SIM',
      context: 'Banyak pelajar SMA yang mengendarai sepeda motor ke sekolah tanpa memiliki Surat Izin Mengemudi (SIM) dan tidak mengenakan helm pengaman standar SNI dengan alasan jarak rumah dekat.',
      question: 'Analisis tindakan tersebut berdasarkan norma hukum dan norma kesusilaan. Mengapa menaati aturan lalu lintas merupakan wujud nyata kepedulian terhadap keselamatan sesama warga negara?',
      moralGuidance: 'Menaati hukum bukan semata takut pada sanksi polisi, melainkan bentuk tanggung jawab moral menjaga keselamatan diri dan nyawa orang lain (Sila ke-2).',
    },
    video: {
      title: 'Video Animasi: Mengapa Kita Membutuhkan Hukum dan Konstitusi?',
      duration: '06:15',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60',
      summary: 'Penjelasan visual tentang apa jadinya negara tanpa hukum (chaos/anarki) dan pentingnya perlindungan konstitusional.',
      keyPoints: ['Fungsi Konstitusi', 'Asas Legalitas', 'Peran Mahkamah Konstitusi'],
    },
    lkpd: {
      title: 'LKPD Digital: Analisis Tata Urutan Peraturan di Lingkungan Sekolah',
      instructions: [
        'Identifikasi tata tertib sekolah Anda.',
        'Hubungkan pasal dalam tata tertib tersebut dengan norma hukum yang berlaku di Indonesia.',
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Jelaskan akibat hukum jika sebuah Peraturan Daerah (Perda) bertentangan dengan Undang-Undang Republik Indonesia!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-x-ch2',
  },
  {
    id: 'mat-x-3',
    grade: 'X',
    chapterNumber: 3,
    title: 'Bhinneka Tunggal Ika: Merawat Harmoni dalam Keberagaman',
    subtitle: 'Menghargai Keberagaman Suku, Agama, Ras, dan Antargolongan (SARA)',
    durationMinutes: 45,
    pancasilaPillars: [1, 2, 3],
    learningObjectives: [
      'Mengidentifikasi keragaman suku, bahasa daerah, agama, dan budaya di 38 provinsi Indonesia.',
      'Menganalisis dampak negatif prasangka, stereotip, dan diskriminasi dalam pergaulan remaja.',
      'Mempraktikkan budaya gotong royong dan moderasi beragama di lingkungan sekolah.',
    ],
    summary: 'Semboyan Bhinneka Tunggal Ika (terdapat dalam Kitab Sutasoma karya Mpu Tantular) menegaskan bahwa perbedaan identitas bukanlah pemisah, melainkan kekayaan modal sosial bangsa Indonesia untuk maju bersama.',
    contentBlocks: [
      {
        heading: '1. Makna Filosofis Bhinneka Tunggal Ika',
        text: 'Semboyan dicengkeram kokoh oleh kedua cakar burung Garuda Pancasila. Maknanya: "Berbeda-beda tetapi tetap satu jua". Keberagaman Indonesia mencakup lebih dari 1.340 suku bangsa dan 718 bahasa daerah.',
        keyPoints: [
          'Keragaman bukan untuk diseragamkan, melainkan dirayakan dalam bingkai persatuan.',
          'Prinsip inklusivitas: tidak boleh ada warga negara yang dipinggirkan karena identitas primordialnya.',
        ],
      },
      {
        heading: '2. Kearifan Lokal Gotong Royong Nusantara',
        text: 'Semangat Sila ke-3 telah mengakar berabad-abad dalam berbagai kearifan lokal daerah:',
        keyPoints: [
          'Sambatan / Gugur Gunung (Jawa): Membantu tetangga membangun rumah tanpa pamrih upah.',
          'Subak (Bali): Sistem pengelolaan air sawah berbasis kebersamaan dan filosofi Tri Hita Karana.',
          'Mapalus (Minahasa): Tolong menolong dalam menggarap kebun dan upacara adat.',
          'Siadapari (Batak): Gotong royong bertani secara bergiliran.',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Pemilihan Ketua Kelas yang Menjunjung Toleransi',
      context: 'Di kelas X-1 terdapat kandidat ketua kelas yang berasal dari suku minoritas di sekolah tersebut, namun memiliki kepemimpinan dan kecakapan akademik yang sangat baik.',
      question: 'Bagaimana seharusnya sikap peserta didik yang mengamalkan nilai Bhinneka Tunggal Ika dalam menentukan pilihannya?',
      moralGuidance: 'Menilai seseorang berdasarkan integritas, kemampuan, dan budi pekerti—bukan asal suku atau agama—merupakan implementasi nyata nilai keadilan dan kemanusiaan yang beradab.',
    },
    video: {
      title: 'Video Dokumenter: Mozaik Keberagaman Budaya Indonesia',
      duration: '09:50',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60',
      summary: 'Perjalanan melintasi Sabang sampai Merauke menyaksikan harmoni kehidupan masyarakat yang menjunjung tinggi toleransi.',
      keyPoints: ['Toleransi Beragama', 'Bahasa Daerah sebagai Identitas', 'Kearifan Lokal Nusantara'],
    },
    lkpd: {
      title: 'LKPD Digital: Peta Tradisi Gotong Royong Daerah Asal',
      instructions: ['Tuliskan tradisi gotong royong yang ada di daerahmu dan bagaimana nilai tersebut relevan bagi generasi Z!'],
      questions: [
        {
          id: 'q1',
          prompt: 'Jelaskan contoh nyata tradisi gotong royong di daerah tempat tinggalmu dan nilai luhur apa yang terkandung di dalamnya!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-x-ch3',
  },

  // =================== KELAS XI ===================
  {
    id: 'mat-xi-1',
    grade: 'XI',
    chapterNumber: 1,
    title: 'Kedudukan Pancasila sebagai Meja Statis dan Leitstar Dinamis',
    subtitle: 'Pancasila dalam Menghadapi Arus Globalisasi dan Ideologi Transnasional',
    durationMinutes: 50,
    pancasilaPillars: [1, 2, 3, 4, 5],
    learningObjectives: [
      'Menganalisis konsep Pancasila sebagai meja statis (landasan kokoh pemersatu) dan leitstar dinamis (bintang pemandu masa depan).',
      'Mengkritisi perbedaan ideologi terbuka (Pancasila) dengan ideologi tertutup (komunisme/fasisme/liberalisme murni).',
      'Menyusun solusi pemecahan masalah intoleransi dan radikalisme di kalangan generasi muda.',
    ],
    summary: 'Bung Karno menyebut Pancasila sebagai meja statis yang mampu menyatukan seluruh elemen bangsa yang heterogen, sekaligus leitstar dinamis yang membimbing arah pembangunan Indonesia menghadapi kemajuan zaman tanpa kehilangan jati diri bangsa.',
    contentBlocks: [
      {
        heading: '1. Meja Statis dan Bintang Pemandu (Leitstar Dinamis)',
        text: 'Sebagai meja statis, lima sila Pancasila adalah titik temu (common denominator) yang tidak boleh diubah siapa pun. Sebagai bintang pemandu (leitstar dinamis), Pancasila senantiasa adaptif terhadap perkembangan sains, teknologi informasi, dan perubahan global tanpa tergelincir pada nilai-nilai individualisme atau ateisme.',
      },
      {
        heading: '2. Dimensi Pancasila sebagai Ideologi Terbuka',
        text: 'Pancasila memiliki tiga dimensi fundamental:',
        keyPoints: [
          'Dimensi Realitas: Nilai-nilai dasar bersumber dari kehidupan nyata masyarakat Indonesia.',
          'Dimensi Idealisme: Mengandung cita-cita luhur kemakmuran dan keadilan yang ingin diwujudkan.',
          'Dimensi Fleksibilitas: Mampu menerima perkembangan zaman melalui interpretasi baru yang relevan tanpa mengubah nilai dasarnya.',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Pengaruh Budaya Asing dan Tren Medsos pada Remaja',
      context: 'Gaya hidup konsumerisme hedonis dan individualistis yang dipopulerkan media sosial kerap bertentangan dengan semangat gotong royong dan kesederhanaan Pancasila.',
      question: 'Bagaimana Pancasila sebagai leitstar dinamis memandu generasi Z agar tetap melek teknologi global namun tidak tercerabut dari akar budaya bangsanya?',
      moralGuidance: 'Menyaring budaya asing dengan kacamata Pancasila: ambil kemajuan teknologi dan etos kerjanya, tolak nilai-nilai yang merusak moral dan kesopanan.',
    },
    video: {
      title: 'Video Kuliah Singkat: Membedah Pancasila sebagai Ideologi Terbuka',
      duration: '07:45',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
      summary: 'Eksplorasi mendalam perbandingan ideologi dunia (Liberalisme, Sosialisme, Pancasila).',
      keyPoints: ['Keseimbangan Hak Individu & Sosial', 'Nilai Ketuhanan dalam Ideologi', 'Ketahanan Budaya'],
    },
    lkpd: {
      title: 'LKPD Digital: Matriks Perbandingan Ideologi Dunia',
      instructions: ['Lengkapi tabel komparasi ciri-ciri ideologi Pancasila vs Liberalisme vs Sosialisme.'],
      questions: [
        {
          id: 'q1',
          prompt: 'Jelaskan mengapa paham liberalisme ekstrem yang mementingkan kebebasan mutlak individu tidak cocok diterapkan di Indonesia!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-xi-ch1',
  },
  {
    id: 'mat-xi-2',
    grade: 'XI',
    chapterNumber: 2,
    title: 'Demokrasi Pancasila dan Budaya Musyawarah',
    subtitle: 'Prinsip Kedaulatan Rakyat, Pemilu Bersih, dan Pengambilan Keputusan Mufakat',
    durationMinutes: 45,
    pancasilaPillars: [4],
    learningObjectives: [
      'Menelaah periodisasi perkembangan demokrasi di Indonesia (Demokrasi Parlementer, Terpimpin, Pancasila Orba, hingga Era Reformasi).',
      'Mempraktikkan tata cara musyawarah mufakat yang beradab sesuai Sila ke-4.',
      'Memahami asas Pemilihan Umum: LUBER JURDIL (Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil).',
    ],
    summary: 'Demokrasi di Indonesia bukanlah demokrasi mayoritas tirani ataupun voting tanpa kompromi, melainkan Demokrasi Pancasila yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan dengan dijiwai ketuhanan dan kemanusiaan.',
    contentBlocks: [
      {
        heading: '1. Soko Guru Demokrasi Pancasila',
        text: 'Ciri utama demokrasi kita bertumpu pada musyawarah untuk mencapai mufakat. Pemungutan suara (voting) hanya dilakukan sebagai jalan terakhir apabila musyawarah telah diupayakan secara maksimal namun belum mencapai kesepakatan.',
        keyPoints: [
          'Mengakui hak bersuara setiap warga negara secara setara.',
          'Menghormati pendapat minoritas dan mengedepankan kepentingan rakyat banyak.',
          'Keputusan musyawarah harus dapat dipertanggungjawabkan secara moral kepada Tuhan YME.',
        ],
      },
      {
        heading: '2. Pemilu dan Partisipasi Politik Pemilih Pemula',
        text: 'Siswa kelas XI dan XII umumnya telah atau segera memasuki usia 17 tahun dan menjadi pemilih pemula. Penting untuk:',
        keyPoints: [
          'Menolak politik uang (money politics) dan politik identitas yang memecah belah.',
          'Mempelajari rekam jejak, integritas, dan program kerja para calon pemimpin.',
          'Menggunakan hak pilih dengan bertanggung jawab tanpa golput.',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Pemilihan Ketua OSIS yang Diwarnai Isu Hoaks di Medsos',
      context: 'Dalam pemilihan ketua OSIS, salah satu tim sukses menyebarkan tangkapan layar percakapan palsu untuk menjatuhkan kredibilitas kandidat lain.',
      question: 'Tindakan apa yang harus diambil oleh panitia pemilihan sekolah (MPK/KPU Sekolah) dan siswa pemilih sesuai prinsip demokrasi bermartabat?',
      moralGuidance: 'Demokrasi sejati dibangun di atas kejujuran dan integritas, bukan kecurangan dan fitnah (Asas Jujur dan Adil).',
    },
    video: {
      title: 'Video Simulasi: Praktik Baik Musyawarah Mufakat di Sekolah',
      duration: '06:30',
      thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=60',
      summary: 'Bagaimana memimpin sidang musyawarah OSIS yang demokratis, tertib, dan menghasilkan solusi win-win solution.',
      keyPoints: ['Tata Tertib Persidangan', 'Etika Interupsi', 'Teknik Menemukan Titik Temu'],
    },
    lkpd: {
      title: 'LKPD Digital: Simulasi Rancangan Pemilu OSIS Berintegritas',
      instructions: ['Susun pakta integritas pemilihan pengurus organisasi di sekolahmu!'],
      questions: [
        {
          id: 'q1',
          prompt: 'Sebutkan 3 bahaya politik uang dan kampanye hitam bagi masa depan demokrasi di lingkungan pelajar!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-xi-ch2',
  },

  // =================== KELAS XII ===================
  {
    id: 'mat-xii-1',
    grade: 'XII',
    chapterNumber: 1,
    title: 'Praktik Penyelenggaraan Negara yang Bersih dan Berintegritas',
    subtitle: 'Tata Kelola Pemerintahan yang Baik (Good Governance) dan Pemberantasan Korupsi',
    durationMinutes: 50,
    pancasilaPillars: [2, 4, 5],
    learningObjectives: [
      'Menjelaskan prinsip-prinsip tata kelola pemerintahan yang baik (transparansi, akuntabilitas, partisipasi publik, supremasi hukum).',
      'Menganalisis dampak korupsi, kolusi, dan nepotisme (KKN) terhadap kesejahteraan rakyat Indonesia.',
      'Menumbuhkan nilai-nilai integritas antikorupsi dalam kehidupan sehari-hari (jujur, disiplin, tanggung jawab).',
    ],
    summary: 'Penyelenggaraan negara yang amanah merupakan amanat pembukaan UUD 1945 untuk memajukan kesejahteraan umum dan mencerdaskan kehidupan bangsa. Integritas antikorupsi harus dimulai dari budaya kejujuran akademik di sekolah.',
    contentBlocks: [
      {
        heading: '1. Asas Umum Penyelenggaraan Negara (UU No. 28/1999)',
        text: 'Penyelenggara negara wajib berpegang pada asas kepastian hukum, tertib penyelenggara negara, kepentingan umum, keterbukaan, proporsionalitas, profesionalitas, dan akuntabilitas.',
      },
      {
        heading: '2. 9 Nilai Integritas Antikorupsi (KPK)',
        text: 'Untuk membentuk karakter antikorupsi, pelajar harus membiasakan "Jumat Bersepeda KK" (Jujur, Mandiri, Tanggung Jawab, Berani, Sederhana, Peduli, Disiplin, Adil, Kerja Keras):',
        keyPoints: [
          'Jujur: Tidak menyontek, tidak plagiasi, melaporkan data sesuai fakta.',
          'Tanggung Jawab: Menyelesaikan tugas tepat waktu dan menanggung konsekuensi amanah.',
          'Adil: Tidak membedakan perlakuan kepada teman atas dasar kepentingan pribadi.',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Praktik Mencontek Massal saat Ujian Sekolah',
      context: 'Sekelompok siswa membuat grup perpesanan rahasia untuk membagikan kunci jawaban ujian akhir demi mendapatkan nilai tinggi tanpa belajar.',
      question: 'Bagaimana kaitan antara budaya mencontek di sekolah dengan potensi timbulnya bibit perilaku korupsi di masa depan ketika mereka menjadi pejabat publik?',
      moralGuidance: 'Korupsi berakar dari ketidakjujuran kecil yang dibiasakan. Menjaga integritas nilai akademik adalah latihan menjadi pemimpin berintegritas.',
    },
    video: {
      title: 'Video Edukasi KPK: Tunas Integritas untuk Generasi Emas 2045',
      duration: '08:10',
      thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60',
      summary: 'Pentingnya peran generasi muda dalam memutus mata rantai korupsi dan mewujudkan Indonesia yang adil makmur.',
      keyPoints: ['Definisi Gratifikasi & Suap', 'Whistleblowing System', 'Kemandirian Pemuda'],
    },
    lkpd: {
      title: 'LKPD Digital: Audit Mandiri Integritas Pelajar',
      instructions: ['Lakukan evaluasi diri terhadap 9 nilai integritas dalam aktivitas belajarmu selama satu semester terakhir.'],
      questions: [
        {
          id: 'q1',
          prompt: 'Menurut pendapatmu, apa sanksi moral dan sosial yang paling efektif bagi pelaku kecurangan akademik di lingkungan sekolah?',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-xii-ch1',
  },
  {
    id: 'mat-xii-2',
    grade: 'XII',
    chapterNumber: 2,
    title: 'Tantangan Ideologi Pancasila di Era Revolusi Industri & Digital',
    subtitle: 'Literasi Digital, Ketahanan Nasional, dan Menangkal Disinformasi/Hoaks',
    durationMinutes: 45,
    pancasilaPillars: [1, 2, 3, 4, 5],
    learningObjectives: [
      'Mengidentifikasi peluang dan ancaman kemajuan teknologi informasi terhadap ideologi Pancasila.',
      'Mengembangkan etika bermedia sosial yang santun, kritis, dan berlandaskan persatuan bangsa.',
      'Berperan aktif sebagai agen penyebar konten positif dan pembela kebenaran di ruang digital.',
    ],
    summary: 'Ruang digital telah menjadi medan pertarungan ideologi baru. Melalui literasi digital berbasis Pancasila, pemuda Indonesia dapat mengoptimalkan teknologi untuk inovasi kemakmuran tanpa terpecah belah oleh algoritma polarisasi.',
    contentBlocks: [
      {
        heading: '1. Netiket (Etika Berinternet) Pancasilais',
        text: 'Warga negara digital (netizen) Indonesia harus menjunjung tinggi adab kesantunan:',
        keyPoints: [
          'Saring sebelum Sharing: Cek keabsahan fakta dan sumber rujukan sebelum membagikan informasi.',
          'Hindari Cyberbullying, Doxing, dan Ujaran Kebencian (Hate Speech).',
          'Gunakan hak kebebasan berpendapat dengan penuh tanggung jawab hukum (UU ITE).',
        ],
      },
    ],
    caseStudy: {
      title: 'Studi Kasus: Penyebaran Hoaks Isu Sara yang Nyaris Memicu Tawuran',
      context: 'Sebuah video di media sosial diedit dengan narasi provokatif yang menjelek-jelekkan sekolah tetangga dengan membawa unsur suku dan agama.',
      question: 'Sebagai pelajar yang cerdas dan mengamalkan Sila ke-3, langkah konkret apa yang harus segera kamu ambil saat mendapati video provokasi tersebut?',
      moralGuidance: 'Tabayyun (klarifikasi fakta) dan tidak ikut memperluas sebaran konten hoaks adalah wujud bela negara di era siber.',
    },
    video: {
      title: 'Video Edukasi: Cerdas Bermedia Sosial dengan Nilai Pancasila',
      duration: '07:15',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
      summary: 'Tips praktis mendeteksi hoaks, memahami clickbait, dan membangun ekosistem digital yang sehat.',
      keyPoints: ['Ciri Berita Bohong', 'Etika Kolom Komentar', 'Digital Footprint'],
    },
    lkpd: {
      title: 'LKPD Digital: Kampanye Konten Positif Nilai Pancasila',
      instructions: ['Rancanglah sebuah konsep konten edukatif (infografis/video pendek) bertema pengamalan Pancasila di media sosial.'],
      questions: [
        {
          id: 'q1',
          prompt: 'Tuliskan pesan utama dan target audiens dari rancangan konten kampanye digital yang kamu buat!',
          type: 'essay',
        },
      ],
    },
    relatedQuizId: 'quiz-xii-ch2',
  },
];
