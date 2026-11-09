export interface PresidentItem {
  id: string;
  orderNumber: number; // 1 to 8
  name: string;
  fullNameWithTitle: string;
  popularTitle: string; // e.g. "Bapak Proklamator", "Bapak Teknologi"
  period: string; // e.g. "18 Agustus 1945 – 12 Maret 1967"
  yearsInOffice: string; // e.g. "1945 – 1967 (22 Tahun)"
  era: 'Orde Lama' | 'Orde Baru' | 'Transisi Reformasi' | 'Demokrasi Elektoral' | 'Indonesia Maju';
  vicePresidents: string[];
  birthPlaceDate: string;
  deathPlaceDate?: string;
  portraitUrl: string;
  cabinetNames: string[];
  majorAchievements: string[];
  pancasilaCoreValues: {
    silaNumber: number;
    description: string;
  }[];
  famousQuotes: string[];
  historicalMilestones: {
    year: string;
    event: string;
    significance: string;
  }[];
  reflectionForStudents: string;
  interestingFact: string;
}

export interface NationalHeroItem {
  id: string;
  name: string;
  roleTitle: string;
  category: 'Perumus Pancasila' | 'Proklamator & Pemimpin' | 'Pahlawan Pendidikan' | 'Emansipasi & HAM' | 'Perjuangan Militer' | 'Tokoh Ulama & Agama';
  birthDeath: string;
  originProvince: string;
  portraitUrl: string;
  contributionToPancasila: string;
  pancasilaPillars: number[];
  keyActions: string[];
  famousQuote: string;
  smandeMessage: string;
}

export const presidentsData: PresidentItem[] = [
  {
    id: 'soekarno',
    orderNumber: 1,
    name: 'Ir. Soekarno',
    fullNameWithTitle: 'Dr. (H.C.) Ir. H. Soekarno (Bung Karno)',
    popularTitle: 'Bapak Proklamator & Penggali Pancasila',
    period: '18 Agustus 1945 – 12 Maret 1967',
    yearsInOffice: '1945 – 1967 (22 Tahun)',
    era: 'Orde Lama',
    vicePresidents: ['Drs. Mohammad Hatta (1945 – 1956)'],
    birthPlaceDate: 'Surabaya, Jawa Timur, 6 Juni 1901',
    deathPlaceDate: 'Jakarta, 21 Juni 1970 (Dimakamkan di Blitar, Jawa Timur)',
    portraitUrl: '/assets/presidents/soekarno.jpg',
    cabinetNames: ['Kabinet Presidensial', 'Kabinet Sjahrir', 'Kabinet Djuanda (Karya)', 'Kabinet Dwikora'],
    majorAchievements: [
      'Menyampaikan pidato monumental "Lahirnya Pancasila" pada 1 Juni 1945 di sidang BPUPK.',
      'Memproklamasikan Kemerdekaan Republik Indonesia bersama Mohammad Hatta pada 17 Agustus 1945.',
      'Memimpin dan menggagas Konferensi Asia Afrika (KAA) di Bandung 1955 yang melahirkan Dasa Sila Bandung.',
      'Mempelopori berdirinya Gerakan Non-Blok (GNB) bersama pemimpin dunia (Tito, Nasser, Nehru, Nkrumah).',
      'Mengeluarkan Dekrit Presiden 5 Juli 1959 yang mengembalikan UUD 1945 sebagai konstitusi negara.',
      'Membangun mahakarya simbolik kebangsaan: Monumen Nasional (Monas), Masjid Istiqlal, Gelora Bung Karno, dan Gedung Sarinah.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 1,
        description: 'Menegaskan bahwa bangsa Indonesia adalah bangsa yang bertuhan dan saling menghormati antarpemeluk keyakinan (Ketuhanan yang berkebudayaan).'
      },
      {
        silaNumber: 2,
        description: 'Mendirikan Gerakan Non-Blok dan KAA sebagai wujud nyata persaudaraan internasional dan anti-penjajahan dunia.'
      },
      {
        silaNumber: 3,
        description: 'Mengobarkan semangat persatuan nasional dari Sabang sampai Merauke di atas keberagaman suku dan agama.'
      }
    ],
    famousQuotes: [
      'Beri aku 1.000 orang tua, niscaya akan kucabut Semeru dari akarnya. Beri aku 10 pemuda, niscaya akan kuguncangkan dunia!',
      'Gantungkan cita-citamu setinggi langit! Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.',
      'Jasmerah: Jangan sekali-kali meninggalkan sejarah!'
    ],
    historicalMilestones: [
      { year: '1945', event: 'Pidato Lahirnya Pancasila & Proklamasi Kemerdekaan', significance: 'Peletakan dasar filosofis negara Indonesia merdeka' },
      { year: '1955', event: 'Konferensi Asia Afrika (KAA) Bandung', significance: 'Mempercepat gelombang dekolonisasi di puluhan negara Asia dan Afrika' },
      { year: '1959', event: 'Dekrit Presiden 5 Juli 1959', significance: 'Menyelamatkan keutuhan negara dari kebuntuan Konstituante dan kembali ke UUD 1945' },
      { year: '1962', event: 'Asian Games IV & Pembangunan GBK', significance: 'Menempatkan martabat Indonesia di mata dunia internasional' }
    ],
    reflectionForStudents: 'Bung Karno mengajarkan generasi muda SMANDE untuk memiliki visi besar (Trisakti: berdaulat dalam politik, berdikari dalam ekonomi, dan berkepribadian dalam kebudayaan) serta tidak mudah minder menghadapi persaingan dunia.',
    interestingFact: 'Bung Karno menempuh studi teknik sipil di Technische Hoogeschool te Bandoeng (kini ITB) dan merancang sendiri arsitektur sejumlah bangunan bersejarah di Bandung dan Jakarta.'
  },
  {
    id: 'soeharto',
    orderNumber: 2,
    name: 'Soeharto',
    fullNameWithTitle: 'Jenderal Besar TNI (Purn.) H. M. Soeharto',
    popularTitle: 'Bapak Pembangunan Nasional',
    period: '27 Maret 1968 – 21 Mei 1998',
    yearsInOffice: '1968 – 1998 (30 Tahun)',
    era: 'Orde Baru',
    vicePresidents: [
      'Sri Sultan Hamengkubuwana IX (1973–1978)',
      'Adam Malik (1978–1983)',
      'Umar Wirahadikusumah (1983–1988)',
      'Sudharmono, S.H. (1988–1993)',
      'Try Sutrisno (1993–1998)',
      'Prof. Dr. Ing. B.J. Habibie (1998)'
    ],
    birthPlaceDate: 'Kemusuk, Argomulyo, Bantul, DI Yogyakarta, 8 Juni 1921',
    deathPlaceDate: 'Jakarta, 27 Januari 2008 (Dimakamkan di Astana Giribangun, Karanganyar, Jawa Tengah)',
    portraitUrl: '/assets/presidents/soeharto.jpg',
    cabinetNames: ['Kabinet Pembangunan I s.d. Kabinet Pembangunan VII'],
    majorAchievements: [
      'Melaksanakan Rencana Pembangunan Lima Tahun (Repelita) secara terstruktur dan terukur.',
      'Meraih penghargaan internasional FAO PBB pada 1984 atas keberhasilan mencapai Swasembada Beras.',
      'Membangun ribuan Sekolah Dasar Inpres (SD Inpres) dan mencanangkan Wajib Belajar 6 Tahun (meraih Avicenna Award UNESCO).',
      'Mengembangkan Pusat Kesehatan Masyarakat (Puskesmas) dan Posyandu hingga ke pelosok desa.',
      'Pelopor pembentukan Perhimpunan Bangsa-Bangsa Asia Tenggara (ASEAN) pada 8 Agustus 1967.',
      'Menjaga stabilitas ketahanan pangan dan harga kebutuhan pokok masyarakat pedesaan melalui Bulog.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 5,
        description: 'Memprioritaskan pemerataan pembangunan pedesaan lewat program Inpres desa, transmigrasi, dan modernisasi pertanian.'
      },
      {
        silaNumber: 3,
        description: 'Menjaga integrasi teritorial dan kestabilan kawasan Asia Tenggara melalui diplomasi regional ASEAN.'
      }
    ],
    famousQuotes: [
      'Kebaikan manusia itu diukur dari perbuatan dan pengorbanannya bagi kemakmuran rakyat dan negara.',
      'Mikul dhuwur mendhem jero: Menghargai dan menjunjung tinggi kehormatan orang tua serta bangsa.'
    ],
    historicalMilestones: [
      { year: '1967', event: 'Deklarasi Bangkok & Pendirian ASEAN', significance: 'Mewujudkan stabilitas dan kerja sama damai kawasan Asia Tenggara' },
      { year: '1974', event: 'Pencanangan Program SD Inpres & Wajar', significance: 'Pemberantasan buta huruf secara massal bagi seluruh anak bangsa' },
      { year: '1984', event: 'Penghargaan FAO Roma untuk Swasembada Beras', significance: 'Indonesia bertransformasi dari pengimpor beras terbesar menjadi mandiri pangan' }
    ],
    reflectionForStudents: 'Ketekunan dalam perencanaan pembangunan berjangka (Repelita) mengajarkan kita pentingnya manajemen waktu, target belajar yang bertahap, dan kepedulian pada ketahanan pangan masyarakat luas.',
    interestingFact: 'Program SD Inpres yang diinisiasi Presiden Soeharto dipuji ekonom dunia Esther Duflo (pemenang Nobel Ekonomi 2019) sebagai salah satu program investasi pendidikan paling sukses dalam sejarah dunia modern.'
  },
  {
    id: 'habibie',
    orderNumber: 3,
    name: 'B.J. Habibie',
    fullNameWithTitle: 'Prof. Dr. Ing. Ir. H. Bacharuddin Jusuf Habibie, FREng.',
    popularTitle: 'Bapak Teknologi & Pelopor Reformasi',
    period: '21 Mei 1998 – 20 Oktober 1999',
    yearsInOffice: '1998 – 1999 (1 Tahun 5 Bulan)',
    era: 'Transisi Reformasi',
    vicePresidents: ['(Lowong selama masa kepresidenan)'],
    birthPlaceDate: 'Parepare, Sulawesi Selatan, 25 Juni 1936',
    deathPlaceDate: 'Jakarta, 11 September 2019 (Dimakamkan di TMP Kalibata, Jakarta)',
    portraitUrl: '/assets/presidents/habibie.jpg',
    cabinetNames: ['Kabinet Reformasi Pembangunan'],
    majorAchievements: [
      'Menstabilkan krisis moneter dahsyat 1998, berhasil menguatkan kurs Rupiah dari Rp 16.000 ke kisaran Rp 6.500 per Dolar AS.',
      'Meletakkan pondasi kebebasan pers Indonesia melalui penerbitan UU No. 40 Tahun 1999 tentang Pers.',
      'Mengesahkan UU Otonomi Daerah (UU No. 22 Tahun 1999) yang mengakhiri sentralisme kekuasaan.',
      'Menyelenggarakan Pemilu multi-partai pertama era reformasi (Pemilu 1999) secara demokratis, aman, dan damai.',
      'Merancang dan menerbangkan pesawat komersial pertama karya anak bangsa: N-250 Gatotkaca (1995).',
      'Menemukan teori aerodinamika internasional "Crack Progression Theory" yang dijuluki dunia sebagai "Faktor Habibie".'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 4,
        description: 'Membuka kran kebebasan berpendapat, pers bebas, dan pemilu demokratis berasaskan kedaulatan rakyat.'
      },
      {
        silaNumber: 2,
        description: 'Menjunjung tinggi hak asasi manusia melalui ratifikasi konvensi internasional anti-penyiksaan.'
      }
    ],
    famousQuotes: [
      'Di mana pun engkau berada, selalu jadilah yang terbaik dan berikan yang terbaik dari yang bisa kau berikan.',
      'Jadilah mata air yang jernih, yang memberikan kehidupan kepada sekelilingmu.',
      'Hanya anak bangsa sendirilah yang dapat diandalkan untuk membangun Indonesia, tidak mungkin kita mengharapkan bangsa lain!'
    ],
    historicalMilestones: [
      { year: '1995', event: 'Penerbangan Perdana Pesawat N-250 Gatotkaca', significance: 'Tonggak kebangkitan teknologi kedirgantaraan nasional di mata dunia' },
      { year: '1998', event: 'Pengesahan UU Kebebasan Mengemukakan Pendapat', significance: 'Membuka ruang demokrasi transparan setelah puluhan tahun terkekang' },
      { year: '1999', event: 'Pemilu Demokratis 1999 & Pemisahan Bank Indonesia', significance: 'Membangun independensi moneter dan demokrasi elektoral modern' }
    ],
    reflectionForStudents: 'Habibie adalah suri teladan sempurna perpaduan IMTAK (Iman dan Takwa) dan IPTEK (Ilmu Pengetahuan dan Teknologi). Beliau membuktikan anak daerah mampu berdiri setara dengan ilmuwan terbaik dunia.',
    interestingFact: 'Habibie meraih gelar Doktor Ingenieur dari RWTH Aachen Jerman dengan predikat Summa Cum Laude (nilai rata-rata 10 murni) saat usianya baru 28 tahun.'
  },
  {
    id: 'gusdur',
    orderNumber: 4,
    name: 'Abdurrahman Wahid (Gus Dur)',
    fullNameWithTitle: 'Dr. (H.C.) K.H. Abdurrahman Wahid',
    popularTitle: 'Bapak Pluralisme & Toleransi Bangsa',
    period: '20 Oktober 1999 – 23 Juli 2001',
    yearsInOffice: '1999 – 2001 (1 Tahun 9 Bulan)',
    era: 'Transisi Reformasi',
    vicePresidents: ['Megawati Soekarnoputri (1999–2001)'],
    birthPlaceDate: 'Jombang, Jawa Timur, 7 September 1940',
    deathPlaceDate: 'Jakarta, 30 Desember 2009 (Dimakamkan di Tebuireng, Jombang, Jawa Timur)',
    portraitUrl: '/assets/presidents/gusdur.jpg',
    cabinetNames: ['Kabinet Persatuan Nasional'],
    majorAchievements: [
      'Mencabut Inpres No. 14/1967 dan menetapkan Tahun Baru Imlek sebagai hari libur nasional, memulihkan hak budaya etnis Tionghoa.',
      'Mengakui agama Khonghucu secara resmi setara dengan agama lainnya di Indonesia.',
      'Menerapkan pendekatan dialog humanis dan damai untuk Papua (mengubah nama Irian Jaya menjadi Papua serta membolehkan Bintang Kejora sebagai lambang kultural).',
      'Memisahkan secara resmi Kepolisian Republik Indonesia (POLRI) dari Tentara Nasional Indonesia (TNI).',
      'Membubarkan Departemen Penerangan untuk menjamin pers independen dan Departemen Sosial guna mendorong kemandirian masyarakat.',
      'Memperjuangkan kesetaraan minoritas tanpa pandang bulu berlandaskan nilai universal Islam dan Pancasila.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 1,
        description: 'Mewujudkan Ketuhanan yang ramah, menghargai kemajemukan keyakinan, dan menolak diskriminasi bernuansa SARA.'
      },
      {
        silaNumber: 3,
        description: 'Memperkokoh semboyan Bhinneka Tunggal Ika dengan merawat persaudaraan lintas iman, etnis, dan suku nusantara.'
      }
    ],
    famousQuotes: [
      'Tidak penting apa agamamu atau sukumu. Kalau kamu bisa melakukan sesuatu yang baik untuk semua orang, orang tidak pernah tanya apa agamamu.',
      'Gitu aja kok repot! (Menyelesaikan persoalan rumit dengan hati dingin, lapang dada, dan humor bijak).',
      'Kemajemukan adalah anugerah Tuhan yang harus kita syukuri dan rawat bersama.'
    ],
    historicalMilestones: [
      { year: '2000', event: 'Pencabutan Larangan Budaya Tionghoa & Imlek', significance: 'Rehabilitasi hak-hak sipil kaum minoritas sesuai amanat kemanusiaan' },
      { year: '2000', event: 'Pengembalian Nama Papua dari Irian Jaya', significance: 'Penghormatan martabat dan identitas kultural masyarakat adat Papua' },
      { year: '2000', event: 'Dekrit Pemisahan TNI dan Polri', significance: 'Penguatan profesionalisme pertahanan dan penegakan hukum sipil' }
    ],
    reflectionForStudents: 'Gus Dur mengajarkan para siswa SMAN 1 Mande untuk menjadi insan yang toleran, tidak mudah membenci perbedaan, serta berani membela kaum yang tertindas demi tegaknya keadilan sosial.',
    interestingFact: 'Gus Dur adalah cucu dari Hadratussyaikh K.H. Hasyim Asy\'ari (pendiri Nahdlatul Ulama) sekaligus cucu K.H. Bisri Syansuri, dan sangat gemar membaca buku filsafat dunia serta menyukai musik klasik Beethoven.'
  },
  {
    id: 'megawati',
    orderNumber: 5,
    name: 'Megawati Soekarnoputri',
    fullNameWithTitle: 'Prof. Dr. (H.C.) Hj. Diah Permata Megawati Setiawati Soekarnoputri',
    popularTitle: 'Presiden Wanita Pertama RI & Penegak Institusi Konstitusi',
    period: '23 Juli 2001 – 20 Oktober 2004',
    yearsInOffice: '2001 – 2004 (3 Tahun 3 Bulan)',
    era: 'Transisi Reformasi',
    vicePresidents: ['Dr. H. Hamzah Haz (2001–2004)'],
    birthPlaceDate: 'Yogyakarta, 23 Januari 1947',
    deathPlaceDate: undefined,
    portraitUrl: '/assets/presidents/megawati.jpg',
    cabinetNames: ['Kabinet Gotong Royong'],
    majorAchievements: [
      'Mendirikan Komisi Pemberantasan Korupsi (KPK) melalui pengesahan UU No. 30 Tahun 2002.',
      'Mendirikan Mahkamah Konstitusi (MK) sebagai penjaga konstitusi dan penguji undang-undang.',
      'Menyelenggarakan Pemilihan Presiden dan Wakil Presiden secara langsung pertama kali dalam sejarah Indonesia (Pemilu 2004) secara jujur dan damai.',
      'Mengesahkan UU No. 40 Tahun 2004 tentang Sistem Jaminan Sosial Nasional (SJSN) yang menjadi cikal bakal BPJS Kesehatan dan Ketenagakerjaan.',
      'Memutus program kerja sama peminjaman dengan IMF untuk mengembalikan kemandirian ekonomi nasional.',
      'Menuntaskan rangkaian 4 kali amandemen UUD 1945 secara konstitusional dan tertib.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 4,
        description: 'Memelopori transisi kepemimpinan nasional secara langsung melalui pemilu rakyat yang berkeadaban.'
      },
      {
        silaNumber: 5,
        description: 'Membangun instrumen hukum anti-korupsi (KPK) dan jaminan sosial menyeluruh bagi seluruh rakyat Indonesia.'
      }
    ],
    famousQuotes: [
      'Sebagai bangsa yang besar, kita tidak boleh menjadi bangsa pengemis. Kita harus mandiri dan berdiri tegak di atas kaki sendiri.',
      'Demokrasi sejati adalah demokrasi yang mengedepankan hukum dan memuliakan harkat martabat rakyat kecil.'
    ],
    historicalMilestones: [
      { year: '2002', event: 'Pengesahan UU KPK No. 30 Tahun 2002', significance: 'Lahirnya lembaga independen penegakan hukum dan pemberantasan korupsi' },
      { year: '2003', event: 'Pembentukan Mahkamah Konstitusi Republik Indonesia', significance: 'Kelahiran institusi pengawal konstitusi dan penegak hak konstitusional warga' },
      { year: '2004', event: 'Penyelenggaraan Pilpres Langsung Pertama 2004', significance: 'Kemenangan besar demokrasi Indonesia yang diakui dunia internasional' }
    ],
    reflectionForStudents: 'Ibu Megawati membuktikan bahwa perempuan Indonesia memiliki kapasitas memimpin bangsa di masa krisis dengan keteguhan hati, kepatuhan pada konstitusi, dan semangat gotong royong.',
    interestingFact: 'Megawati Soekarnoputri adalah putri sulung Bung Karno yang lahir di Yogyakarta ketika ibu kota RI sedang dipindahkan ke sana akibat agresi militer Belanda.'
  },
  {
    id: 'sby',
    orderNumber: 6,
    name: 'Susilo Bambang Yudhoyono (SBY)',
    fullNameWithTitle: 'Jenderal TNI (Purn.) Prof. Dr. H. Susilo Bambang Yudhoyono, M.A., GCB, AC',
    popularTitle: 'Bapak Demokrasi & Perdamaian',
    period: '20 Oktober 2004 – 20 Oktober 2014',
    yearsInOffice: '2004 – 2014 (10 Tahun, 2 Periode)',
    era: 'Demokrasi Elektoral',
    vicePresidents: [
      'Drs. H. Muhammad Jusuf Kalla (2004–2009)',
      'Prof. Dr. Boediono, M.Ec. (2009–2014)'
    ],
    birthPlaceDate: 'Tremas, Arjosari, Pacitan, Jawa Timur, 9 September 1949',
    deathPlaceDate: undefined,
    portraitUrl: '/assets/presidents/sby.jpg',
    cabinetNames: ['Kabinet Indonesia Bersatu I (2004–2009)', 'Kabinet Indonesia Bersatu II (2009–2014)'],
    majorAchievements: [
      'Presiden RI pertama yang dipilih langsung oleh rakyat dan berhasil memimpin selama 2 periode penuh secara demokratis.',
      'Mencapai kesepakatan damai bersejarah Helsinki (MoU Helsinki 2005) yang mengakhiri 30 tahun konflik bersenjata di Aceh.',
      'Memimpin tanggap darurat dan rekonstruksi pasca-tsunami Aceh 2004 secara transparan dan dipuji komunitas global.',
      'Melunasi seluruh sisa utang Indonesia kepada IMF sebesar US$ 7,8 miliar pada tahun 2006 (4 tahun lebih cepat dari jadwal).',
      'Mengalokasikan secara konsisten anggaran pendidikan minimal 20% dari APBN sesuai amanat UUD 1945.',
      'Menjadikan Indonesia anggota resmi G20 (kelompok 20 ekonomi terbesar dunia) dengan pertumbuhan ekonomi rata-rata di atas 5-6%.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 3,
        description: 'Mewujudkan rekonsiliasi perdamaian Aceh dan menjaga keutuhan NKRI melalui diplomasi dialogis.'
      },
      {
        silaNumber: 4,
        description: 'Mengkonsolidasikan budaya demokrasi elektoral yang matang, damai, dan menghormati supremasi hukum sipil.'
      }
    ],
    famousQuotes: [
      'Bekerjalah dengan gigih tanpa kegaduhan. Biarlah karya nyata, dedikasi, dan kedamaian yang berbicara untuk rakyat.',
      'There is no democracy without freedom of speech, but freedom must be accompanied by responsibility.',
      'Perdamaian bukan hanya ketiadaan perang, melainkan hadirnya keadilan dan rasa aman bagi semua warga.'
    ],
    historicalMilestones: [
      { year: '2005', event: 'MoU Helsinki Perdamaian Aceh', significance: 'Penghentian konflik puluhan tahun menuju persatuan NKRI yang abadi' },
      { year: '2006', event: 'Pelunasan Utang Indonesia ke IMF', significance: 'Pembebasan ekonomi nasional dari beban syarat intervensi keuangan luar negeri' },
      { year: '2008', event: 'Indonesia Resmi Menjadi Anggota G20', significance: 'Pengakuan posisi strategis ekonomi Indonesia di tingkat kepemimpinan global' }
    ],
    reflectionForStudents: 'SBY menginspirasi siswa SMANDE bahwa penyelesaian masalah rumit harus ditempuh dengan dialog rasional, kepala dingin, perencanaan matang, dan penghormatan pada hukum.',
    interestingFact: 'SBY adalah lulusan terbaik Akabri (Adhi Makayasa) tahun 1973, peraih gelar Master di Webster University AS, serta menyelesaikan gelar Doktor Ekonomi Pertanian di IPB University pada masa awal menjabat presiden.'
  },
  {
    id: 'jokowi',
    orderNumber: 7,
    name: 'Joko Widodo (Jokowi)',
    fullNameWithTitle: 'Ir. H. Joko Widodo',
    popularTitle: 'Bapak Infrastruktur & Hilirisasi Nasional',
    period: '20 Oktober 2014 – 20 Oktober 2024',
    yearsInOffice: '2014 – 2024 (10 Tahun, 2 Periode)',
    era: 'Indonesia Maju',
    vicePresidents: [
      'Drs. H. Muhammad Jusuf Kalla (2014–2019)',
      'Prof. Dr. (H.C.) K.H. Ma\'ruf Amin (2019–2024)'
    ],
    birthPlaceDate: 'Surakarta, Jawa Tengah, 21 Juni 1961',
    deathPlaceDate: undefined,
    portraitUrl: '/assets/presidents/jokowi.jpg',
    cabinetNames: ['Kabinet Kerja (2014–2019)', 'Kabinet Indonesia Maju (2019–2024)'],
    majorAchievements: [
      'Membangun konektivitas nasional Indonesia-sentris: ribuan km jalan tol (Trans-Jawa, Trans-Sumatera), pelabuhan tol laut, dan bandara perintis.',
      'Menerapkan kebijakan Hilirisasi Industri Sumber Daya Alam (nikel, bauksit, tembaga) untuk melipatgandakan nilai tambah ekonomi dalam negeri.',
      'Mengambil alih 51% saham mayoritas PT Freeport Indonesia ke pangkuan Ibu Pertiwi melalui holding BUMN Inalum/MIND ID.',
      'Meluncurkan program perlindungan sosial konkret: Kartu Indonesia Sehat (KIS), Kartu Indonesia Pintar (KIP), dan pembagian jutaan sertifikat tanah gratis (PTSL).',
      'Menginisiasi pemindahan Ibu Kota Negara ke Nusantara (IKN) di Kalimantan Timur guna mendorong pemerataan luar pulau Jawa.',
      'Memimpin Presidensi G20 Indonesia 2022 di Bali dan Keketuaan ASEAN 2023 di tengah ketegangan geopolitik global dengan sukses gemilang.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 5,
        description: 'Mewujudkan Keadilan Sosial dengan menggeser fokus pembangunan dari Jawa-sentris menjadi Indonesia-sentris (membangun dari pinggiran).'
      },
      {
        silaNumber: 3,
        description: 'Menjaga persatuan dan kekompakan bangsa saat menghadapi pandemi global COVID-19 lewat gotong royong nasional.'
      }
    ],
    famousQuotes: [
      'Kerja, kerja, kerja! Kita tidak boleh merasa kecil atau inferior. Bangsa kita adalah bangsa yang besar dan tangguh.',
      'Pembangunan bukan hanya untuk yang di Jawa atau kota besar, melainkan hak seluruh anak bangsa hingga batas terluar nusantara.',
      'Masa depan adalah milik mereka yang berani melompat dan bekerja cepat!'
    ],
    historicalMilestones: [
      { year: '2018', event: 'Pengambilalihan Mayoritas Saham 51% Freeport', significance: 'Kedaulatan pengelolaan kekayaan tambang emas-tembaga terbesar di Papua' },
      { year: '2020', event: 'Pemberlakuan Larangan Ekspor Bijih Nikel Mentah', significance: 'Lompatan besar hilirisasi ekosistem baterai dan industri hijau nasional' },
      { year: '2022', event: 'Presidensi G20 Indonesia di Bali & Deklarasi Damai', significance: 'Kepemimpinan diplomatik Indonesia yang disegani dalam menjembatani negara-negara adidaya' },
      { year: '2022', event: 'Pengesahan UU IKN & Pembangunan Nusantara', significance: 'Pencanangan poros baru pertumbuhan Indonesia yang merata dan berkelanjutan' }
    ],
    reflectionForStudents: 'Kisah Pak Jokowi dari anak pinggiran bantaran kali hingga menjadi presiden membuktikan bahwa integritas, kesederhanaan, etos kerja pantang menyerah, dan cinta tanah air mampu mewujudkan mimpi anak negeri.',
    interestingFact: 'Jokowi adalah lulusan Fakultas Kehutanan Universitas Gadjah Mada (UGM) Yogyakarta yang sebelum terjun ke dunia politik merupakan pengusaha mebel kayu sukses yang rajin mengekspor produk ke Eropa.'
  },
  {
    id: 'prabowo',
    orderNumber: 8,
    name: 'Prabowo Subianto',
    fullNameWithTitle: 'Jenderal TNI (Purn.) H. Prabowo Subianto Djojohadikusumo',
    popularTitle: 'Presiden Republik Indonesia ke-8',
    period: '20 Oktober 2024 – Sekarang',
    yearsInOffice: '2024 – Sekarang (Periode 2024–2029)',
    era: 'Indonesia Maju',
    vicePresidents: ['Gibran Rakabuming Raka (2024–sekarang)'],
    birthPlaceDate: 'Jakarta, 17 Oktober 1951',
    deathPlaceDate: undefined,
    portraitUrl: '/assets/presidents/prabowo.jpg',
    cabinetNames: ['Kabinet Merah Putih (2024–2029)'],
    majorAchievements: [
      'Menetapkan 8 Misi Utama "Asta Cita" untuk menyongsong Indonesia Emas 2045.',
      'Meluncurkan Program Prioritas Nasional "Makan Bergizi Gratis" (MBG) bagi anak sekolah dan ibu hamil guna memberantas stunting dan meningkatkan konsentrasi belajar siswa.',
      'Mencanangkan percepatan Swasembada Pangan, Swasembada Energi, dan Kemandirian Air sebagai fondasi ketahanan kedaulatan bangsa.',
      'Memperkuat modernisasi alat utama sistem persenjataan (Alutsista) dan industri pertahanan dalam negeri demi menjaga kedaulatan wilayah laut dan udara NKRI.',
      'Melakukan diplomasi proaktif global tingkat tinggi memperkuat posisi Indonesia yang non-blok, mandiri, dan berwibawa di panggung internasional.',
      'Penegakan tata kelola pemerintahan yang bersih, penghematan anggaran negara, dan penindakan tegas terhadap korupsi serta kebocoran sumber daya alam.'
    ],
    pancasilaCoreValues: [
      {
        silaNumber: 2,
        description: 'Memperhatikan kualitas gizi generasi muda bangsa agar tumbuh sehat, cerdas, dan bermartabat melalui program Makan Bergizi Gratis.'
      },
      {
        silaNumber: 3,
        description: 'Mengedepankan persatuan nasional dan rekonsiliasi kebangsaan demi keutuhan serta kedaulatan Negara Kesatuan Republik Indonesia.'
      },
      {
        silaNumber: 5,
        description: 'Memastikan kekayaan alam Indonesia dikelola sebesar-besarnya untuk kemakmuran dan kesejahteraan rakyat lapis bawah.'
      }
    ],
    famousQuotes: [
      'Kekuatan sejati sebuah bangsa ada pada persatuan rakyatnya dan kepedulian terhadap mereka yang paling lemah.',
      'Seribu kawan terlalu sedikit, satu lawan terlalu banyak. Kita ingin menjadi sahabat bagi semua bangsa, tetapi kita pantang menyerah menjaga kedaulatan Indonesia!',
      'Anak-anak Indonesia harus tumbuh kuat, sehat, dan berpendidikan tinggi agar mampu memimpin peradaban dunia!'
    ],
    historicalMilestones: [
      { year: '2024', event: 'Pelantikan Resmi sebagai Presiden RI ke-8', significance: 'Transisi kepemimpinan nasional yang mulus, demokratis, dan penuh persaudaraan' },
      { year: '2024', event: 'Pembentukan Kabinet Merah Putih & Retret Magelang', significance: 'Penyamaan visi kepemimpinan yang berorientasi pada disiplin, loyalitas pada rakyat, dan patriotisme' },
      { year: '2024', event: 'Peluncuran Badan Gizi Nasional & Swasembada Pangan', significance: 'Langkah nyata menyiapkan fondasi fisik dan intelektual generasi Indonesia Emas 2045' }
    ],
    reflectionForStudents: 'Presiden Prabowo mengajarkan semangat patriotisme tak kenal lelah, kedisiplinan tinggi, keberanian menegakkan kebenaran, serta komitmen membela kedaulatan bangsa dengan ilmu dan kerja keras.',
    interestingFact: 'Prabowo Subianto adalah cucu dari Raden Mas Margono Djojohadikusumo (pendiri Bank Negara Indonesia / BNI 1946 dan anggota BPUPK) serta putra dari Begawan Ekonomi Indonesia Prof. Soemitro Djojohadikusumo.'
  }
];

export const nationalHeroesData: NationalHeroItem[] = [
  {
    id: 'mohammad-hatta',
    name: 'Dr. (H.C.) Drs. H. Mohammad Hatta (Bung Hatta)',
    roleTitle: 'Proklamator, Bapak Koperasi & Perumus Piagam Jakarta',
    category: 'Perumus Pancasila',
    birthDeath: 'Bukittinggi, 12 Agustus 1902 – Jakarta, 14 Maret 1980',
    originProvince: 'Sumatera Barat',
    portraitUrl: '/assets/heroes/hatta.jpg',
    contributionToPancasila: 'Anggota Panitia Sembilan yang merumuskan Piagam Jakarta (22 Juni 1945), tokoh kunci pengubah sila pertama menjadi "Ketuhanan Yang Maha Esa" demi menjaga persatuan bangsa.',
    pancasilaPillars: [1, 5],
    keyActions: [
      'Bersama Bung Karno menandatangani Teks Proklamasi Kemerdekaan 17 Agustus 1945 atas nama bangsa Indonesia.',
      'Menjadi arsitek diplomasi kedaulatan pada Konferensi Meja Bundar (KMB) di Den Haag 1949.',
      'Menggagas pilar ekonomi kerakyatan berasaskan gotong royong melalui Koperasi (Pasal 33 UUD 1945).'
    ],
    famousQuote: 'Kurang cerdas dapat diperbaiki dengan belajar. Kurang cakap dapat dihilangkan dengan pengalaman. Namun tidak jujur itu sulit diperbaiki!',
    smandeMessage: 'Kejujuran dan kesederhanaan Bung Hatta adalah cerminan luhur Profil Pelajar Pancasila.'
  },
  {
    id: 'soepomo',
    name: 'Prof. Mr. Dr. Soepomo',
    roleTitle: 'Arsitek Konstitusi UUD 1945 & Konseptor Negara Integralistik',
    category: 'Perumus Pancasila',
    birthDeath: 'Sukoharjo, 22 Januari 1903 – Jakarta, 12 September 1958',
    originProvince: 'Jawa Tengah',
    portraitUrl: '/assets/heroes/soepomo.jpg',
    contributionToPancasila: 'Menyampaikan gagasan dasar negara pada sidang BPUPK 31 Mei 1945 tentang persatuan integralistik, kekeluargaan, dan keseimbangan lahir batin.',
    pancasilaPillars: [3, 4],
    keyActions: [
      'Menjabat Ketua Panitia Kecil Perancang UUD dalam sidang BPUPK.',
      'Merumuskan batang tubuh dan penjelasan UUD NRI 1945 yang disahkan PPKI pada 18 Agustus 1945.',
      'Menteri Kehakiman Pertama Republik Indonesia.'
    ],
    famousQuote: 'Negara Indonesia merdeka bukan negara yang menyatukan diri dengan golongan terbesar, melainkan mengatasi segala golongan dan menghormati seluruh rakyatnya.',
    smandeMessage: 'Pahami hakikat negara hukum dan persatuan kekeluargaan dalam bingkai konstitusi kita.'
  },
  {
    id: 'mohammad-yamin',
    name: 'Prof. Mr. Mohammad Yamin, S.H.',
    roleTitle: 'Pelopor Sumpah Pemuda 1928, Anggota Panitia Sembilan & Sejarawan',
    category: 'Perumus Pancasila',
    birthDeath: 'Sawahlunto, 23 Agustus 1903 – Jakarta, 17 Oktober 1962',
    originProvince: 'Sumatera Barat',
    portraitUrl: '/assets/heroes/yamin.jpg',
    contributionToPancasila: 'Menyampaikan 5 asas usulan dasar negara pada 29 Mei 1945 di hadapan BPUPK: Peri Kebangsaan, Peri Kemanusiaan, Peri Ketuhanan, Peri Kerakyatan, dan Kesejahteraan Rakyat.',
    pancasilaPillars: [2, 3],
    keyActions: [
      'Sekretaris Kongres Pemuda II yang menuliskan teks ikrar Sumpah Pemuda 28 Oktober 1928.',
      'Mengusulkan semboyan Bhinneka Tunggal Ika dari Kitab Sutasoma karya Mpu Tantular sebagai semboyan resmi negara.',
      'Menteri Pendidikan, Pengajaran, dan Kebudayaan RI (1953–1955).'
    ],
    famousQuote: 'Cita-cita persatuan Indonesia itu bukan omong kosong, tetapi benar-benar didukung oleh kekuatan yang timbul pada akar sejarah bangsa kita sendiri.',
    smandeMessage: 'Jadikan Sumpah Pemuda dan semboyan Bhinneka Tunggal Ika sebagai napas pergaulan sehari-hari.'
  },
  {
    id: 'radjiman',
    name: 'Dr. K.R.T. Radjiman Wedyodiningrat',
    roleTitle: 'Ketua BPUPK & Tokoh Peletak Pondasi Kemerdekaan',
    category: 'Perumus Pancasila',
    birthDeath: 'Yogyakarta, 21 April 1879 – Ngawi, 20 September 1952',
    originProvince: 'DI Yogyakarta',
    portraitUrl: '/assets/heroes/radjiman.jpg',
    contributionToPancasila: 'Sebagai Ketua BPUPK, beliau mengajukan pertanyaan kunci bersejarah pada 29 Mei 1945: "Apa dasarnya Indonesia merdeka yang akan kita dirikan ini?", yang memicu lahirnya Pancasila.',
    pancasilaPillars: [1, 2, 3, 4, 5],
    keyActions: [
      'Memimpin jalannya persidangan BPUPK secara demokratis, teduh, dan penuh kebijaksanaan.',
      'Salah satu pendiri organisasi pergerakan modern pertama Budi Utomo pada 1908.',
      'Menjadi dokter rakyat yang mengabdikan hidupnya mengobati masyarakat tanpa memungut biaya.'
    ],
    famousQuote: 'Pertanyaan yang tepat adalah awal dari ditemukannya kebenaran abadi bagi masa depan bangsa.',
    smandeMessage: 'Beranilah bertanya kritis dan mencari solusi bagi kemajuan bangsa melalui penalaran ilmiah.'
  },
  {
    id: 'ki-hajar-dewantara',
    name: 'Ki Hajar Dewantara (R.M. Soewardi Soeryaningrat)',
    roleTitle: 'Bapak Pendidikan Nasional & Pelopor Taman Siswa',
    category: 'Pahlawan Pendidikan',
    birthDeath: 'Yogyakarta, 2 Mei 1889 – Yogyakarta, 26 April 1959',
    originProvince: 'DI Yogyakarta',
    portraitUrl: '/assets/heroes/dewantara.jpg',
    contributionToPancasila: 'Peletak fondasi pendidikan karakter yang merdeka batin, merdeka pikir, dan beradab sesuai dengan keluhuran Sila Kemanusiaan dan Keadilan Sosial.',
    pancasilaPillars: [2, 5],
    keyActions: [
      'Mendirikan Perguruan Nasional Taman Siswa pada 3 Juli 1922 untuk memberi akses belajar bagi kaum pribumi jelata.',
      'Mencetuskan semboyan luhur pendidikan: Ing Ngarso Sung Tulodo, Ing Madyo Mangun Karso, Tut Wuri Handayani.',
      'Menteri Pendidikan, Pengajaran, dan Kebudayaan RI yang pertama.'
    ],
    famousQuote: 'Lawan sastra ngesti mulya: Dengan ilmu kita menuju kemuliaan. Jadikan setiap tempat sebagai sekolah dan jadikan setiap orang sebagai guru.',
    smandeMessage: 'Semangat belajar merdeka di SMA Negeri 1 Mande berakar langsung dari keteladanan Ki Hajar Dewantara.'
  },
  {
    id: 'kartini',
    name: 'Raden Ajeng Kartini',
    roleTitle: 'Pahlawan Emansipasi Wanita & Pelopor Kesetaraan Pendidikan',
    category: 'Emansipasi & HAM',
    birthDeath: 'Mayong, Jepara, 21 April 1879 – Rembang, 17 September 1904',
    originProvince: 'Jawa Tengah',
    portraitUrl: '/assets/heroes/kartini.jpg',
    contributionToPancasila: 'Menegakkan nilai kesetaraan gender dan hak asasi manusia dalam memperoleh pendidikan tanpa diskriminasi feodal.',
    pancasilaPillars: [2, 5],
    keyActions: [
      'Mendirikan sekolah putri pertama di Jepara dan Rembang untuk memberdayakan anak-anak perempuan pribumi.',
      'Menulis surat-surat visioner yang mendobrak feodalisme dan kolonialisme, diterbitkan dalam buku "Habis Gelap Terbitlah Terang".',
      'Pelopor advokasi kesehatan ibu dan anak di tanah Jawa.'
    ],
    famousQuote: 'Tahukah engkau semboyanku? "Aku mau!" Dua patah kata yang ringkas itu sudah beberapa kali mendukung dan membawa aku melintasi gunung keberatan dan kesusahan.',
    smandeMessage: 'Setiap siswi dan siswa SMANDE memiliki hak dan kesempatan setara untuk berprestasi setinggi langit.'
  },
  {
    id: 'soedirman',
    name: 'Jenderal Besar TNI Raden Soedirman',
    roleTitle: 'Panglima Besar TNI Pertama & Pahlawan Gerilya Kemerdekaan',
    category: 'Perjuangan Militer',
    birthDeath: 'Bodas Karangjati, Purbalingga, 24 Januari 1916 – Magelang, 29 Januari 1950',
    originProvince: 'Jawa Tengah',
    portraitUrl: '/assets/heroes/soedirman.jpg',
    contributionToPancasila: 'Menjadi teladan cinta tanah air yang rela berkorban (Sila ke-3) demi mempertahankan kedaulatan bangsa walau dalam kondisi sakit parah.',
    pancasilaPillars: [3],
    keyActions: [
      'Memimpin Pertempuran Ambarawa mengusir pasukan Sekutu pada 15 Desember 1945 (diperingati sebagai Hari Juang Kartika).',
      'Memimpin perang gerilya sejauh ribuan kilometer di pedalaman Jawa saat Agresi Militer Belanda II dalam kondisi ditandu karena penyakit paru-paru.',
      'Menolak menyerah kepada penjajah dan mempertahankan simbol eksistensi angkatan perang Republik Indonesia.'
    ],
    famousQuote: 'Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng Merah Putih akan tetap hidup, menuntut kemerdekaan!',
    smandeMessage: 'Disiplin, loyalitas pada bangsa, dan ketangguhan mental adalah warisan Panglima Besar Soedirman.'
  },
  {
    id: 'bung-tomo',
    name: 'Sutomo (Bung Tomo)',
    roleTitle: 'Pengobar Semangat Juang Arek-Arek Suroboyo (Hari Pahlawan)',
    category: 'Proklamator & Pemimpin',
    birthDeath: 'Surabaya, 3 Oktober 1920 – Padang Arafah, Arab Saudi, 7 Oktober 1981',
    originProvince: 'Jawa Timur',
    portraitUrl: '/assets/heroes/bungtomo.jpg',
    contributionToPancasila: 'Menyatukan kekuatan agama (Takbir) dan nasionalisme (Merdeka) dalam menggerakkan rakyat melawan imperialisme demi keutuhan NKRI.',
    pancasilaPillars: [1, 3],
    keyActions: [
      'Mengobarkan pidato pembakar semangat lewat Radio Pemberontakan pada pertempuran 10 November 1945 di Surabaya.',
      'Memimpin Barisan Pemberontakan Rakyat Indonesia (BPRI) mempertahankan kemerdekaan dari agresi Sekutu/Inggris.',
      'Menjadi jurnalis pejuang yang vokal membela kepentingan rakyat jelata.'
    ],
    famousQuote: 'Selama banteng-banteng Indonesia masih mempunyai darah merah yang dapat membikin secarik kain putih menjadi merah dan putih, maka selama itu kita tidak akan menyerah kepada siapa pun juga!',
    smandeMessage: 'Pertahankan kemerdekaan dengan karya dan prestasi nyata untuk almamater dan nusantara.'
  },
  {
    id: 'agus-salim',
    name: 'H. Agus Salim (The Grand Old Man)',
    roleTitle: 'Diplomat Ulung Kemerdekaan, Anggota Panitia Sembilan & Cendekiawan',
    category: 'Perumus Pancasila',
    birthDeath: 'Koto Gadang, Agam, 8 Oktober 1884 – Jakarta, 4 November 1954',
    originProvince: 'Sumatera Barat',
    portraitUrl: '/assets/heroes/agussalim.jpg',
    contributionToPancasila: 'Anggota Panitia Sembilan yang menguasai 9 bahasa asing, merumuskan kompromi luhur dasar negara, dan memperjuangkan pengakuan de jure kemerdekaan RI dari negara-negara Arab.',
    pancasilaPillars: [1, 2],
    keyActions: [
      'Memimpin delegasi diplomatik Indonesia ke Timur Tengah (Mesir, Suriah, Irak, Arab Saudi) hingga memperoleh pengakuan kedaulatan internasional pertama.',
      'Tokoh Sarekat Islam dan pemimpin teladan yang hidup sangat sederhana meski berilmu tinggi.',
      'Menteri Luar Negeri RI pada masa perang kemerdekaan (1947–1949).'
    ],
    famousQuote: 'Leiden is lijden: Memimpin itu menderita, bukan menumpuk harta atau mengejar kemewahan.',
    smandeMessage: 'Kepemimpinan sejati adalah pengabdian tulus tanpa pamrih kepada sesama manusia.'
  },
  {
    id: 'hasyim-asyari',
    name: 'Hadratussyaikh K.H. Muhammad Hasyim Asy\'ari',
    roleTitle: 'Pendiri Nahdlatul Ulama & Pencetus Resolusi Jihad 1945',
    category: 'Tokoh Ulama & Agama',
    birthDeath: 'Gedang, Jombang, 14 Februari 1871 – Jombang, 25 Juli 1947',
    originProvince: 'Jawa Timur',
    portraitUrl: '/assets/heroes/hasyimasyari.jpg',
    contributionToPancasila: 'Menegaskan bahwa membela tanah air adalah bagian dari iman (*Hubbul Wathan Minal Iman*) dan menyelaraskan nilai keagamaan dengan kebangsaan.',
    pancasilaPillars: [1, 3],
    keyActions: [
      'Mendirikan Nahdlatul Ulama (NU) pada 31 Januari 1926.',
      'Mengeluarkan fatwa "Resolusi Jihad" pada 22 Oktober 1945 yang mewajibkan umat berjuang mempertahankan kemerdekaan dari penjajah (cikal bakal Hari Santri Nasional).',
      'Memimpin Pesantren Tebuireng yang mencetak ribuan pejuang kemerdekaan.'
    ],
    famousQuote: 'Membela tanah air dari penjajahan adalah kewajiban suci bagi setiap anak bangsa yang beriman.',
    smandeMessage: 'Agama dan nasionalisme saling menguatkan dalam membangun persatuan Indonesia yang kokoh.'
  },
  {
    id: 'ahmad-dahlan',
    name: 'K.H. Ahmad Dahlan (Muhammad Darwis)',
    roleTitle: 'Pendiri Muhammadiyah & Pelopor Pembaharuan Sosial-Pendidikan',
    category: 'Tokoh Ulama & Agama',
    birthDeath: 'Yogyakarta, 1 Agustus 1868 – Yogyakarta, 23 Februari 1923',
    originProvince: 'DI Yogyakarta',
    portraitUrl: '/assets/heroes/ahmaddahlan.jpg',
    contributionToPancasila: 'Mewujudkan Sila Kemanusiaan dan Keadilan Sosial melalui teologi Al-Ma\'un yang mendirikan sekolah modern, panti asuhan, dan rumah sakit bagi rakyat jelata.',
    pancasilaPillars: [2, 5],
    keyActions: [
      'Mendirikan organisasi kemasyarakatan Muhammadiyah di Yogyakarta pada 18 November 1912.',
      'Merintis sekolah pribumi modern yang memadukan ilmu agama dengan sains dan matematika.',
      'Mendirikan Penolong Kesengsaraan Oemoem (PKO) yang menjadi cikal bakal jaringan rumah sakit PKU Muhammadiyah.'
    ],
    famousQuote: 'Hidup-hidupilah Muhammadiyah dan jangan mencari hidup di Muhammadiyah. Beramallah dengan ilmu yang membawa manfaat bagi umat manusia.',
    smandeMessage: 'Jadikan ilmu yang kita pelajari di sekolah sebagai alat menolong sesama yang membutuhkan.'
  },
  {
    id: 'fatmawati',
    name: 'Hj. Fatmawati Soekarno',
    roleTitle: 'Penjahit Bendera Pusaka Sang Saka Merah Putih & Ibu Negara Pertama',
    category: 'Emansipasi & HAM',
    birthDeath: 'Bengkulu, 5 Februari 1923 – Kuala Lumpur, 14 Mei 1980',
    originProvince: 'Bengkulu',
    portraitUrl: '/assets/heroes/fatmawati.jpg',
    contributionToPancasila: 'Mewujudkan lambang persatuan nasional (Sila ke-3) melalui jahitan tangan Bendera Pusaka yang berkibar pada saat Proklamasi Kemerdekaan.',
    pancasilaPillars: [3],
    keyActions: [
      'Menjahit dengan tangan sendiri kain Merah Putih dari katun Jepang yang menjadi Sang Saka Merah Putih 17 Agustus 1945.',
      'Mendampingi perjuangan Bung Karno di masa pengasingan dan masa gerilya revolusi kemerdekaan.',
      'Mendirikan Rumah Sakit Tuberkulosis pertama dan yayasan sosial bagi penderita penyakit kronis.'
    ],
    famousQuote: 'Jahitan bendera itu kuanyam dengan doa dan air mata, agar kelak berkibar abadi di atas bumi pertiwi yang merdeka.',
    smandeMessage: 'Hormati bendera Merah Putih sebagai simbol kehormatan, persatuan, dan pengorbanan para pendahulu.'
  },
  {
    id: 'cut-nyak-dien',
    name: 'Cut Nyak Dien',
    roleTitle: 'Pahlawan Pejuang Perang Aceh & Srikandi Kemerdekaan',
    category: 'Perjuangan Militer',
    birthDeath: 'Lampadang, Aceh Besar, 1848 – Sumedang, Jawa Barat, 6 November 1908',
    originProvince: 'Aceh',
    portraitUrl: '/assets/heroes/cutnyakdien.jpg',
    contributionToPancasila: 'Mencontohkan keteguhan iman dan pantang menyerah melawan penjajahan kolonial demi kedaulatan martabat tanah air.',
    pancasilaPillars: [1, 3],
    keyActions: [
      'Melanjutkan perang gerilya di hutan belantara Aceh memimpin pasukan setelah suaminya Teuku Umar gugur.',
      'Berjuang hingga usia lanjut meski menderita rabun dan penyakit encok, menolak tunduk pada Belanda.',
      'Diasingkan ke Sumedang, Jawa Barat, dan mengajar agama Islam serta Al-Qur\'an bagi warga setempat hingga wafat.'
    ],
    famousQuote: 'Sebagai perempuan muslim, pantang bagiku meneteskan air mata di hadapan penjajah. Bangkitlah wahai anak-anak bangsaku!',
    smandeMessage: 'Ketabahan dan keberanian Cut Nyak Dien yang dimakamkan di Jawa Barat membuktikan ikatan persaudaraan sejati lintas daerah.'
  },
  {
    id: 'sayuti-melik',
    name: 'Mohamad Ibnu Sayuti (Sayuti Melik)',
    roleTitle: 'Pengetik Naskah Otentik Proklamasi Kemerdekaan & Tokoh Pemuda',
    category: 'Proklamator & Pemimpin',
    birthDeath: 'Sleman, 22 November 1908 – Jakarta, 27 Februari 1989',
    originProvince: 'DI Yogyakarta',
    portraitUrl: '/assets/heroes/sayutimelik.jpg',
    contributionToPancasila: 'Berperan krusial dalam detik-detik penentuan proklamasi kemerdekaan serta menyempurnakan kata dan ejaan naskah proklamasi.',
    pancasilaPillars: [3, 4],
    keyActions: [
      'Mengetik naskah proklamasi kemerdekaan Indonesia di rumah Laksamana Maeda pada dini hari 17 Agustus 1945.',
      'Mengusulkan perubahan kalimat "tempoh" menjadi "tempo" dan mengusulkan Bung Karno dan Bung Hatta menandatangani teks proklamasi "atas nama bangsa Indonesia".',
      'Tokoh jurnalis pergerakan dan anggota perintis kemerdekaan.'
    ],
    famousQuote: 'Ketelitian dan keberanian bertindak di saat-saat genting menentukan arah sejarah peradaban bangsa.',
    smandeMessage: 'Kecermatan dalam bekerja dan kemahiran literasi adalah senjata pemuda zaman sekarang.'
  }
];
