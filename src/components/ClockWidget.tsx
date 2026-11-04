import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Sparkles,
  Globe,
  Bell,
  Compass,
  CheckCircle2,
  CalendarDays,
  Timer
} from 'lucide-react';

interface ClockWidgetProps {
  variant?: 'compact' | 'full' | 'header';
  className?: string;
  onExploreCalendar?: () => void;
}

interface NationalDay {
  name: string;
  dateStr: string; // MM-DD
  desc: string;
  silaRelasi: string;
}

const NATIONAL_DAYS: NationalDay[] = [
  { name: 'Hari Pendidikan Nasional', dateStr: '05-02', desc: 'Mengingat jasa Ki Hadjar Dewantara dalam memajukan budi pekerti bangsa.', silaRelasi: 'Sila ke-2 & ke-5' },
  { name: 'Hari Kebangkitan Nasional', dateStr: '05-20', desc: 'Lahirnya Boedi Oetomo memperkuat persatuan dan kesatuan bangsa.', silaRelasi: 'Sila ke-3 Persatuan Indonesia' },
  { name: 'Hari Lahir Pancasila', dateStr: '06-01', desc: 'Pidato bersejarah Ir. Soekarno 1 Juni 1945 merumuskan dasar negara.', silaRelasi: 'Inti Seluruh Sila Pancasila' },
  { name: 'Hari Kemerdekaan Republik Indonesia', dateStr: '08-17', desc: 'Proklamasi Kemerdekaan 17 Agustus 1945 oleh Soekarno-Hatta.', silaRelasi: 'Kedaulatan & Kemerdekaan Bangsa' },
  { name: 'Hari Kesaktian Pancasila', dateStr: '10-01', desc: 'Peringatan keteguhan ideologi Pancasila sebagai falsafah hidup bangsa.', silaRelasi: 'Ketahanan Ideologi Pancasila' },
  { name: 'Hari Sumpah Pemuda', dateStr: '10-28', desc: 'Satu Nusa, Satu Bangsa, Satu Bahasa Indonesia sejak 1928.', silaRelasi: 'Sila ke-3 Persatuan Indonesia' },
  { name: 'Hari Pahlawan Nasional', dateStr: '11-10', desc: 'Mengenang pertempuran Surabaya 10 November 1945 demi martabat NKRI.', silaRelasi: 'Sila ke-2, ke-3, & ke-5' },
  { name: 'Hari Bela Negara', dateStr: '12-19', desc: 'Deklarasi Pemerintah Darurat Republik Indonesia (PDRI) di Sumatera Barat.', silaRelasi: 'Cinta Tanah Air & Bela Negara' },
  { name: 'Hari Hak Asasi Manusia (HAM)', dateStr: '12-10', desc: 'Peringatan nilai kemanusiaan yang adil dan beradab.', silaRelasi: 'Sila ke-2 Kemanusiaan' },
];

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  variant = 'compact',
  className = '',
  onExploreCalendar,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState<'WIB' | 'WITA' | 'WIT'>('WIB');
  const [clockMode, setClockMode] = useState<'digital' | 'analog'>('digital');
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute timezone adjusted time
  const getTimeInZone = (zone: 'WIB' | 'WITA' | 'WIT') => {
    // Current UTC time + offset
    // Indonesia: WIB = UTC+7, WITA = UTC+8, WIT = UTC+9
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const offset = zone === 'WIB' ? 7 : zone === 'WITA' ? 8 : 9;
    return new Date(utc + 3600000 * offset);
  };

  const targetDate = getTimeInZone(selectedTimeZone);
  const hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const seconds = targetDate.getSeconds();

  // Greeting logic
  const getGreeting = (h: number) => {
    if (h >= 4 && h < 11) return { text: 'Selamat Pagi', icon: Sunrise, color: 'text-amber-500', badge: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (h >= 11 && h < 15) return { text: 'Selamat Siang', icon: Sun, color: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (h >= 15 && h < 18) return { text: 'Selamat Sore', icon: Sunset, color: 'text-orange-500', badge: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { text: 'Selamat Malam', icon: Moon, color: 'text-indigo-400', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
  };

  const greeting = getGreeting(hours);

  // Formatting strings in Bahasa Indonesia
  const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(targetDate);
  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(targetDate);

  const padZero = (n: number) => n.toString().padStart(2, '0');
  const timeString = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

  // School Learning status
  const getSchoolScheduleStatus = (h: number, m: number, d: number) => {
    // 0 = Sunday, 6 = Saturday
    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        label: 'Libur Akhir Pekan',
        sub: 'Eksplorasi Belajar Mandiri & Pengayaan Nilai Pancasila',
        active: false,
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
      };
    }
    const currentMin = h * 60 + m;
    if (currentMin >= 7 * 60 && currentMin <= 15 * 60 + 30) {
      return {
        label: 'Jam KBM Aktif SMANDE',
        sub: 'Waktu Pembelajaran Efektif di SMA Negeri 1 Mande',
        active: true,
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (currentMin > 15 * 60 + 30 && currentMin <= 21 * 60) {
      return {
        label: 'Waktu Belajar Mandiri',
        sub: 'Mengerjakan Asesmen, Tugas & Membaca Modul E-Library',
        active: false,
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    }
    return {
      label: 'Waktu Relaksasi & Istirahat',
      sub: 'Persiapkan energi untuk esok hari belajar berkarakter Pancasila',
      active: false,
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    };
  };

  const schoolStatus = getSchoolScheduleStatus(hours, minutes, targetDate.getDay());

  // Nearest National Commemoration Day
  const getNearestNationalDay = () => {
    const curYear = targetDate.getFullYear();
    const curTime = targetDate.getTime();

    const upcoming = NATIONAL_DAYS.map((item) => {
      const [m, d] = item.dateStr.split('-').map(Number);
      let eventDate = new Date(curYear, m - 1, d, 0, 0, 0);
      if (eventDate.getTime() < curTime - 86400000) {
        eventDate = new Date(curYear + 1, m - 1, d, 0, 0, 0);
      }
      const diffDays = Math.ceil((eventDate.getTime() - curTime) / (1000 * 60 * 60 * 24));
      return { ...item, eventDate, diffDays };
    }).sort((a, b) => a.diffDays - b.diffDays);

    return upcoming[0];
  };

  const nearestDay = getNearestNationalDay();

  // If used in the top header ribbon
  if (variant === 'header') {
    return (
      <div
        onClick={() => setShowDetailModal(true)}
        className={`flex items-center gap-2 px-3 py-1 bg-sky-700/80 hover:bg-sky-700 text-white rounded-xl text-xs border border-sky-400/50 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group ${className}`}
        title="Klik untuk melihat Jam, Tanggal & Kalender Pancasila Lengkap"
      >
        <div className="relative flex items-center justify-center">
          <Clock size={14} className="text-amber-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sky-100 hidden sm:inline">{dayName},</span>
          <span className="font-extrabold text-white tracking-wide font-mono bg-sky-900/60 px-1.5 py-0.5 rounded text-[11px] border border-sky-500/40">
            {timeString}
          </span>
          <span className="text-[10px] text-amber-300 font-bold">{selectedTimeZone}</span>
        </div>
      </div>
    );
  }

  // If used as compact bar widget (e.g. above main content or beside running text)
  if (variant === 'compact') {
    const GreetingIcon = greeting.icon;
    return (
      <>
        <div
          onClick={() => setShowDetailModal(true)}
          className={`bg-white/95 backdrop-blur-md border border-sky-200 hover:border-sky-400 shadow-md hover:shadow-lg rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 cursor-pointer transition-all group ${className}`}
        >
          {/* Day & Date with Greeting */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Calendar size={22} className="text-sky-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800 text-sm md:text-base capitalize">
                  {dayName}, {dateFormatted}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${greeting.badge}`}>
                  <GreetingIcon size={12} className={greeting.color} />
                  <span>{greeting.text}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Waktu Real-time Pembelajaran SMANDE Cianjur</span>
              </p>
            </div>
          </div>

          {/* Time & Timezone Pill */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {/* School Status Pill */}
            <div className={`hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${schoolStatus.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${schoolStatus.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{schoolStatus.label}</span>
            </div>

            {/* Glowing Digital Time */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-sky-900 to-slate-900 text-white px-3.5 py-1.5 rounded-xl shadow-inner border border-sky-800/80">
              <Clock size={16} className="text-amber-300 animate-spin-slow" />
              <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]">
                {timeString}
              </span>
              <span className="text-[11px] bg-sky-700/80 px-1.5 py-0.5 rounded font-extrabold text-sky-200 border border-sky-500/30">
                {selectedTimeZone}
              </span>
            </div>
          </div>
        </div>

        {/* Modal if clicked */}
        {showDetailModal && renderDetailModal()}
      </>
    );
  }

  // Full Rich Showcase Widget (for Beranda hero/sub-hero showcase)
  const GreetingIcon = greeting.icon;

  function renderDetailModal() {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  Waktu & Kalender Pendidikan Pancasila
                </h3>
                <p className="text-xs text-slate-500">
                  SMA Negeri 1 Mande • Cianjur, Jawa Barat (Zona WIB)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Time Display Showcase */}
          <div className="bg-gradient-to-br from-sky-900 via-slate-900 to-sky-950 text-white rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-xl border border-sky-800">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
              <GreetingIcon size={14} />
              <span>{greeting.text} Pelajar Pancasila!</span>
            </div>

            <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">
              {timeString}
            </div>

            <p className="text-sm font-semibold text-sky-200">
              {dayName}, {dateFormatted} ({selectedTimeZone})
            </p>

            {/* Timezone Switcher buttons */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <span className="text-xs text-sky-300 font-medium">Pilih Zona Waktu Indonesia:</span>
              {(['WIB', 'WITA', 'WIT'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedTimeZone(zone)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    selectedTimeZone === zone
                      ? 'bg-amber-400 text-sky-950 shadow-md shadow-amber-400/30 scale-105'
                      : 'bg-sky-800/80 text-sky-200 hover:bg-sky-700'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Indonesian Time Zones Explanation (Wawasan Nusantara / Pendidikan Pancasila) */}
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
              <Compass size={16} className="text-sky-600" />
              <span>Wawasan Nusantara: 3 Zona Waktu Indonesia</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className={`p-2.5 rounded-xl border ${selectedTimeZone === 'WIB' ? 'bg-white border-sky-400 shadow-sm' : 'bg-sky-100/60 border-sky-200'}`}>
                <div className="font-extrabold text-sky-900">WIB (UTC+7)</div>
                <div className="text-slate-600 mt-0.5">Sumatera, Jawa (SMANDE Cianjur), Madura, Kalbar, Kalteng.</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${selectedTimeZone === 'WITA' ? 'bg-white border-sky-400 shadow-sm' : 'bg-sky-100/60 border-sky-200'}`}>
                <div className="font-extrabold text-sky-900">WITA (UTC+8)</div>
                <div className="text-slate-600 mt-0.5">Bali, NTB, NTT, Kalsel, Kaltim, Kaltara, Sulawesi.</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${selectedTimeZone === 'WIT' ? 'bg-white border-sky-400 shadow-sm' : 'bg-sky-100/60 border-sky-200'}`}>
                <div className="font-extrabold text-sky-900">WIT (UTC+9)</div>
                <div className="text-slate-600 mt-0.5">Maluku, Maluku Utara, Papua & seluruh provinsi Papua.</div>
              </div>
            </div>
          </div>

          {/* Nearest National Commemoration */}
          {nearestDay && (
            <div className="bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-2xl p-4 border border-red-200 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                    Hari Bersejarah Terdekat
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {nearestDay.diffDays === 0
                      ? '🎉 Hari Ini!'
                      : `${nearestDay.diffDays} hari lagi`}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {nearestDay.name}
                </h4>
                <p className="text-xs text-slate-600">{nearestDay.desc}</p>
                <div className="text-[11px] text-sky-700 font-bold">
                  Refleksi: {nearestDay.silaRelasi}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 text-red-600 flex items-center justify-center font-black text-lg shrink-0">
                🇮🇩
              </div>
            </div>
          )}

          {/* Action Close */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Tutup Jendela Jam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl p-5 md:p-6 shadow-xl border border-sky-200/80 relative overflow-hidden transition-all ${className}`}
    >
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/80 via-blue-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

      {/* Header Row: Label & Timezone Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-500/25">
            <Clock size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                Jam & Kalender Pendidikan Pancasila
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              SMA Negeri 1 Mande • Guru Pengampu: Munawar Rois, S.Pd.
            </p>
          </div>
        </div>

        {/* Controls: Mode Switcher & Zone Switcher */}
        <div className="flex items-center gap-2">
          {/* Digital / Analog Toggle */}
          <button
            onClick={() => setClockMode(clockMode === 'digital' ? 'analog' : 'digital')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
            title="Ubah Tampilan Jam (Digital / Analog)"
          >
            <Timer size={14} />
            <span className="hidden sm:inline capitalize">{clockMode === 'digital' ? 'Mode Analog' : 'Mode Digital'}</span>
          </button>

          {/* Timezone Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-extrabold text-slate-600 border border-slate-200">
            {(['WIB', 'WITA', 'WIT'] as const).map((z) => (
              <button
                key={z}
                onClick={() => setSelectedTimeZone(z)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedTimeZone === z
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Clock & Date & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 relative z-10">
        {/* Left Col: Digital or Analog Clock Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-sky-800/80 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow circle */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-sky-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl" />

          {/* Greeting & Day Pill */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${greeting.badge}`}>
              <GreetingIcon size={14} className={greeting.color} />
              <span>{greeting.text}, Generasi Emas!</span>
            </span>

            <span className="text-xs text-sky-300 font-semibold flex items-center gap-1">
              <Globe size={13} className="text-sky-400" />
              <span>Zona: {selectedTimeZone} (UTC+{selectedTimeZone === 'WIB' ? 7 : selectedTimeZone === 'WITA' ? 8 : 9})</span>
            </span>
          </div>

          {/* Clock Display */}
          {clockMode === 'digital' ? (
            <div className="my-5 text-center relative z-10">
              <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_0_20px_rgba(252,211,77,0.45)]">
                {timeString}
              </div>
              <div className="mt-2 text-sky-200 text-sm md:text-base font-bold tracking-wide">
                Detik Berdetak • <span className="text-amber-300">{selectedTimeZone}</span>
              </div>
            </div>
          ) : (
            /* Analog Clock Representation */
            <div className="my-4 flex flex-col items-center justify-center relative z-10">
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-amber-400/80 bg-slate-900/90 shadow-2xl relative flex items-center justify-center">
                {/* 12, 3, 6, 9 Markers */}
                <span className="absolute top-2 text-xs font-black text-amber-300">12</span>
                <span className="absolute right-2 text-xs font-black text-amber-300">3</span>
                <span className="absolute bottom-2 text-xs font-black text-amber-300">6</span>
                <span className="absolute left-2 text-xs font-black text-amber-300">9</span>

                {/* Center Pivot */}
                <div className="w-3 h-3 bg-amber-400 rounded-full z-30 shadow-md" />

                {/* Hour Hand */}
                <div
                  className="absolute w-1.5 h-12 bg-white rounded-full origin-bottom z-10"
                  style={{
                    transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`,
                    bottom: '50%',
                  }}
                />

                {/* Minute Hand */}
                <div
                  className="absolute w-1 h-16 bg-sky-300 rounded-full origin-bottom z-20"
                  style={{
                    transform: `rotate(${minutes * 6}deg)`,
                    bottom: '50%',
                  }}
                />

                {/* Second Hand */}
                <div
                  className="absolute w-0.5 h-18 bg-amber-400 rounded-full origin-bottom z-20"
                  style={{
                    transform: `rotate(${seconds * 6}deg)`,
                    bottom: '50%',
                  }}
                />
              </div>
              <div className="mt-3 font-mono text-xl font-black text-amber-300">
                {timeString} {selectedTimeZone}
              </div>
            </div>
          )}

          {/* Bottom Card Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-sky-900/60 text-xs text-sky-300/80 relative z-10">
            <span className="font-semibold capitalize text-sky-100">
              🗓️ {dayName}, {dateFormatted}
            </span>
            <button
              onClick={() => setShowDetailModal(true)}
              className="text-amber-300 hover:text-amber-200 underline font-bold"
            >
              Lihat Detail & Wawasan ↗
            </button>
          </div>
        </div>

        {/* Right Col: Date Card, SMANDE School Schedule & Pancasila Days (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          {/* Complete Date & Calendar Box */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 rounded-2xl p-4 border border-sky-200/90 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs uppercase tracking-wider">
              <CalendarDays size={16} className="text-sky-600" />
              <span>Hari & Tanggal Resmi</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-slate-800">
              {dayName}
            </div>
            <div className="text-sm md:text-base font-extrabold text-sky-700">
              {dateFormatted}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Tahun Ajaran 2025/2026 • Kurikulum Merdeka Fase E & F
            </p>
          </div>

          {/* School Schedule Status */}
          <div className={`rounded-2xl p-4 border shadow-sm space-y-1.5 ${schoolStatus.badgeClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${schoolStatus.active ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                {schoolStatus.label}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70">
                SMANDE Cianjur
              </span>
            </div>
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {schoolStatus.sub}
            </p>
          </div>

          {/* Nearest National Commemoration */}
          {nearestDay && (
            <div className="bg-gradient-to-r from-red-50 to-amber-50/80 rounded-2xl p-4 border border-red-200 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-red-700">
                  <Sparkles size={14} className="text-red-500" />
                  <span>Agenda Pancasila Terdekat</span>
                </div>
                <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                  {nearestDay.diffDays === 0
                    ? 'Hari Ini!'
                    : `${nearestDay.diffDays} Hari Lagi`}
                </span>
              </div>
              <div className="font-extrabold text-slate-800 text-sm">
                {nearestDay.name}
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                {nearestDay.desc}
              </p>
            </div>
          )}
        </div>
      </div>

      {showDetailModal && renderDetailModal()}
    </div>
  );
};
