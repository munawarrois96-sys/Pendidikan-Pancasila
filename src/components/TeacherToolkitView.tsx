import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { defaultStudents, getStoredStudents } from '../utils/userStore';
import { sound } from '../utils/audio';
import {
  Clock,
  Shuffle,
  Users,
  UserCheck,
  Sparkles,
  Calculator,
  Percent,
  Camera,
  CheckSquare,
  Calendar,
  Download,
  Printer,
  Copy,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize,
  Minimize,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  Upload,
  FileText,
  Award,
  Sliders,
  Wrench,
  HelpCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface TeacherToolkitProps {
  students?: UserProfile[];
}

export const TeacherToolkitView: React.FC<TeacherToolkitProps> = ({ students: propStudents }) => {
  const [activeTool, setActiveTool] = useState<
    'timer' | 'acakNama' | 'kelompok' | 'pasangan' | 'iceBreaking' | 'konversi' | 'kalkulator' | 'scanDokumen' | 'ljkScanner' | 'jadwal'
  >('timer');

  const studentsList = propStudents && propStudents.length > 0 ? propStudents : getStoredStudents();

  // ================= 1. TIMER DISKUSI STATE =================
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins default
  const [timerInitial, setTimerInitial] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [discussionTopic, setDiscussionTopic] = useState('Diskusikan Penerapan Nilai Pancasila dalam Kehidupan di SMANDE');
  const [isFullscreenTimer, setIsFullscreenTimer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsTimerRunning(false);
            sound.playVictory();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    sound.playClick();
    if (timerSeconds === 0) {
      setTimerSeconds(timerInitial);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
  };

  const handleResetTimer = (seconds?: number) => {
    sound.playClick();
    setIsTimerRunning(false);
    const target = seconds !== undefined ? seconds : timerInitial;
    setTimerSeconds(target);
    if (seconds !== undefined) setTimerInitial(seconds);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ================= 2. ACAK NAMA (RANDOM STUDENT PICKER) STATE =================
  const [namePoolType, setNamePoolType] = useState<'registered' | 'custom'>('registered');
  const [customNamesText, setCustomNamesText] = useState(
    'Rafi Ahmad\nSiti Nurhaliza\nBudi Santoso\nAnisa Rahmawati\nDimas Arya\nFarhan Fauzi\nNabila Putri\nReza Pratama'
  );
  const [removePickedName, setRemovePickedName] = useState(true);
  const [isPickingName, setIsPickingName] = useState(false);
  const [pickedStudent, setPickedStudent] = useState<string | null>(null);
  const [pickedHistory, setPickedHistory] = useState<string[]>([]);
  const [activePool, setActivePool] = useState<string[]>([]);

  useEffect(() => {
    if (namePoolType === 'registered') {
      setActivePool(studentsList.map((s) => s.name));
    } else {
      const parsed = customNamesText
        .split('\n')
        .map((n) => n.trim())
        .filter(Boolean);
      setActivePool(parsed);
    }
  }, [namePoolType, customNamesText, studentsList]);

  const handlePickRandomStudent = () => {
    if (activePool.length === 0) return;
    sound.playClick();
    setIsPickingName(true);
    setPickedStudent(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * activePool.length);
      setPickedStudent(activePool[randomIdx]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * activePool.length);
        const winner = activePool[finalIdx];
        setPickedStudent(winner);
        setIsPickingName(false);
        sound.playVictory();
        setPickedHistory((prev) => [winner, ...prev]);

        if (removePickedName) {
          setActivePool((prev) => prev.filter((_, idx) => idx !== finalIdx));
        }
      }
    }, 100);
  };

  // ================= 3. BAGI KELOMPOK STATE =================
  const [groupDivisionMode, setGroupDivisionMode] = useState<'byGroupCount' | 'byMemberCount'>('byGroupCount');
  const [groupCountParam, setGroupCountParam] = useState(4);
  const [groupTheme, setGroupTheme] = useState<'pancasila' | 'angka'>('pancasila');
  const [generatedGroups, setGeneratedGroups] = useState<{ name: string; members: string[] }[]>([]);
  const [copiedGroupToast, setCopiedGroupToast] = useState(false);

  const handleGenerateGroups = () => {
    sound.playCorrect();
    const pool = [...activePool].sort(() => Math.random() - 0.5);
    const total = pool.length;
    if (total === 0) return;

    let numGroups = groupCountParam;
    if (groupDivisionMode === 'byMemberCount') {
      numGroups = Math.max(1, Math.ceil(total / groupCountParam));
    }

    const pancasilaNames = [
      'Kelompok Sila 1: Bintang Ketuhanan',
      'Kelompok Sila 2: Rantai Kemanusiaan',
      'Kelompok Sila 3: Pohon Beringin Persatuan',
      'Kelompok Sila 4: Kepala Banteng Kerakyatan',
      'Kelompok Sila 5: Padi & Kapas Keadilan',
      'Kelompok 6: Garuda Pancasila',
      'Kelompok 7: Bhinneka Tunggal Ika',
      'Kelompok 8: UUD NRI 1945',
    ];

    const groups: { name: string; members: string[] }[] = [];
    for (let i = 0; i < numGroups; i++) {
      const groupTitle =
        groupTheme === 'pancasila'
          ? pancasilaNames[i] || `Kelompok Pancasila ${i + 1}`
          : `Kelompok ${i + 1}`;
      groups.push({ name: groupTitle, members: [] });
    }

    pool.forEach((member, idx) => {
      groups[idx % numGroups].members.push(member);
    });

    setGeneratedGroups(groups);
  };

  const handleCopyGroups = () => {
    sound.playClick();
    const text = generatedGroups
      .map((g) => `📌 *${g.name}*\n` + g.members.map((m, i) => `  ${i + 1}. ${m}`).join('\n'))
      .join('\n\n');
    navigator.clipboard.writeText(`🇮🇩 DAFTAR KELOMPOK DISKUSI PENDIDIKAN PANCASILA SMANDE\n\n${text}`);
    setCopiedGroupToast(true);
    setTimeout(() => setCopiedGroupToast(false), 2500);
  };

  // ================= 4. PASANGAN ACAK STATE =================
  const [generatedPairs, setGeneratedPairs] = useState<{ roleA: string; roleB: string; topic: string }[]>([]);
  const pairTopics = [
    'Debat: Hak Asasi vs Kewajiban Asasi dalam UUD 1945',
    'Studi Kasus: Musyawarah mufakat di lingkungan OSIS',
    'Analisis: Menangkal bahaya intoleransi dan hoaks',
    'Refleksi: Perilaku gotong royong di masyarakat desa Mande',
    'Simulasi: Penegakan hukum yang adil dan transparan',
  ];

  const handleGeneratePairs = () => {
    sound.playCorrect();
    const pool = [...activePool].sort(() => Math.random() - 0.5);
    const pairs: { roleA: string; roleB: string; topic: string }[] = [];

    for (let i = 0; i < pool.length; i += 2) {
      if (i + 1 < pool.length) {
        pairs.push({
          roleA: pool[i],
          roleB: pool[i + 1],
          topic: pairTopics[pairs.length % pairTopics.length],
        });
      } else {
        // Odd student attached as trio to last pair
        if (pairs.length > 0) {
          pairs[pairs.length - 1].roleB += ` & ${pool[i]}`;
        } else {
          pairs.push({
            roleA: pool[i],
            roleB: 'Mandiri / Rekan Pengamat',
            topic: pairTopics[0],
          });
        }
      }
    }
    setGeneratedPairs(pairs);
  };

  // ================= 5. ICE BREAKING STATE =================
  const iceBreakingActivities = [
    {
      id: 'tebak-tokoh',
      title: '🦅 Tebak Tokoh & Nilai Pancasila',
      desc: 'Guru menampilkan petunjuk satu per satu, siswa menebak siapa tokoh perumus atau sila ke berapa yang dimaksud.',
      duration: '5 - 10 Menit',
      clues: [
        'Petunjuk 1: Lahir di Blitar, Jawa Timur, berpidato pada 1 Juni 1945 memperkenalkan istilah Pancasila.',
        'Petunjuk 2: Mengusulkan Tri Sila (Sosio-nasionalisme, Sosio-demokrasi, Ketuhanan) dan Eka Sila (Gotong Royong).',
        'Jawaban: Ir. Soekarno (Bung Karno)!',
      ],
    },
    {
      id: 'sambung-kata',
      title: '⛓️ Sambung Kata Karakter Pelajar Pancasila',
      desc: 'Siswa pertama menyebutkan satu nilai luhur (misal: "Jujur"), siswa berikutnya menyebutkan kata baru dari huruf terakhir ("Rela Berkorban" -> N -> "Nasionalisme").',
      duration: '5 Menit',
      clues: ['Aturan: Waktu tiap siswa maksimal 7 detik!', 'Jika lewat atau mengulang kata, berikan tepuk tangan semangat!'],
    },
    {
      id: 'garuda-berkata',
      title: '👑 Garuda Berkata (Simon Says Pancasila)',
      desc: 'Siswa hanya boleh bergerak jika diawali ucapan "Garuda Berkata!". Melatih konsentrasi, kekompakan, dan kebugaran di kelas.',
      duration: '3 - 5 Menit',
      clues: [
        '"Garuda Berkata: Letakkan tangan kanan di dada kiri untuk sumpah setia Pancasila!"',
        '"Garuda Berkata: Tepuk tangan 3 kali untuk persatuan Indonesia!"',
        '"Angkat kedua tangan!" (Jebakan: jangan lakukan karena tidak ada kata Garuda Berkata!)',
      ],
    },
    {
      id: 'mitos-fakta',
      title: '🔍 Mitos vs Fakta Kebangsaan',
      desc: 'Guru membacakan pernyataan, siswa berdiri jika "Fakta" dan duduk jika "Mitos".',
      duration: '5 Menit',
      clues: [
        'Pernyataan 1: Tanggal 1 Juni ditetapkan sebagai Hari Lahir Pancasila melalui Keppres No. 24 Tahun 2016. (FAKTA)',
        'Pernyataan 2: Lambang kepala banteng melambangkan hewan buas yang tak terkalahkan. (MITOS - Banteng melambangkan hewan sosial yang suka berkumpul/bermusyawarah)',
        'Pernyataan 3: Jumlah bulu leher Garuda Pancasila berjumlah 45 helai. (FAKTA - Melambangkan tahun 1945)',
      ],
    },
  ];
  const [selectedIceBreak, setSelectedIceBreak] = useState(iceBreakingActivities[0]);

  // ================= 6. KONVERSI NILAI STATE =================
  const [inputRawScore, setInputRawScore] = useState(85);
  const [bulkScoresInput, setBulkScoresInput] = useState('92, 85, 78, 96, 68, 74, 88, 90, 82, 70');

  const convertScore = (val: number) => {
    let predikat = 'E';
    let gpa = 1.0;
    let kktpStatus = 'Perlu Bimbingan';
    let deskripsi = 'Perlu penguatan mendasar dalam memahami konsep nilai-nilai Pancasila.';

    if (val >= 90) {
      predikat = 'A';
      gpa = 4.0;
      kktpStatus = 'Sangat Baik (Terlampaui)';
      deskripsi = 'Sangat mahir dan konsisten dalam menerapkan nilai Pancasila serta penalaran kritis UUD 1945.';
    } else if (val >= 80) {
      predikat = 'B+ / B';
      gpa = 3.3;
      kktpStatus = 'Baik (Mencapai KKTP)';
      deskripsi = 'Mencapai target pembelajaran dengan baik, mampu menganalisis norma hukum dan kebinekaan.';
    } else if (val >= 75) {
      predikat = 'B- / C+';
      gpa = 2.7;
      kktpStatus = 'Tuntas KKTP';
      deskripsi = 'Mencapai ketuntasan minimal, menunjukkan pemahaman yang cukup tentang pilar kebangsaan.';
    } else if (val >= 65) {
      predikat = 'C';
      gpa = 2.0;
      kktpStatus = 'Cukup (Perlu Penguatan)';
      deskripsi = 'Membutuhkan pengayaan pada submateri hierarki perundang-undangan dan gotong royong.';
    }

    return { val, predikat, gpa, kktpStatus, deskripsi };
  };

  // ================= 7. KALKULATOR NILAI STATE =================
  const [calcFormatif, setCalcFormatif] = useState(85);
  const [calcSumatif, setCalcSumatif] = useState(82);
  const [calcSts, setCalcSts] = useState(80);
  const [calcSas, setCalcSas] = useState(88);
  const [weightFormatif, setWeightFormatif] = useState(30);
  const [weightSumatif, setWeightSumatif] = useState(30);
  const [weightSts, setWeightSts] = useState(20);
  const [weightSas, setWeightSas] = useState(20);

  const finalCalcScore = Math.round(
    (calcFormatif * weightFormatif +
      calcSumatif * weightSumatif +
      calcSts * weightSts +
      calcSas * weightSas) /
      100
  );

  // ================= 8. SCAN DOKUMEN STATE =================
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanFilter, setScanFilter] = useState<'normal' | 'bw' | 'contrast' | 'sepia'>('normal');
  const [scanRotation, setScanRotation] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      alert('Kamera tidak dapat diakses atau izin ditolak. Silakan gunakan tombol Unggah Foto Dokumen.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      sound.playClick();
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 800;
      canvas.height = videoRef.current.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setScanImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playClick();
      const reader = new FileReader();
      reader.onload = () => {
        setScanImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= 9. LJK SCANNER STATE =================
  const defaultAnswerKey = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'];
  const [answerKey, setAnswerKey] = useState<string[]>(defaultAnswerKey);
  const [scannedStudentName, setScannedStudentName] = useState('Rafi Ahmad Pratama');
  const [scannedAnswers, setScannedAnswers] = useState<string[]>(['A', 'B', 'C', 'C', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'A', 'C', 'D', 'A', 'B', 'C', 'D']);
  const [isLjkGraded, setIsLjkGraded] = useState(false);
  const [gradedHistory, setGradedHistory] = useState<
    { name: string; correct: number; total: number; score: number; time: string }[]
  >([
    { name: 'Siti Nurhaliza', correct: 19, total: 20, score: 95, time: '10:15 WIB' },
    { name: 'Budi Santoso', correct: 16, total: 20, score: 80, time: '10:18 WIB' },
  ]);

  const handleGradeLjk = () => {
    sound.playVictory();
    setIsLjkGraded(true);
    let correct = 0;
    answerKey.forEach((ans, idx) => {
      if (scannedAnswers[idx] === ans) correct++;
    });
    const score = Math.round((correct / answerKey.length) * 100);

    const record = {
      name: scannedStudentName,
      correct,
      total: answerKey.length,
      score,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setGradedHistory([record, ...gradedHistory]);
  };

  const handleSimulateRandomScan = () => {
    sound.playClick();
    const options = ['A', 'B', 'C', 'D'];
    const sim = answerKey.map((key) => {
      // 85% chance of matching answer key
      return Math.random() < 0.85 ? key : options[Math.floor(Math.random() * options.length)];
    });
    setScannedAnswers(sim);
    setIsLjkGraded(false);
  };

  // ================= 10. JADWAL OTOMATIS STATE =================
  const [scheduleClasses, setScheduleClasses] = useState(['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-MIPA 1', 'XII-IPS 1']);
  const [generatedSchedule, setGeneratedSchedule] = useState<
    { day: string; periods: { time: string; subject: string; classRoom: string }[] }[]
  >([]);

  const handleGenerateSchedule = () => {
    sound.playCorrect();
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const times = [
      '07.30 - 09.00 (JP 1-2)',
      '09.15 - 10.45 (JP 3-4)',
      '11.00 - 12.30 (JP 5-6)',
      '13.15 - 14.45 (JP 7-8)',
    ];

    let classIdx = 0;
    const schedule = days.map((day) => {
      const periods = times.map((time, pIdx) => {
        // Leave some periods for prep or other tasks
        if ((day === 'Senin' && pIdx === 0) || (day === 'Jumat' && pIdx === 3)) {
          return {
            time,
            subject: day === 'Senin' ? '🇮🇩 Upacara Bendera' : '🕌 Sholat Jumat & Karakter',
            classRoom: 'Lapangan / Masjid',
          };
        }
        const assignedClass = scheduleClasses[classIdx % scheduleClasses.length];
        classIdx++;
        return {
          time,
          subject: 'Pendidikan Pancasila',
          classRoom: `Kelas ${assignedClass}`,
        };
      });
      return { day, periods };
    });

    setGeneratedSchedule(schedule);
  };

  useEffect(() => {
    if (generatedSchedule.length === 0) {
      handleGenerateSchedule();
    }
  }, []);

  // Tool listing definitions
  const toolsList = [
    { id: 'timer', label: '⏱ Timer Diskusi', desc: 'Hitung mundur interaktif & layar penuh proyektor' },
    { id: 'acakNama', label: '🎲 Acak Nama', desc: 'Pemilih siswa acak dengan animasi roda berputar' },
    { id: 'kelompok', label: '👥 Bagi Kelompok', desc: 'Generator pembagi kelompok diskusi otomatis' },
    { id: 'pasangan', label: '🤝 Pasangan Acak', desc: 'Think-pair-share & pasangan tutor sebaya' },
    { id: 'iceBreaking', label: '🎉 Ice Breaking', desc: 'Game cairkan suasana kelas bertema Pancasila' },
    { id: 'konversi', label: '🔢 Konversi Nilai', desc: 'Konversi angka ke predikat & deskripsi TP Rapor' },
    { id: 'kalkulator', label: '🧮 Kalkulator Nilai', desc: 'Hitung NA formatif, sumatif, STS, SAS & KKTP' },
    { id: 'scanDokumen', label: '📄 Scan Dokumen', desc: 'Pindai tugas siswa lewat kamera/upload & filter B/W' },
    { id: 'ljkScanner', label: '📝 LJK Scanner', desc: 'Koreksi instan lembar jawaban pilihan ganda' },
    { id: 'jadwal', label: '🗓 Jadwal Otomatis', desc: 'Susun jadwal mengajar mingguan bebas bentrok' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-400/60 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-amber-300 text-xs font-black">
            <Wrench size={14} />
            <span>TOOL GURU SMANDE • 10 ALAT BANTU MENGAJAR GRATIS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Kotak Perkakas Guru Pendidikan Pancasila
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            Kumpulan 10 utilitas interaktif untuk mendukung proses belajar-mengajar aktif Bapak <b>Munawar Rois, S.Pd.</b> di kelas: timer diskusi, pemilih nama acak, pembagi kelompok, scanner dokumen, korektor LJK, hingga generator jadwal otomatis.
          </p>
        </div>

        <div className="z-10 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
          <span className="text-[11px] text-sky-100 uppercase tracking-wider font-bold block">Siswa Aktif</span>
          <div className="text-3xl font-black text-amber-300 my-0.5">{studentsList.length}</div>
          <span className="text-[10px] text-sky-200">Terdaftar di SMANDE</span>
        </div>

        {/* Background icon decorative */}
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none">
          🛠️
        </div>
      </div>

      {/* 10 Tool Navigation Selector Tabs */}
      <div className="bg-white border-2 border-sky-200/90 rounded-2xl p-2 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
          {toolsList.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                sound.playClick();
                setActiveTool(tool.id as any);
              }}
              className={`p-2.5 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activeTool === tool.id
                  ? 'bg-sky-600 text-white font-black shadow-md scale-[1.02] ring-2 ring-sky-300'
                  : 'bg-sky-50/60 hover:bg-sky-100 text-slate-700 font-bold hover:text-sky-900 border border-sky-100'
              }`}
              title={tool.desc}
            >
              <span className="text-xs truncate w-full">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 1. TIMER DISKUSI ================= */}
      {activeTool === 'timer' && (
        <div
          className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 transition-all ${
            isFullscreenTimer ? 'fixed inset-0 z-50 rounded-none overflow-y-auto flex flex-col justify-center' : ''
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Timer Diskusi Kelas Interaktif</h3>
                <p className="text-xs text-slate-400">Gunakan untuk membatasi waktu musyawarah kelompok dan pemaparan</p>
              </div>
            </div>

            <button
              onClick={() => setIsFullscreenTimer(!isFullscreenTimer)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
              title={isFullscreenTimer ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Proyektor)'}
            >
              {isFullscreenTimer ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

          {/* Topik Diskusi Input / Display */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Topik Pembahasan / Musyawarah:</span>
            <input
              type="text"
              value={discussionTopic}
              onChange={(e) => setDiscussionTopic(e.target.value)}
              className="w-full text-center text-sm md:text-lg font-extrabold text-white bg-transparent border-b border-slate-700 pb-1 focus:outline-none focus:border-amber-400"
              placeholder="Tuliskan topik atau pertanyaan diskusi di sini..."
            />
          </div>

          {/* Big Digital Countdown Clock Display */}
          <div className="text-center py-6 md:py-10">
            <div
              className={`font-mono font-black tracking-wider transition-all select-none ${
                timerSeconds <= 30 && timerSeconds > 0
                  ? 'text-red-400 animate-pulse text-7xl md:text-9xl'
                  : timerSeconds === 0
                  ? 'text-emerald-400 text-6xl md:text-8xl'
                  : 'text-amber-400 text-7xl md:text-9xl'
              }`}
            >
              {formatTimer(timerSeconds)}
            </div>
            {timerSeconds === 0 && (
              <div className="text-emerald-400 font-extrabold text-lg mt-2 animate-bounce">
                🎉 WAKTU DISKUSI SELESAI! SILAKAN KELOMPOK BERIKUTNYA PRESENTASI.
              </div>
            )}
          </div>

          {/* Control Buttons: Play, Pause, Reset */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isTimerRunning ? (
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm md:text-base rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <Play size={20} className="fill-white" />
                <span>Mulai Timer</span>
              </button>
            ) : (
              <button
                onClick={handlePauseTimer}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm md:text-base rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <Pause size={20} className="fill-slate-950" />
                <span>Jeda Timer</span>
              </button>
            )}

            <button
              onClick={() => handleResetTimer()}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl transition-all"
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold block text-center">Pilihan Waktu Cepat (Presets):</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: '1 Menit (Ice Break)', sec: 60 },
                { label: '3 Menit (Tanya Cepat)', sec: 180 },
                { label: '5 Menit (Musyawarah Kilat)', sec: 300 },
                { label: '10 Menit (Diskusi Kelompok)', sec: 60 },
                { label: '15 Menit (Studi Kasus)', sec: 900 },
                { label: '20 Menit (Debat Sila)', sec: 1200 },
                { label: '30 Menit (Simulasi Sidang)', sec: 1800 },
              ].map((p) => (
                <button
                  key={p.sec}
                  onClick={() => handleResetTimer(p.sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timerInitial === p.sec
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. ACAK NAMA (RANDOM STUDENT PICKER) ================= */}
      {activeTool === 'acakNama' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Shuffle className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Pengacak Nama Siswa (Spin & Pick)</h3>
                <p className="text-xs text-slate-400">Pilih siswa secara acak dan adil untuk menjawab pertanyaan atau membaca materi</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setNamePoolType('registered')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  namePoolType === 'registered' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Siswa SMANDE ({studentsList.length})
              </button>
              <button
                onClick={() => setNamePoolType('custom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  namePoolType === 'custom' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Kustom Teks
              </button>
            </div>
          </div>

          {/* Custom Text Area if custom mode selected */}
          {namePoolType === 'custom' && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs text-slate-400 font-bold block">
                Daftar Nama (Pisahkan dengan baris baru):
              </label>
              <textarea
                rows={3}
                value={customNamesText}
                onChange={(e) => setCustomNamesText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs font-mono"
              />
            </div>
          )}

          {/* Random Name Stage Display */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 md:p-12 text-center shadow-xl space-y-4">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-extrabold flex items-center justify-center gap-1.5">
              <Sparkles size={16} />
              <span>Siswa Terpilih:</span>
            </div>

            <div className="min-h-[100px] flex items-center justify-center">
              {isPickingName ? (
                <div className="text-3xl md:text-5xl font-black text-amber-300 animate-pulse tracking-wide font-mono">
                  🎲 {pickedStudent || 'Mengacak...'}
                </div>
              ) : pickedStudent ? (
                <div className="space-y-2 animate-bounce">
                  <div className="text-4xl md:text-6xl font-black text-amber-400 tracking-tight">
                    ⭐ {pickedStudent} ⭐
                  </div>
                  <p className="text-xs text-emerald-400 font-bold">
                    Silakan maju atau menjawab pertanyaan dengan penuh percaya diri!
                  </p>
                </div>
              ) : (
                <div className="text-slate-500 text-sm italic">
                  Klik tombol "Acak Nama Sekarang" untuk memulai undian.
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                disabled={isPickingName || activePool.length === 0}
                onClick={handlePickRandomStudent}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-sky-950 font-black text-base rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Shuffle size={20} />
                <span>Acak Nama Sekarang! ({activePool.length} Nama Tersisa)</span>
              </button>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-850 px-4 py-3 rounded-xl border border-slate-700">
                <input
                  type="checkbox"
                  checked={removePickedName}
                  onChange={(e) => setRemovePickedName(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Keluarkan nama yang sudah terpilih</span>
              </label>
            </div>
          </div>

          {/* History of Picked Students */}
          {pickedHistory.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Riwayat Terpilih ({pickedHistory.length}):</span>
                <button
                  onClick={() => setPickedHistory([])}
                  className="text-slate-500 hover:text-red-400 font-medium"
                >
                  Hapus Riwayat
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pickedHistory.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <Check size={12} className="text-emerald-400" />
                    <span>{name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. BAGI KELOMPOK ================= */}
      {activeTool === 'kelompok' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Users className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Generator Pembagi Kelompok Diskusi</h3>
                <p className="text-xs text-slate-400">Bagi seluruh siswa menjadi beberapa kelompok diskusi dengan tema 5 Sila Pancasila</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateGroups}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Acak Ulang Kelompok</span>
              </button>

              {generatedGroups.length > 0 && (
                <button
                  onClick={handleCopyGroups}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700"
                >
                  <Copy size={14} />
                  <span>{copiedGroupToast ? 'Tersalin! ✅' : 'Salin Teks'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Group Parameters Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <label className="text-slate-400 block font-bold mb-1">Metode Pembagian:</label>
              <select
                value={groupDivisionMode}
                onChange={(e) => setGroupDivisionMode(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="byGroupCount">Berdasarkan Jumlah Kelompok</option>
                <option value="byMemberCount">Berdasarkan Jumlah Siswa per Kelompok</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block font-bold mb-1">
                {groupDivisionMode === 'byGroupCount' ? 'Jumlah Kelompok yang Dibentuk:' : 'Target Siswa per Kelompok:'}
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={groupCountParam}
                onChange={(e) => setGroupCountParam(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block font-bold mb-1">Tema Penamaan Kelompok:</label>
              <select
                value={groupTheme}
                onChange={(e) => setGroupTheme(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="pancasila">Tema 5 Sila & Pilar Bangsa</option>
                <option value="angka">Angka Standar (Kelompok 1, 2, ...)</option>
              </select>
            </div>
          </div>

          {/* Generated Groups Display */}
          {generatedGroups.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              Klik tombol "Acak Ulang Kelompok" untuk membentuk kelompok diskusi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedGroups.map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                      <h4 className="font-extrabold text-xs text-amber-300 truncate">{grp.name}</h4>
                      <span className="text-[10px] font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full">
                        {grp.members.length} Anggota
                      </span>
                    </div>

                    <ol className="mt-3 space-y-1.5 text-xs text-slate-300">
                      {grp.members.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-300 text-[10px] font-black flex items-center justify-center shrink-0">
                            {mIdx + 1}
                          </span>
                          <span className="truncate">{m}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-2 border-t border-slate-850 text-[10px] text-slate-500">
                    Tugas: Rumuskan solusi mufakat
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. PASANGAN ACAK (THINK-PAIR-SHARE) ================= */}
      {activeTool === 'pasangan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Pasangan Acak (Think-Pair-Share)</h3>
                <p className="text-xs text-slate-400">Pasangkan 2 siswa untuk kolaborasi sebaya, saling mewawancarai, atau studi kasus</p>
              </div>
            </div>

            <button
              onClick={handleGeneratePairs}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Shuffle size={14} />
              <span>Acak Pasangan Belajar</span>
            </button>
          </div>

          {generatedPairs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
              Klik tombol "Acak Pasangan Belajar" untuk membagi siswa menjadi pasangan 2 orang.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generatedPairs.map((p, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                    <span>Pasangan #{idx + 1}</span>
                    <span className="text-[10px] text-slate-500">Tutor Sebaya</span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-base">🧑‍🎓</span>
                      <span>{p.roleA}</span>
                    </div>
                    <div className="text-center text-[10px] font-black text-amber-400">🤝 BERPASANGAN DENGAN 🤝</div>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-base">👩‍🎓</span>
                      <span>{p.roleB}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-xl">
                    <span className="text-amber-400 font-bold block mb-0.5">Topik Diskusi:</span>
                    <p className="line-clamp-2">{p.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. ICE BREAKING ================= */}
      {activeTool === 'iceBreaking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Sparkles className="text-amber-400" size={24} />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Ice Breaking Edukatif Pendidikan Pancasila</h3>
              <p className="text-xs text-slate-400">Cairkan suasana kelas dengan permainan cepat bermuatan karakter dan wawasan kebangsaan</p>
            </div>
          </div>

          {/* Ice Breaking Selection Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {iceBreakingActivities.map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedIceBreak(act);
                }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  selectedIceBreak.id === act.id
                    ? 'bg-sky-600 text-white border-sky-400 shadow-lg'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <h4 className="font-extrabold text-sm mb-1">{act.title}</h4>
                <p className={`text-xs line-clamp-2 ${selectedIceBreak.id === act.id ? 'text-sky-100' : 'text-slate-400'}`}>
                  {act.desc}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20">
                  ⏱️ {act.duration}
                </span>
              </button>
            ))}
          </div>

          {/* Active Ice Breaking Interactive Card */}
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Aktivitas Pilihan Hari Ini</span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">{selectedIceBreak.title}</h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                {selectedIceBreak.duration}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800">
              💡 <b>Instruksi Guru:</b> {selectedIceBreak.desc}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Petunjuk & Kartu Permainan:</span>
              <div className="space-y-2">
                {selectedIceBreak.clues.map((clue, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {cIdx + 1}
                    </span>
                    <span className="leading-relaxed">{clue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. KONVERSI NILAI ================= */}
      {activeTool === 'konversi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Percent className="text-amber-400" size={24} />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Konversi Nilai & Generator Deskripsi TP Rapor</h3>
              <p className="text-xs text-slate-400">Konversi nilai angka ke predikat, skala 4.0, interval KKTP, dan narasi capaian pembelajaran</p>
            </div>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-300 block">
                Masukkan Nilai Angka Siswa (Skala 0 - 100):
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputRawScore}
                  onChange={(e) => setInputRawScore(Number(e.target.value))}
                  className="flex-1 accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputRawScore}
                  onChange={(e) => setInputRawScore(Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center text-amber-400 font-extrabold text-xl"
                />
              </div>

              {/* KKTP Standard Indicators */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2">
                <div className="flex justify-between">
                  <span>Target KKTP SMA Negeri 1 Mande:</span>
                  <b className="text-emerald-400">75 (Tuntas Minimal)</b>
                </div>
                <div className="flex justify-between">
                  <span>Predikat & Skala:</span>
                  <b className="text-white">A (90-100), B (80-89), C (75-79), D (&lt;75)</b>
                </div>
              </div>
            </div>

            {/* Conversion Result Card */}
            {(() => {
              const res = convertScore(inputRawScore);
              return (
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold">Predikat & GPA</span>
                      <div className="text-3xl font-black text-amber-400 mt-0.5">{res.predikat} ({res.gpa})</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        inputRawScore >= 75
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-950 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {res.kktpStatus}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <span className="text-[10px] font-bold text-amber-400 block mb-1">
                      Narasi Deskripsi Capaian Pembelajaran (Rapor Kurikulum Merdeka):
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "{res.deskripsi}"
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= 7. KALKULATOR NILAI ================= */}
      {activeTool === 'kalkulator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Calculator className="text-amber-400" size={24} />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Kalkulator Pembobotan Nilai Rapor SMANDE</h3>
              <p className="text-xs text-slate-400">Hitung Nilai Akhir (NA) berdasarkan bobot Asesmen Formatif, Sumatif Bab, STS, dan SAS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Weights & Scores */}
            <div className="space-y-3 bg-slate-950 p-5 rounded-3xl border border-slate-800 text-xs">
              <span className="font-bold text-white text-sm block mb-2">Komponen Penilaian & Bobot:</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nilai Formatif (LKPD):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={calcFormatif}
                    onChange={(e) => setCalcFormatif(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bobot Formatif (%):</label>
                  <input
                    type="number"
                    value={weightFormatif}
                    onChange={(e) => setWeightFormatif(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Sumatif Bab (Ulangan):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={calcSumatif}
                    onChange={(e) => setCalcSumatif(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bobot Sumatif (%):</label>
                  <input
                    type="number"
                    value={weightSumatif}
                    onChange={(e) => setWeightSumatif(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nilai STS (Tengah Sem.):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={calcSts}
                    onChange={(e) => setCalcSts(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bobot STS (%):</label>
                  <input
                    type="number"
                    value={weightSts}
                    onChange={(e) => setWeightSts(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nilai SAS (Akhir Sem.):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={calcSas}
                    onChange={(e) => setCalcSas(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bobot SAS (%):</label>
                  <input
                    type="number"
                    value={weightSas}
                    onChange={(e) => setWeightSas(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Result */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Hasil Nilai Akhir (NA):</span>
                <div className="text-6xl font-black text-amber-400 my-2">{finalCalcScore}</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      finalCalcScore >= 75
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {finalCalcScore >= 75 ? 'TUNTAS KKTP (LULUS)' : 'BELUM TUNTAS (REMEDIAL)'}
                  </span>
                  <span className="text-xs text-slate-400">Target KKTP: 75</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Formula Perhitungan:</span>
                <p className="font-mono text-[11px] text-amber-300">
                  NA = ({calcFormatif} × {weightFormatif}%) + ({calcSumatif} × {weightSumatif}%) + ({calcSts} × {weightSts}%) + ({calcSas} × {weightSas}%)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Total Nilai Akhir: <b>{finalCalcScore}</b> siap dimasukkan ke E-Rapor Kurikulum Merdeka SMANDE.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 8. SCAN DOKUMEN ================= */}
      {activeTool === 'scanDokumen' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Camera className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Scanner Dokumen & Lembar Tugas Siswa</h3>
                <p className="text-xs text-slate-400">Pindai hasil pekerjaan LKPD atau tugas siswa melalui kamera atau unggah file</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  <Camera size={14} />
                  <span>Buka Kamera</span>
                </button>
              ) : (
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all animate-pulse"
                >
                  <Check size={14} />
                  <span>Ambil Foto</span>
                </button>
              )}

              <label className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-700">
                <Upload size={14} />
                <span>Unggah Foto</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Camera live preview */}
          {isCameraActive && (
            <div className="relative bg-black rounded-3xl overflow-hidden max-w-lg mx-auto border-2 border-sky-400">
              <video ref={videoRef} className="w-full h-auto" autoPlay playsInline />
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-2xl shadow-xl text-sm"
                >
                  📸 Jepret Dokumen
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-2xl text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          {/* Scanned Image Preview with Filters */}
          {scanImage && !isCameraActive && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300">Pratinjau Hasil Pindai:</span>
                <div className="flex items-center gap-2">
                  {(['normal', 'bw', 'contrast', 'sepia'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setScanFilter(filter)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                        scanFilter === filter
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {filter === 'bw' ? 'Hitam Putih' : filter === 'contrast' ? 'Kontras Tinggi' : filter}
                    </button>
                  ))}
                  <button
                    onClick={() => setScanRotation((r) => (r + 90) % 360)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs"
                    title="Putar 90 Derajat"
                  >
                    🔄 Putar
                  </button>
                </div>
              </div>

              <div className="flex justify-center bg-slate-900 p-4 rounded-2xl overflow-hidden max-h-[500px]">
                <img
                  src={scanImage}
                  alt="Scanned Document"
                  style={{
                    transform: `rotate(${scanRotation}deg)`,
                    filter:
                      scanFilter === 'bw'
                        ? 'grayscale(100%) contrast(150%)'
                        : scanFilter === 'contrast'
                        ? 'contrast(180%) brightness(110%)'
                        : scanFilter === 'sepia'
                        ? 'sepia(80%)'
                        : 'none',
                  }}
                  className="max-h-[450px] object-contain rounded-lg transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <a
                  href={scanImage}
                  download={`Dokumen_Pancasila_SMANDE_${Date.now()}.jpg`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  <Download size={14} />
                  <span>Unduh Dokumen Pindai</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 9. LJK SCANNER ================= */}
      {activeTool === 'ljkScanner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">LJK Scanner (Koreksi Lembar Jawab Komputer)</h3>
                <p className="text-xs text-slate-400">Pindai & koreksi lembar jawaban pilihan ganda 20 soal secara otomatis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateRandomScan}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
              >
                Simulasi Pindai LJK Siswa
              </button>
              <button
                onClick={handleGradeLjk}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Award size={14} />
                <span>Koreksi & Hitung Skor</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student & Key Settings */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-white block">Identitas Siswa Lembar LJK:</span>
              <input
                type="text"
                value={scannedStudentName}
                onChange={(e) => setScannedStudentName(e.target.value)}
                placeholder="Nama Siswa..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              />

              <div className="pt-2">
                <span className="font-bold text-slate-300 block mb-1.5">Kunci Jawaban Guru (20 Soal):</span>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {answerKey.map((key, kIdx) => (
                    <div key={kIdx} className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-[9px] text-slate-500 block">#{kIdx + 1}</span>
                      <select
                        value={key}
                        onChange={(e) => {
                          const newKey = [...answerKey];
                          newKey[kIdx] = e.target.value;
                          setAnswerKey(newKey);
                        }}
                        className="bg-transparent text-amber-400 font-bold text-xs"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer Sheet Marks Visualizer */}
            <div className="md:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Deteksi Bulatan Lembar LJK:</span>
                <span className="text-slate-400">Total Soal: 20 Butir</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {scannedAnswers.map((ans, idx) => {
                  const isCorrect = isLjkGraded ? ans === answerKey[idx] : null;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isCorrect === true
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                          : isCorrect === false
                          ? 'bg-red-950/60 border-red-500/50 text-red-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-mono text-slate-400">#{idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-slate-950 font-black text-xs flex items-center justify-center border border-slate-700">
                          {ans}
                        </span>
                        {isCorrect !== null && (
                          <span className="text-xs">{isCorrect ? '✅' : `❌ (${answerKey[idx]})`}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scoring Summary if Graded */}
              {isLjkGraded && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Skor Siswa:</span>
                    <h4 className="text-xl font-black text-amber-400">{scannedStudentName}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      {Math.round(
                        (scannedAnswers.filter((a, i) => a === answerKey[i]).length / answerKey.length) * 100
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Benar: {scannedAnswers.filter((a, i) => a === answerKey[i]).length} dari 20 Soal
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Graded LJK History */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">Riwayat Koreksi LJK Terbaru:</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Nama Siswa</th>
                    <th className="p-2 text-center">Jumlah Benar</th>
                    <th className="p-2 text-center">Skor LJK</th>
                    <th className="p-2 text-right">Waktu Koreksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {gradedHistory.map((g, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold text-white">{g.name}</td>
                      <td className="p-2 text-center font-mono">{g.correct} / {g.total}</td>
                      <td className="p-2 text-center font-bold text-amber-400 font-mono">{g.score}</td>
                      <td className="p-2 text-right text-slate-500">{g.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 10. JADWAL OTOMATIS ================= */}
      {activeTool === 'jadwal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-amber-400" size={24} />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Generator Jadwal Mengajar Guru Otomatis</h3>
                <p className="text-xs text-slate-400">Susun jadwal jam tatap muka Pendidikan Pancasila mingguan tanpa bentrok</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateSchedule}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Susun Ulang Otomatis</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors border border-slate-700"
              >
                <Printer size={14} />
                <span>Cetak Jadwal</span>
              </button>
            </div>
          </div>

          {/* Teacher Schedule Info Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400">Guru Pengampu:</span>
              <div className="font-extrabold text-white text-sm">Munawar Rois, S.Pd. (NIP: 197108151998021004)</div>
            </div>
            <div>
              <span className="text-slate-400">Mata Pelajaran:</span>
              <div className="font-extrabold text-amber-400">Pendidikan Pancasila (Fase E & F)</div>
            </div>
            <div>
              <span className="text-slate-400">Total Beban Mengajar:</span>
              <div className="font-extrabold text-emerald-400">24 Jam Pelajaran (JP) / Minggu</div>
            </div>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {generatedSchedule.map((dayPlan, dIdx) => (
              <div key={dIdx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-sky-700 text-white font-black text-center py-2 text-xs uppercase tracking-wider">
                  {dayPlan.day}
                </div>

                <div className="p-2 space-y-2 flex-1">
                  {dayPlan.periods.map((p, pIdx) => {
                    const isSpecial = p.classRoom.includes('Lapangan') || p.classRoom.includes('Masjid');
                    return (
                      <div
                        key={pIdx}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          isSpecial
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-white hover:border-slate-700 transition-colors'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 font-mono">{p.time}</div>
                        <div className="font-bold truncate">{p.classRoom}</div>
                        <div className="text-[10px] text-sky-300 font-semibold truncate">{p.subject}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
