import { ForumPost, SchoolAnnouncement } from '../types';

export const initialAnnouncements: SchoolAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Pelaksanaan Asesmen Sumatif Tengah Semester Pendidikan Pancasila',
    category: 'Ujian',
    date: '10 November 2026',
    author: 'Munawar Rois, S.Pd. (Guru Pengampu)',
    content: 'Diberitahukan kepada seluruh siswa kelas X, XI, dan XII SMANDE, Asesmen Sumatif Tengah Semester akan diselenggarakan secara digital melalui platform ini. Harap menyelesaikan seluruh materi dan latihan kuis di Bank Soal.',
  },
  {
    id: 'ann-2',
    title: 'Peringatan Hari Pahlawan & Lomba Esai Demokrasi Muda SMANDE',
    category: 'Kegiatan',
    date: '08 November 2026',
    author: 'Pembina OSIS SMANDE',
    content: 'Mari kobarkan semangat kepahlawanan dengan mengikuti Lomba Debat Konstitusi dan Esai Inovasi Nilai Pancasila. Pendaftaran dibuka melalui menu Kompetisi.',
  },
  {
    id: 'ann-3',
    title: 'Pengumpulan LKPD Digital Bab Norma & Hierarki Hukum',
    category: 'Tugas',
    date: '05 November 2026',
    author: 'Munawar Rois, S.Pd.',
    content: 'Batas akhir pengunggahan Lembar Kerja Peserta Didik (LKPD) Bab 2 adalah hari Jumat pukul 23.59 WIB. Pastikan jawaban dikerjakan dengan jujur dan orisinal.',
  },
];

export const initialForumPosts: ForumPost[] = [
  {
    id: 'fp-1',
    authorName: 'Ahmad Fauzan',
    authorRole: 'Siswa Kelas XI-1',
    avatar: '👨‍🎓',
    timeAgo: '2 jam lalu',
    title: 'Bagaimana batas kebebasan berpendapat di media sosial menurut Pasal 28E vs UU ITE?',
    content: 'Teman-teman, dalam materi Demokrasi Pancasila kita belajar bahwa setiap warga negara bebas berpendapat. Namun di medsos sering kali ada batas antara kritik yang membangun dengan ujaran kebencian. Menurut kalian, bagaimana indikator etis membedakan kritik objektif dengan penghinaan personal?',
    category: 'Etika Digital',
    upvotes: 14,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Siti Nurhaliza',
        authorRole: 'Siswa Kelas XI-2',
        content: 'Menurut saya, kritik berfokus pada kebijakan atau gagasan yang disertai data/solusi, bukan menyerang fisik, agama, atau kehormatan pribadi seseorang.',
        timeAgo: '1 jam lalu',
      },
      {
        id: 'rep-2',
        authorName: 'Munawar Rois, S.Pd.',
        authorRole: 'Guru Pendidikan Pancasila',
        content: 'Bagus sekali diskusinya anak-anak! Ingat kaidah Sila ke-2: kemanusiaan yang beradab. Kebebasan hak asasi kita selalu dibatasi oleh kewajiban asasi menghormati hak orang lain (Pasal 28J ayat 2 UUD 1945). Pertahankan budaya dialog santun ini!',
        timeAgo: '30 menit lalu',
      },
    ],
  },
  {
    id: 'fp-2',
    authorName: 'Dewi Lestari',
    authorRole: 'Siswa Kelas X-3',
    avatar: '👩‍🎓',
    timeAgo: '1 hari lalu',
    title: 'Refleksi Nilai Sila Ke-4: Apakah voting selalu lebih unggul dari musyawarah mufakat?',
    content: 'Di banyak negara barat voting dianggap paling cepat. Mengapa founding fathers kita justru menekankan musyawarah mufakat terlebih dahulu?',
    category: 'Demokrasi Pancasila',
    upvotes: 21,
    replies: [
      {
        id: 'rep-3',
        authorName: 'Budi Pratama',
        authorRole: 'Ketua MPK SMANDE',
        content: 'Karena voting berpotensi menciptakan tirani mayoritas di mana pihak yang kalah merasa ditinggalkan. Musyawarah mufakat merangkul semua pihak sehingga tercipta rasa saling memiliki (sense of belonging).',
        timeAgo: '18 jam lalu',
      },
    ],
  },
];
