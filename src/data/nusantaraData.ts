export interface ProvinceCulture {
  id: string;
  name: string;
  island: string;
  capital: string;
  traditionalHouse: string;
  dance: string;
  gotongRoyongWisdom: {
    term: string;
    description: string;
  };
  pancasilaValue: string;
}

export const nusantaraData: ProvinceCulture[] = [
  {
    id: 'aceh',
    name: 'Aceh',
    island: 'Sumatera',
    capital: 'Banda Aceh',
    traditionalHouse: 'Rumoh Aceh',
    dance: 'Tari Saman & Tari Seudati',
    gotongRoyongWisdom: {
      term: 'Meuseuraya',
      description: 'Tradisi tolong-menolong masyarakat Aceh dalam membangun rumah, panen, atau hajatan tanpa mengharap upah uang.',
    },
    pancasilaValue: 'Nilai Religiusitas dan Kekeluargaan (Sila 1 & Sila 3)',
  },
  {
    id: 'sumut',
    name: 'Sumatera Utara',
    island: 'Sumatera',
    capital: 'Medan',
    traditionalHouse: 'Rumah Bolon',
    dance: 'Tari Tor-Tor',
    gotongRoyongWisdom: {
      term: 'Siadapari / Marsialapari',
      description: 'Saling bergantian membantu menggarap sawah atau ladang antartetangga secara serentak.',
    },
    pancasilaValue: 'Semangat Keadilan Sosial dan Kebersamaan (Sila 5)',
  },
  {
    id: 'sumbar',
    name: 'Sumatera Barat',
    island: 'Sumatera',
    capital: 'Padang',
    traditionalHouse: 'Rumah Gadang',
    dance: 'Tari Piring & Tari Payung',
    gotongRoyongWisdom: {
      term: 'Batampek / Batobo',
      description: 'Kearifan Minangkabau dalam musyawarah kaum dan gotong royong panen sawah.',
    },
    pancasilaValue: 'Musyawarah Mufakat: "Bulek aia dek pembuluah, bulek kato dek mupakat" (Sila 4)',
  },
  {
    id: 'dki',
    name: 'DKI Jakarta',
    island: 'Jawa',
    capital: 'Jakarta',
    traditionalHouse: 'Rumah Kebaya',
    dance: 'Tari Yapong & Tari Cokek',
    gotongRoyongWisdom: {
      term: 'Nyambat',
      description: 'Tradisi warga Betawi mengundang tetangga untuk membantu mendirikan rumah atau kenduri secara sukarela.',
    },
    pancasilaValue: 'Inklusivitas Kota Metropolitan dan Keramahan Sosial (Sila 2 & Sila 3)',
  },
  {
    id: 'jabar',
    name: 'Jawa Barat',
    island: 'Jawa',
    capital: 'Bandung',
    traditionalHouse: 'Rumah Julang Ngapak',
    dance: 'Tari Jaipong',
    gotongRoyongWisdom: {
      term: 'Liliuran / Rereongan',
      description: 'Bekerja bersama-sama saling bergiliran untuk meringankan beban sesama warga kampung.',
    },
    pancasilaValue: 'Silih Asih, Silih Asah, Silih Asuh (Sila 2)',
  },
  {
    id: 'jateng',
    name: 'Jawa Tengah & DIY',
    island: 'Jawa',
    capital: 'Semarang & Yogyakarta',
    traditionalHouse: 'Rumah Joglo',
    dance: 'Tari Gambyong & Tari Bedhaya',
    gotongRoyongWisdom: {
      term: 'Sambatan & Gugur Gunung',
      description: 'Warga desa berbondong-bondong memperbaiki saluran irigasi, jembatan, dan rumah warga kurang mampu.',
    },
    pancasilaValue: 'Gotong Royong Murni dan Guyub Rukun (Sila 3 & Sila 5)',
  },
  {
    id: 'bali',
    name: 'Bali',
    island: 'Bali & Nusa Tenggara',
    capital: 'Denpasar',
    traditionalHouse: 'Rumah Gapura Candi Bentar',
    dance: 'Tari Kecak & Tari Pendet',
    gotongRoyongWisdom: {
      term: 'Subak & Ngayah',
      description: 'Sistem pembagian air yang adil dan kerja bakti ikhlas berlandaskan filosofi keharmonisan Tri Hita Karana.',
    },
    pancasilaValue: 'Keseimbangan Alam, Manusia, dan Ketuhanan (Sila 1, 2, 5)',
  },
  {
    id: 'kalsel',
    name: 'Kalimantan Selatan',
    island: 'Kalimantan',
    capital: 'Banjarmasin',
    traditionalHouse: 'Rumah Bubungan Tinggi',
    dance: 'Tari Baksa Kembang',
    gotongRoyongWisdom: {
      term: 'Kayuh Baimbai',
      description: 'Mendayung perahu bersama-sama menyusuri sungai, menyimbolkan kebersamaan mencapai tujuan bersama.',
    },
    pancasilaValue: 'Satu Semangat Membangun Daerah (Sila 3)',
  },
  {
    id: 'sulut',
    name: 'Sulawesi Utara',
    island: 'Sulawesi',
    capital: 'Manado',
    traditionalHouse: 'Rumah Pewaris (Walewangko)',
    dance: 'Tari Maengket',
    gotongRoyongWisdom: {
      term: 'Mapalus',
      description: 'Falsafah gotong royong terorganisir suku Minahasa yang meliputi tolong menolong tenaga, duka, dan sukacita.',
    },
    pancasilaValue: 'Torang Samua Basudara - Kita Semua Bersaudara (Sila 2 & Sila 3)',
  },
  {
    id: 'papua',
    name: 'Papua',
    island: 'Papua',
    capital: 'Jayapura',
    traditionalHouse: 'Rumah Honai',
    dance: 'Tari Sajojo & Tari Yospan',
    gotongRoyongWisdom: {
      term: 'Bakar Batu (Barapen)',
      description: 'Ritual memasak bersama sebagai tanda perdamaian, kebersamaan, dan ucapan syukur antarsuku.',
    },
    pancasilaValue: 'Rekonsiliasi Damai dan Persaudaraan Sejati (Sila 3 & Sila 5)',
  },
];
