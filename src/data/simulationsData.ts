import { SimulationScenario } from '../types';

export const simulationsData: SimulationScenario[] = [
  {
    id: 'sim-ppki',
    title: 'Simulasi Sidang PPKI 18 Agustus 1945',
    category: 'ppki',
    badgeTitle: 'Duta Konsensus Kebangsaan',
    description: 'Ambillah peran penting sebagai tokoh bangsa dalam sidang penentuan pembukaan dan batang tubuh UUD 1945 serta pemilihan Presiden pertama Indonesia.',
    background: 'Pagi hari 18 Agustus 1945, suasana di Gedung Tyuuoo Sangi-in (sekarang Gedung Pancasila, Jakarta) mencekam. Sebelum sidang resmi dimulai, Bung Hatta memanggil tokoh-tokoh Islam terkemuka untuk membahas keberatan dari utusan Indonesia Timur perihal 7 kata dalam Piagam Jakarta.',
    steps: [
      {
        stepNumber: 1,
        title: 'Musyawarah Pra-Sidang: Usulan Penghapusan 7 Kata Piagam Jakarta',
        narrative: 'Bung Hatta menemui Ki Bagoes Hadikoesoemo, Kasman Singodimedjo, Wahid Hasjim, dan Teuku Moh. Hasan. Bung Hatta menyampaikan bahwa saudara sebangsa di kawasan Indonesia Timur mengancam memisahkan diri jika dasar negara mencantumkan kewajiban syariat bagi pemeluknya. Sebagai salah satu tokoh persidangan, apa tanggapanmu?',
        options: [
          {
            id: 'opt1',
            text: 'Menerima perubahan dengan mengganti rumusan menjadi "Ketuhanan Yang Maha Esa" demi keutuhan Republik Indonesia yang baru berumur satu hari.',
            feedback: 'Keputusan yang sangat bijaksana! Sejarah mencatat Bung Hatta dan Ki Bagoes Hadikoesoemo berjiwa besar mengorbankan ego demi persatuan Indonesia yang merdeka.',
            silaCorrelation: 'Sila ke-1 dan Sila ke-3 (Persatuan Indonesia)',
            isRecommended: true,
            score: 100,
          },
          {
            id: 'opt2',
            text: 'Menolak keras segala perubahan dan membiarkan wilayah Indonesia Timur memisahkan diri.',
            feedback: 'Sikap ini membahayakan persatuan bangsa. Tanpa kompromi luhur, Indonesia terancam terpecah-belah sejak awal kelahirannya.',
            silaCorrelation: 'Bertentangan dengan Semangat Persatuan Indonesia',
            isRecommended: false,
            score: 20,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Pengesahan Undang-Undang Dasar dan Pemilihan Presiden-Wapres',
        narrative: 'Sidang pleno PPKI dimulai dipimpin Ir. Soekarno. Agenda mendesak adalah menetapkan UUD serta memilih Presiden dan Wakil Presiden RI secara aklamasi.',
        options: [
          {
            id: 'opt1',
            text: 'Mendukung usulan Otto Iskandardinata untuk memilih Ir. Soekarno sebagai Presiden dan Drs. Moh. Hatta sebagai Wakil Presiden secara aklamasi diiringi lagu Indonesia Raya.',
            feedback: 'Tepat sekali! Seluruh anggota sidang menyambut dengan tepuk tangan meriah dan menyanyikan lagu kebangsaan secara spontan.',
            silaCorrelation: 'Sila ke-4 (Hikmat Kebijaksanaan dalam Musyawarah/Perwakilan)',
            isRecommended: true,
            score: 100,
          },
          {
            id: 'opt2',
            text: 'Menuntut penundaan pemilihan presiden hingga enam bulan ke depan.',
            feedback: 'Penundaan pada masa revolusi kemerdekaan akan menyebabkan kekosongan kekuasaan (vacuum of power) yang membahayakan kedaulatan Indonesia dari intervensi sekutu.',
            silaCorrelation: 'Kurang memahami situasi genting proklamasi',
            isRecommended: false,
            score: 30,
          },
        ],
      },
    ],
    reflectionPrompt: 'Renungkan: Nilai keteladanan apakah yang paling berharga dari para pendiri bangsa yang dapat kamu terapkan ketika menghadapi perbedaan pendapat antarteman di sekolah?',
  },
  {
    id: 'sim-musyawarah',
    title: 'Simulasi Musyawarah Mufakat Kelas SMANDE',
    category: 'musyawarah',
    badgeTitle: 'Pamong Musyawarah',
    description: 'Kelola musyawarah kelas dalam penentuan destinasi projek pembelajaran lapangan & penggunaan uang kas kelas secara transparan.',
    background: 'Kelasmu mendapatkan amanah mengadakan kegiatan outing class bertema P5 (Projek Penguatan Profil Pelajar Pancasila). Terdapat tiga kelompok usulan yang saling bertolak belakang: kelompok A ingin ke desa binaan pertanian, kelompok B ingin ke museum sejarah nasional, dan kelompok C ingin ke taman rekreasi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Mendengar dan Menghargai Seluruh Aspirasi',
        narrative: 'Sebagai ketua kelas yang memimpin sidang, perdebatan mulai meninggi karena beberapa siswa menuduh kelompok lain egois. Sikap apa yang kamu ambil?',
        options: [
          {
            id: 'opt1',
            text: 'Mengetuk meja persidangan dengan tenang, meminta setiap juru bicara kelompok memaparkan relevansi edukatif dan rincian biaya selama 3 menit tanpa disela.',
            feedback: 'Langkah kepemimpinan yang matang! Memberikan kesempatan setara untuk berbicara adalah inti keadilan musyawarah.',
            silaCorrelation: 'Sila ke-4 (Permusyawaratan yang beradab)',
            isRecommended: true,
            score: 100,
          },
          {
            id: 'opt2',
            text: 'Langsung memilih opsi taman rekreasi karena disukai teman-teman dekatmu.',
            feedback: 'Tindakan ini tidak adil (nepotisme pertemanan) dan melanggar prinsip kebersamaan kelas.',
            silaCorrelation: 'Bertentangan dengan Sila ke-5',
            isRecommended: false,
            score: 25,
          },
        ],
      },
      {
        stepNumber: 2,
        title: 'Menggagas Solusi Titik Temu (Kompromi Win-Win)',
        narrative: 'Setelah pemaparan, ternyata kelompok sejarah dan kelompok pertanian sama-sama relevan dengan kurikulum, sedangkan taman rekreasi melebihi budget kas kelas. Apa kesimpulan mufakatmu?',
        options: [
          {
            id: 'opt1',
            text: 'Menggabungkan rute kunjungan: pagi hari ke museum sejarah perjuangan, siang hari ke sentra pertanian terpadu, dan sore hari games keakraban di taman kota terdekat.',
            feedback: 'Luar biasa! Solusi integratif ini merangkul semua aspirasi dan tetap hemat anggaran.',
            silaCorrelation: 'Sila ke-4 dan Sila ke-3',
            isRecommended: true,
            score: 100,
          },
        ],
      },
    ],
    reflectionPrompt: 'Mengapa dalam musyawarah kita harus mendahulukan "kepentingan umum" di atas kepuasan selera pribadi?',
  },
  {
    id: 'sim-osis',
    title: 'Simulasi Sidang Umum Parlemen OSIS & MPK',
    category: 'osis',
    badgeTitle: 'Legislator Muda Berintegritas',
    description: 'Rancang undang-undang tata tertib siswa anti-perundungan (anti-bullying) di lingkungan SMA Negeri.',
    background: 'Maraknya cyberbullying di media sosial antarpelajar memerlukan aturan sekolah yang tegas namun tetap membina karakter peserta didik.',
    steps: [
      {
        stepNumber: 1,
        title: 'Perumusan Klausul Perlindungan Korban dan Sanksi Edukatif',
        narrative: 'Dalam draf aturan, apakah sanksi yang paling selaras dengan nilai pemulihan kemanusiaan yang beradab?',
        options: [
          {
            id: 'opt1',
            text: 'Kombinasi sanksi bertahap: konseling psikologis bersama guru BK, kerja sosial kebersihan lingkungan sekolah, dan permohonan maaf terbuka yang dibimbing.',
            feedback: 'Sangat tepat! Keadilan restoratif (restorative justice) berorientasi menyadarkan pelaku dan memulihkan kondisi mental korban.',
            silaCorrelation: 'Sila ke-2 (Kemanusiaan yang Adil dan Beradab)',
            isRecommended: true,
            score: 100,
          },
          {
            id: 'opt2',
            text: 'Mengeluarkan siswa dari sekolah tanpa diberi kesempatan klarifikasi atau pembinaan.',
            feedback: 'Sanksi yang tergesa-gesa tanpa pembinaan dapat memutus hak pendidikan anak yang dilindungi konstitusi.',
            silaCorrelation: 'Kurang menjunjung hak asasi pendidikan',
            isRecommended: false,
            score: 30,
          },
        ],
      },
    ],
    reflectionPrompt: 'Bagaimana peran aktif pengurus OSIS dalam menciptakan iklim sekolah yang aman, inklusif, dan bebas diskriminasi?',
  },
  {
    id: 'sim-hukum',
    title: 'Simulasi Pengujian Norma di Mahkamah Konstitusi (Judicial Review)',
    category: 'hukum',
    badgeTitle: 'Ksatria Konstitusi',
    description: 'Menjadi Hakim Konstitusi yang menguji keselarasan suatu peraturan daerah dengan UUD NRI 1945.',
    background: 'Sebuah daerah menerbitkan Peraturan Daerah (Perda) yang melarang pedagang kaki lima dari luar daerah untuk berjualan di tempat umum.',
    steps: [
      {
        stepNumber: 1,
        title: 'Uji Kesesuaian dengan Pasal 27 & 28D UUD 1945',
        narrative: 'Pasal 27 ayat (2) UUD 1945 berbunyi: "Tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan." Sebagai majelis hakim, apa putusanmu terhadap Perda tersebut?',
        options: [
          {
            id: 'opt1',
            text: 'Menyatakan pasal larangan dalam Perda tersebut bertentangan dengan UUD 1945 dan tidak memiliki kekuatan hukum mengikat.',
            feedback: 'Putusan yang berkeadilan! Setiap warga negara berhak mencari nafkah di seluruh penjuru wilayah NKRI tanpa diskriminasi kedaerahan.',
            silaCorrelation: 'Sila ke-5 (Keadilan Sosial) dan Pasal 27 UUD 1945',
            isRecommended: true,
            score: 100,
          },
          {
            id: 'opt2',
            text: 'Membenarkan Perda tersebut karena setiap daerah bebas membuat aturan sendiri tanpa perlu peduli konstitusi nasional.',
            feedback: 'Keliru! Otonomi daerah berada dalam kerangka NKRI dan tidak boleh melanggar hak asasi konstitusional warga negara.',
            silaCorrelation: 'Melanggar hierarki peraturan perundang-undangan',
            isRecommended: false,
            score: 20,
          },
        ],
      },
    ],
    reflectionPrompt: 'Mengapa keberadaan Mahkamah Konstitusi sangat penting sebagai penjaga konstitusi (The Guardian of the Constitution)?',
  },
  {
    id: 'sim-hak-kewajiban',
    title: 'Simulasi Hak dan Kewajiban Warga Negara',
    category: 'hak_kewajiban',
    badgeTitle: 'Warga Negara Teladan',
    description: 'Menyeimbangkan hak asasi dengan kewajiban asasi dalam kehidupan bermasyarakat.',
    background: 'Di kompleks perumahan, seorang warga ingin menyelenggarakan acara musik malam hari dengan pengeras suara berdaya tinggi hingga larut malam dengan alasan hak berekspresi di rumah sendiri.',
    steps: [
      {
        stepNumber: 1,
        title: 'Keseimbangan Hak Individu dan Ketertiban Umum',
        narrative: 'Apakah hak berekspresi bersifat mutlak tanpa batas?',
        options: [
          {
            id: 'opt1',
            text: 'Tidak mutlak. Pasal 28J ayat (2) UUD 1945 menegaskan bahwa pelaksanaan hak setiap orang dibatasi oleh kewajiban menghormati hak dan ketenteraman orang lain.',
            feedback: 'Benar sekali! Kebebasan individu berakhir di mana hak orang lain untuk beristirahat dengan damai dimulai.',
            silaCorrelation: 'Sila ke-2 dan Pasal 28J UUD 1945',
            isRecommended: true,
            score: 100,
          },
        ],
      },
    ],
    reflectionPrompt: 'Tuliskan satu contoh kewajiban sebagai pelajar yang paling berdampak bagi ketertiban lingkungan sekolahmu!',
  },
];
