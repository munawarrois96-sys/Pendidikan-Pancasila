import express from 'express';
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
