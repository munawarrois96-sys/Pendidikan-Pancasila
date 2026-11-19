import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Shared attendance store (starts empty, populated manually by website visitors)
const ATTENDANCE_FILE = '/tmp/smande_attendance_v2.json';

interface AttendanceRecordPayload {
  id: string;
  studentName: string;
  className: string;
  grade: 'X' | 'XI' | 'XII';
  dayName: string;
  dateStr: string;
  timeStr: string;
  lessonPeriod: string;
  status: 'HADIR' | 'IJIN' | 'ALPA';
  note: string;
}

function loadServerAttendance(): AttendanceRecordPayload[] {
  try {
    if (fs.existsSync(ATTENDANCE_FILE)) {
      const raw = fs.readFileSync(ATTENDANCE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading attendance file:', err);
  }
  return [];
}

function saveServerAttendance(records: AttendanceRecordPayload[]): void {
  try {
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing attendance file:', err);
  }
}

let attendanceRecordsStore: AttendanceRecordPayload[] = loadServerAttendance();

app.get('/api/attendance', (_req, res) => {
  res.json({ records: attendanceRecordsStore });
});

app.post('/api/attendance', (req, res) => {
  const body = req.body as Partial<AttendanceRecordPayload>;
  const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : '';
  const className = typeof body.className === 'string' ? body.className.trim() : '';
  const status = body.status;

  if (!studentName || !className || (status !== 'HADIR' && status !== 'IJIN' && status !== 'ALPA')) {
    return res.status(400).json({ error: 'Nama, Kelas, dan Status Kehadiran wajib diisi.' });
  }

  const gradeRaw = className.split('-')[0];
  const grade: 'X' | 'XI' | 'XII' = gradeRaw === 'XII' ? 'XII' : gradeRaw === 'XI' ? 'XI' : 'X';

  const newRecord: AttendanceRecordPayload = {
    id: typeof body.id === 'string' && body.id ? body.id : `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    studentName,
    className,
    grade,
    dayName: typeof body.dayName === 'string' && body.dayName ? body.dayName : 'Senin',
    dateStr: typeof body.dateStr === 'string' && body.dateStr ? body.dateStr : '',
    timeStr: typeof body.timeStr === 'string' && body.timeStr ? body.timeStr : '',
    lessonPeriod: typeof body.lessonPeriod === 'string' && body.lessonPeriod ? body.lessonPeriod : '',
    status,
    note: typeof body.note === 'string' ? body.note.trim() : '',
  };

  attendanceRecordsStore = [newRecord, ...attendanceRecordsStore];
  saveServerAttendance(attendanceRecordsStore);
  return res.status(201).json({ record: newRecord, records: attendanceRecordsStore });
});

app.patch('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  const { status, timeStr, note } = req.body as Partial<AttendanceRecordPayload>;
  if (status !== 'HADIR' && status !== 'IJIN' && status !== 'ALPA') {
    return res.status(400).json({ error: 'Status kehadiran tidak valid.' });
  }

  attendanceRecordsStore = attendanceRecordsStore.map((rec) =>
    rec.id === id
      ? {
          ...rec,
          status,
          timeStr: typeof timeStr === 'string' ? timeStr : rec.timeStr,
          note: typeof note === 'string' ? note : rec.note,
        }
      : rec
  );
  saveServerAttendance(attendanceRecordsStore);
  return res.json({ records: attendanceRecordsStore });
});

app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  attendanceRecordsStore = attendanceRecordsStore.filter((rec) => rec.id !== id);
  saveServerAttendance(attendanceRecordsStore);
  return res.json({ records: attendanceRecordsStore });
});

app.delete('/api/attendance', (_req, res) => {
  attendanceRecordsStore = [];
  saveServerAttendance(attendanceRecordsStore);
  return res.json({ records: attendanceRecordsStore });
});

// Initialize Gemini SDK if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
}

// System prompt for the AI Tutor Pendidikan Pancasila
const TUTOR_SYSTEM_INSTRUCTION = `Anda adalah "Tutor Pintar Garuda", asisten AI Pendidikan Pancasila resmi untuk siswa SMA (Kelas X, XI, dan XII) di SMA Negeri 1 Mande (SMANDE), Cianjur, Jawa Barat.
Karakter Anda:
- Ramah, mendidik, santun, bernalar kritis, dan berjiwa Pancasila.
- Menjawab dengan bahasa Indonesia yang jelas, runtut, terstruktur, dan mudah dipahami siswa SMA.
- Menghubungkan setiap konsep dengan 5 Sila Pancasila, UUD NRI Tahun 1945, Bhinneka Tunggal Ika, dan NKRI.
- Memberikan contoh nyata dalam kehidupan sehari-hari (di sekolah, keluarga, dan masyarakat).
- Jika ada pertanyaan kontroversial, berikan sudut pandang musyawarah mufakat, toleransi, supremasi hukum, dan persatuan bangsa.
- Format jawaban dengan poin-poin yang rapi, bold untuk istilah penting, dan kalimat motivasi di akhir.`;

// AI Tutor endpoint
app.post('/api/ai-tutor', async (req, res) => {
  const { question, contextGrade, topic } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
  }

  try {
    if (aiClient && geminiApiKey) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `[Konteks: Siswa ${contextGrade || 'SMA'}, Topik: ${topic || 'Pendidikan Pancasila'}]\n\nPertanyaan siswa: "${question}"`
              }
            ]
          }
        ],
        config: {
          systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini. Silakan ulangi kembali.';
      return res.json({ reply: replyText, source: 'gemini' });
    }

    // Fallback if API key is not configured in local environment
    const cannedAnswers: Record<string, string> = {
      default: `Halo siswa hebat SMA Negeri 1 Mande (SMANDE)! 🇮🇩\n\nPendidikan Pancasila mengajarkan kita untuk menjadi insan yang beriman, berakhlak mulia, berkebinekaan global, mandiri, bergotong royong, bernalar kritis, dan kreatif (Profil Pelajar Pancasila).\n\nUntuk pertanyaanmu mengenai: "${question}":\n\n1. **Kajian Nilai Pancasila**: Setiap tindakan harus berlandaskan asas musyawarah (Sila ke-4), keadilan bagi sesama (Sila ke-5), serta persatuan bangsa (Sila ke-3).\n2. **Penerapan Nyata**: Terapkan toleransi antarumat beragama, hindari perundungan (bullying), patuhi tata tertib sekolah, dan saring berita hoaks sebelum menyebarkannya.\n3. **Landasan Konstitusi**: Pasal 27 & 28 UUD 1945 menjamin keseimbangan antara hak dan kewajiban asasi manusia.\n\nTetap semangat belajar untuk kemajuan Indonesia tercinta!`
    };

    return res.json({
      reply: cannedAnswers.default,
      source: 'local_kb'
    });
  } catch (error: any) {
    console.error('Error generating tutor reply:', error);
    return res.json({
      reply: `Maaf kawan, terjadi gangguan jaringan saat menghubungi server AI. Namun ingatlah inti nilai Pancasila: selalu kedepankan musyawarah, gotong royong, dan rasa saling menghargai. Silakan coba ajukan pertanyaan kembali!`,
      source: 'fallback'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Pendidikan Pancasila SMANDE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
