import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Box,
  RotateCw,
  Eye,
  Sparkles,
  Info,
  Maximize2,
  Compass,
  BookOpen,
  Volume2,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { sound } from '../utils/audio';

type ModelType = 'garuda' | 'uud1945' | 'bhinneka' | 'nkri';

interface HotspotInfo {
  title: string;
  subtitle: string;
  description: string;
  significance: string;
}

const MODEL_INFO: Record<ModelType, {
  name: string;
  category: string;
  badgeColor: string;
  summary: string;
  hotspots: HotspotInfo[];
}> = {
  garuda: {
    name: 'Lambang Negara Garuda Pancasila & Perisai 5 Sila',
    category: 'Pilar 1: Pancasila',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    summary: 'Visualisasi 3D monumental Burung Garuda Pancasila dengan Perisai Heraldis 5 Sila, pita semboyan Bhinneka Tunggal Ika, dan proporsi jumlah helai bulu bersejarah (17-8-1945).',
    hotspots: [
      {
        title: 'Bintang Emas Bersudut Lima (Sila ke-1)',
        subtitle: 'Ketuhanan Yang Maha Esa',
        description: 'Bintang bersudut lima berlatar perisai hitam melambangkan cahaya rohani dari Tuhan Yang Maha Esa kepada setiap insan manusia, serta menjamin kebebasan memeluk agama di Indonesia.',
        significance: 'Nilai Religiusitas, Toleransi Antarumat Beragama & Kerukunan Hidup.',
      },
      {
        title: 'Rantai Emas Melingkar (Sila ke-2)',
        subtitle: 'Kemanusiaan yang Adil dan Beradab',
        description: 'Gelang rantai persegi (pria) dan lingkaran (wanita) yang saling berkait kokoh melambangkan hubungan timbal balik persaudaraan antarsesama manusia tanpa diskriminasi.',
        significance: 'Penghormatan Martabat HAM, Anti-Perundungan & Solidaritas.',
      },
      {
        title: 'Pohon Beringin Rimbun (Sila ke-3)',
        subtitle: 'Persatuan Indonesia',
        description: 'Pohon beringin berakar tunjang kuat dan bersulur ke segala arah mencerminkan Indonesia sebagai negara kesatuan yang menaungi beragam suku bangsa dan adat budaya.',
        significance: 'Cinta Tanah Air, Nasionalisme, dan Keutuhan Wilayah NKRI.',
      },
      {
        title: 'Kepala Banteng Tangguh (Sila ke-4)',
        subtitle: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan...',
        description: 'Banteng sebagai hewan sosial yang senang berkumpul melambangkan musyawarah mufakat di mana masyarakat berdiskusi dengan akal sehat untuk memecahkan persoalan.',
        significance: 'Demokrasi Pancasila, Musyawarah Kelas, OSIS & Kepemimpinan.',
      },
      {
        title: 'Padi dan Kapas Sejahtera (Sila ke-5)',
        subtitle: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
        description: 'Padi melambangkan pangan dan kapas melambangkan sandang, kebutuhan pokok dasar manusia yang mencerminkan terwujudnya keadilan dan kemakmuran merata bagi segenap rakyat.',
        significance: 'Keadilan Distribusi, Kepedulian Sosial & Gotong Royong.',
      },
      {
        title: 'Proporsi Helai Bulu Kemerdekaan',
        subtitle: '17 Sayap, 8 Ekor, 19 Pangkal Ekor, 45 Leher',
        description: 'Jumlah helai bulu di kedua sayap (17), ekor (8), pangkal ekor di bawah perisai (19), dan leher (45) mengabadikan tanggal bersejarah Proklamasi Kemerdekaan Republik Indonesia: 17 Agustus 1945.',
        significance: 'Memori Historis Kejuangan dan Kedaulatan Bangsa Indonesia.',
      },
    ],
  },
  uud1945: {
    name: 'Kitab Konstitusi Monumental UUD NRI Tahun 1945',
    category: 'Pilar 2: UUD NRI 1945',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    summary: 'Visualisasi 3D Kitab Hukum Dasar Tertinggi Negara Republik Indonesia, Piagam Pembukaan UUD 1945, Pilar Sejarah 4 Tahap Amandemen, dan Piramida Tata Urutan Perundang-undangan.',
    hotspots: [
      {
        title: 'Piagam Pembukaan UUD NRI 1945',
        subtitle: 'Pokok Kaidah Fundamental Negara (Staatsfundamentalnorm)',
        description: 'Memuat 4 alinea yang menegaskan hak kemerdekaan segala bangsa, perjuangan pergerakan, pengakuan berkat rahmat Allah Yang Maha Kuasa, serta 4 tujuan nasional dan dasar negara Pancasila.',
        significance: 'Tidak dapat diubah oleh siapapun karena merupakan dasar keberadaan NKRI.',
      },
      {
        title: 'Pilar Sejarah 4 Tahap Amandemen (1999–2002)',
        subtitle: 'Penyempurnaan Konstitusi Era Reformasi',
        description: 'Disahkan oleh MPR untuk membatasi kekuasaan Presiden maksimal 2 periode, memperkuat fungsi DPR, membentuk Mahkamah Konstitusi (MK), DPD, serta bab komprehensif Hak Asasi Manusia.',
        significance: 'Mewujudkan Sistem Ketatanegaraan yang Demokratis & Akuntabel.',
      },
      {
        title: 'Hierarki Perundang-Undangan (UU 12/2011)',
        subtitle: 'Asas Lex Superior Derogat Legi Inferiori',
        description: 'Tingkatan hukum formal di Indonesia: UUD 1945 ➔ Ketetapan MPR ➔ UU / Perppu ➔ Peraturan Pemerintah (PP) ➔ Peraturan Presiden (Perpres) ➔ Perda Provinsi ➔ Perda Kab/Kota.',
        significance: 'Kepastian Hukum, Kepatuhan Peraturan & Keteraturan Sosial.',
      },
    ],
  },
  bhinneka: {
    name: 'Paviliun Monumen Bhinneka Tunggal Ika',
    category: 'Pilar 3: Bhinneka Tunggal Ika',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    summary: 'Visualisasi 3D Paviliun Kebinekaan dengan 6 pilar toleransi antarumat beragama, ornamen ukiran ragam motif budaya Nusantara, pita semboyan persatuan, dan api abadi persaudaraan bangsa.',
    hotspots: [
      {
        title: 'Pita Semboyan Keramat Mpu Tantular',
        subtitle: 'Kitab Sutasoma Abad ke-14',
        description: 'Dicengkeram erat oleh kedua cakar Garuda dengan tulisan "Bhinneka Tunggal Ika" yang bermakna meskipun beraneka ragam suku, bahasa, adat, dan agama, hakikatnya tetap satu kesatuan utuh.',
        significance: 'Perekat Sosial dan Identitas Pemersatu Keragaman Bangsa.',
      },
      {
        title: '6 Pilar Toleransi & Kerukunan Beragama',
        subtitle: 'Harmoni Keberagaman Spiritual',
        description: 'Melambangkan sikap saling menghormati dan memfasilitasi kebebasan beribadah bagi seluruh pemeluk agama resmi dan aliran kepercayaan di tanah air secara damai.',
        significance: 'Kerukunan Hidup, Moderasi Beragama & Anti-Ekstremisme.',
      },
      {
        title: 'Kubah Motif Etnik Budaya Nusantara',
        subtitle: 'Kekayaan 1.340 Suku Bangsa di Indonesia',
        description: 'Perpaduan ornamen tradisional ukir Jepara, tenun Toraja, Dayak, dan batik Sunda-Jawa melambangkan kekayaan warisan kebudayaan adiluhung yang tak ternilai.',
        significance: 'Kebanggaan Budaya Nasional & Pelestarian Warisan Luhur.',
      },
    ],
  },
  nkri: {
    name: 'Globe Geospasial NKRI (Wawasan Nusantara)',
    category: 'Pilar 4: NKRI',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    summary: 'Visualisasi 3D Bumi Kepulauan Nusantara Indonesia dengan 38 Provinsi, bentang 3 Zona Waktu (WIB, WITA, WIT), tonggak batas wilayah terluar, serta koridor Deklarasi Djuanda 1957.',
    hotspots: [
      {
        title: 'Deklarasi Djuanda 13 Desember 1957',
        subtitle: 'Konsep Negara Kepulauan (Archipelagic State)',
        description: 'Menegaskan bahwa laut di antara dan di dalam kepulauan Indonesia menjadi satu kesatuan wilayah kedaulatan mutlak NKRI, bukan laut bebas pemisah pulau.',
        significance: 'Kedaulatan Maritim, Sumber Daya Kelautan & Kesatuan Teritorial.',
      },
      {
        title: '38 Provinsi & Titik Nol Sabang - Merauke',
        subtitle: 'Batas Wilayah Kedaulatan Terluar',
        description: 'Dari Pulau Rondo di ujung barat Sabang hingga Merauke di timur, mencakup Miangas di utara dan Pulau Rote di selatan, seluruhnya berada di bawah naungan satu kedaulatan NKRI.',
        significance: 'Bela Negara, Pertahanan Wilayah & Pemerataan Pembangunan.',
      },
      {
        title: 'Ibu Kota Nusantara (IKN) & 3 Zona Waktu',
        subtitle: 'WIB, WITA, WIT & Poros Maritim',
        description: 'Posisi silang Indonesia di antara dua benua (Asia - Australia) dan dua samudra (Hindia - Pasifik) menjadikannya poros strategis maritim dunia yang aman dan mandiri.',
        significance: 'Wawasan Geopolitik, Kebangsaan & Poros Masa Depan.',
      },
    ],
  },
};

export const ThreeDimensionalViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('garuda');
  const [activeHotspotIndex, setActiveHotspotIndex] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const isAutoRotateRef = useRef<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // Three.js scene instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Sound pronunciation
  const speakHotspot = (text: string) => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Build Procedural 3D Models
  const buildModel = (type: ModelType, group: THREE.Group) => {
    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      group.remove(child);
    }

    // -------------------------------------------------------------
    // PROCEDURAL TEXTURE GENERATORS (Zero-404, Crisp & High Fidelity)
    // -------------------------------------------------------------
    const createGarudaShieldTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, 1024, 1024);

      // Outer Shield Path
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.lineTo(904, 120);
      ctx.bezierCurveTo(920, 360, 900, 680, 512, 940);
      ctx.bezierCurveTo(124, 680, 104, 360, 120, 120);
      ctx.closePath();
      ctx.clip();

      // Quadrants: Top-Left (Red), Top-Right (White), Bottom-Left (White), Bottom-Right (Red)
      // Top-Left (Red): Kepala Banteng (Sila 4)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 512, 480);

      // Top-Right (White): Pohon Beringin (Sila 3)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(512, 0, 512, 480);

      // Bottom-Left (White): Padi & Kapas (Sila 5)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 480, 512, 544);

      // Bottom-Right (Red): Rantai Emas (Sila 2)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(512, 480, 512, 544);

      // Equator Line (Garis Khatulistiwa - Garis Hitam Tebal)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 465, 1024, 30);

      // Sila 4: Kepala Banteng in Top-Left (x: 290, y: 260)
      ctx.save();
      ctx.translate(290, 260);
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-55, -45, 65, Math.PI * 0.1, Math.PI * 0.9, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(55, -45, 65, Math.PI * 0.9, Math.PI * 0.1, false);
      ctx.stroke();
      // Black Head
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.ellipse(0, 20, 80, 90, 0, 0, Math.PI * 2);
      ctx.fill();
      // Snout
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 72, 52, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-22, 74, 9, 0, Math.PI * 2);
      ctx.arc(22, 74, 9, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-34, -10, 11, 0, Math.PI * 2);
      ctx.arc(34, -10, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-32, -12, 5, 0, Math.PI * 2);
      ctx.arc(36, -12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sila 3: Pohon Beringin in Top-Right (x: 734, y: 250)
      ctx.save();
      ctx.translate(734, 250);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(-18, 110);
      ctx.lineTo(-12, 10);
      ctx.lineTo(12, 10);
      ctx.lineTo(18, 110);
      ctx.lineTo(35, 125);
      ctx.lineTo(5, 110);
      ctx.lineTo(-5, 110);
      ctx.lineTo(-35, 125);
      ctx.closePath();
      ctx.fill();
      // Hanging roots
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 4;
      [-45, -25, 25, 45].forEach((rx) => {
        ctx.beginPath();
        ctx.moveTo(rx, -20);
        ctx.lineTo(rx + (rx > 0 ? 6 : -6), 85);
        ctx.stroke();
      });
      // Foliage layers
      const greens = ['#15803d', '#16a34a', '#22c55e', '#14532d'];
      greens.forEach((col, idx) => {
        ctx.fillStyle = col;
        const r = 58 - idx * 8;
        ctx.beginPath();
        ctx.arc(0, -60, r + 15, 0, Math.PI * 2);
        ctx.arc(-55, -35, r, 0, Math.PI * 2);
        ctx.arc(55, -35, r, 0, Math.PI * 2);
        ctx.arc(-75, 10, r - 5, 0, Math.PI * 2);
        ctx.arc(75, 10, r - 5, 0, Math.PI * 2);
        ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Sila 5: Padi & Kapas in Bottom-Left (x: 290, y: 700)
      ctx.save();
      ctx.translate(290, 700);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(-20, -10, 80, Math.PI * 0.4, Math.PI * 1.1);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      for (let p = 0; p < 17; p++) {
        const angle = 0.5 + p * 0.12;
        const px = -20 + Math.cos(angle) * 75;
        const py = -10 + Math.sin(angle) * 75;
        ctx.beginPath();
        ctx.ellipse(px, py, 11, 6, angle + 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Kapas
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(20, -10, 80, Math.PI * 0.6, Math.PI * -0.1, true);
      ctx.stroke();
      for (let c = 0; c < 5; c++) {
        const angle = 0.7 - c * 0.35;
        const cx = 20 + Math.cos(angle) * 75;
        const cy = -10 + Math.sin(angle) * 75;
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(cx, cy + 4, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - 6, cy - 4, 9, 0, Math.PI * 2);
        ctx.arc(cx + 6, cy - 4, 9, 0, Math.PI * 2);
        ctx.arc(cx, cy - 10, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-15, 65, 30, 14);
      ctx.restore();

      // Sila 2: Rantai Emas in Bottom-Right (x: 734, y: 700)
      ctx.save();
      ctx.translate(734, 700);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      const chainR = 68;
      const numLinks = 17;
      for (let l = 0; l < numLinks; l++) {
        const theta = (l * Math.PI * 2) / numLinks;
        const lx = Math.cos(theta) * chainR;
        const ly = Math.sin(theta) * chainR;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(theta);
        if (l % 2 === 0) {
          ctx.strokeRect(-9, -9, 18, 18);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();

      // Central Heart Shield (Sila 1)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(512, 340);
      ctx.bezierCurveTo(630, 340, 640, 440, 512, 600);
      ctx.bezierCurveTo(384, 440, 394, 340, 512, 340);
      ctx.closePath();
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Sila 1 Golden Star
      ctx.translate(512, 450);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 4;
      for (let r = 0; r < 12; r++) {
        const ra = (r * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra) * 35, Math.sin(ra) * 35);
        ctx.lineTo(Math.cos(ra) * 65, Math.sin(ra) * 65);
        ctx.stroke();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      for (let s = 0; s < 5; s++) {
        const sa = (s * Math.PI * 2) / 5 - Math.PI / 2;
        const si = sa + Math.PI / 5;
        if (s === 0) ctx.moveTo(Math.cos(sa) * 58, Math.sin(sa) * 58);
        else ctx.lineTo(Math.cos(sa) * 58, Math.sin(sa) * 58);
        ctx.lineTo(Math.cos(si) * 25, Math.sin(si) * 25);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // Restore outer clip

      // Outer Golden Shield Border
      ctx.beginPath();
      ctx.moveTo(120, 120);
      ctx.lineTo(904, 120);
      ctx.bezierCurveTo(920, 360, 900, 680, 512, 940);
      ctx.bezierCurveTo(124, 680, 104, 360, 120, 120);
      ctx.closePath();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 26;
      ctx.stroke();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 8;
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createGarudaRibbonTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 30, 1024, 196);

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 20, 1024, 16);
      ctx.fillRect(0, 220, 1024, 16);

      const grad = ctx.createLinearGradient(0, 30, 0, 220);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.5, 'rgba(241,245,249,0.3)');
      grad.addColorStop(1, 'rgba(203,213,225,0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 36, 1024, 184);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 64px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BHINNEKA TUNGGAL IKA', 512, 130);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createUudCoverTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, 1024, 1024);

      // Gold filigree frame
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 16;
      ctx.strokeRect(60, 60, 904, 904);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(84, 84, 856, 856);

      // Embossed Garuda Seal
      ctx.save();
      ctx.translate(512, 340);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(0, 0, 78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      for (let s = 0; s < 5; s++) {
        const sa = (s * Math.PI * 2) / 5 - Math.PI / 2;
        const si = sa + Math.PI / 5;
        if (s === 0) ctx.moveTo(Math.cos(sa) * 45, Math.sin(sa) * 45);
        else ctx.lineTo(Math.cos(sa) * 45, Math.sin(sa) * 45);
        ctx.lineTo(Math.cos(si) * 20, Math.sin(si) * 20);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.font = '900 52px "Times New Roman", serif';
      ctx.fillText('UNDANG-UNDANG DASAR', 512, 540);

      ctx.font = '700 36px "Times New Roman", serif';
      ctx.fillText('NEGARA REPUBLIK INDONESIA', 512, 600);

      ctx.font = '900 70px "Times New Roman", serif';
      ctx.fillText('TAHUN 1945', 512, 680);

      ctx.font = 'italic 700 26px sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('HUKUM DASAR TERTINGGI REPUBLIK INDONESIA', 512, 750);
      ctx.fillText('DITETAPKAN OLEH PPKI 18 AGUSTUS 1945', 512, 790);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createUudPagesTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, 1024, 1024);

      // Spine crease shadow
      const crease = ctx.createLinearGradient(480, 0, 544, 0);
      crease.addColorStop(0, 'rgba(0,0,0,0.02)');
      crease.addColorStop(0.5, 'rgba(0,0,0,0.22)');
      crease.addColorStop(1, 'rgba(0,0,0,0.02)');
      ctx.fillStyle = crease;
      ctx.fillRect(470, 0, 84, 1024);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 430, 944);
      ctx.strokeRect(554, 40, 430, 944);

      // Left Page: PEMBUKAAN (Alinea I & II)
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.font = '900 30px "Times New Roman", serif';
      ctx.fillText('UNDANG-UNDANG DASAR', 255, 90);
      ctx.font = '700 22px "Times New Roman", serif';
      ctx.fillText('NEGARA REPUBLIK INDONESIA 1945', 255, 125);

      ctx.font = '900 28px "Times New Roman", serif';
      ctx.fillStyle = '#b45309';
      ctx.fillText('PEMBUKAAN', 255, 175);
      ctx.fillText('(PREAMBLE)', 255, 210);

      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'left';
      ctx.font = '500 16px "Times New Roman", serif';
      const leftLines = [
        'Bahwa sesungguhnya Kemerdekaan itu ialah',
        'hak segala bangsa dan oleh sebab itu, maka',
        'penjajahan di atas dunia harus dihapuskan,',
        'karena tidak sesuai dengan peri-kemanusiaan',
        'dan peri-keadilan.',
        '',
        'Dan perjuangan pergerakan kemerdekaan',
        'Indonesia telah sampailah kepada saat yang',
        'berbahagia dengan selamat sentausa',
        'mengantarkan rakyat Indonesia ke depan',
        'pintu gerbang kemerdekaan Negara',
        'Indonesia, yang merdeka, bersatu,',
        'berdaulat, adil dan makmur.',
      ];
      leftLines.forEach((l, idx) => {
        ctx.fillText(l, 60, 260 + idx * 26);
      });

      // Right Page: Alinea III & IV (Pancasila)
      ctx.textAlign = 'left';
      const rightLines = [
        'Atas berkat rahmat Allah Yang Maha Kuasa',
        'dan dengan didorongkan oleh keinginan luhur,',
        'supaya berkehidupan kebangsaan yang',
        'bebas, maka rakyat Indonesia menyatakan',
        'dengan ini kemerdekaannya.',
        '',
        'Kemudian daripada itu untuk membentuk',
        'suatu Pemerintah Negara Indonesia yang',
        'melindungi segenap bangsa Indonesia dan',
        'seluruh tumpah darah Indonesia...',
        '',
        '1. Ketuhanan Yang Maha Esa,',
        '2. Kemanusiaan yang adil dan beradab,',
        '3. Persatuan Indonesia,',
        '4. Kerakyatan yang dipimpin oleh hikmat...',
        '5. Keadilan sosial bagi seluruh rakyat.',
      ];
      rightLines.forEach((l, idx) => {
        if (idx >= 11) {
          ctx.fillStyle = '#b45309';
          ctx.font = '700 16px "Times New Roman", serif';
        } else {
          ctx.fillStyle = '#1e293b';
          ctx.font = '500 15px "Times New Roman", serif';
        }
        ctx.fillText(l, 575, 120 + idx * 26);
      });

      // Ribbon Bookmark
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(504, 0, 8, 1024);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(512, 0, 8, 1024);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createBhinnekaSteleTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, 1024, 1024);

      // Surya Majapahit 8-Pointed Solar Halo
      ctx.save();
      ctx.translate(512, 170);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.stroke();
      for (let ray = 0; ray < 8; ray++) {
        const ra = (ray * Math.PI * 2) / 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra) * 75, Math.sin(ra) * 75);
        ctx.lineTo(Math.cos(ra) * 115, Math.sin(ra) * 115);
        ctx.stroke();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 40px "Times New Roman", serif';
      ctx.fillText('PRASASTI KAKAWIN SUTASOMA', 512, 330);

      ctx.font = 'italic 700 24px "Times New Roman", serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText('Karya Agung Mpu Tantular — Kerajaan Majapahit (Abad XIV)', 512, 375);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 26px "Times New Roman", serif';
      ctx.fillText('"Rwāneka dhātu winuwus Buddha Wiswa,', 512, 450);
      ctx.fillText('Bhinnêki rakwa ring apan kena parwanosen,', 512, 490);
      ctx.fillText('Mangka ng Jinatwa kalawan Siwatatwa tunggal,', 512, 530);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 46px "Times New Roman", serif';
      ctx.fillText('BHINNEKA TUNGGAL IKA', 512, 600);
      ctx.fillText('TAN HANA DHARMA MANGRWA"', 512, 650);

      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, 700);
      ctx.lineTo(874, 700);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('MAKNA FILOSOFIS PERSATUAN BANGSA:', 512, 745);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('"Berbeda-beda tetapi pada hakikatnya tetap satu jua,', 512, 795);
      ctx.fillText('tidak ada kebenaran yang mendua."', 512, 835);

      ctx.font = '700 18px sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Perekat 1.340 Suku Bangsa, 6 Agama & 718 Bahasa Daerah di NKRI', 512, 895);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createNkriGlobeTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGrad.addColorStop(0, '#0c4a6e');
      oceanGrad.addColorStop(0.3, '#0369a1');
      oceanGrad.addColorStop(0.5, '#0284c7');
      oceanGrad.addColorStop(0.7, '#0369a1');
      oceanGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Equator
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(2048, 512);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('GARIS KHATULISTIWA (0° EQUATOR)', 80, 500);

      ctx.fillStyle = '#15803d';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;

      // 1. SUMATERA
      ctx.beginPath();
      ctx.moveTo(560, 390);
      ctx.lineTo(600, 410);
      ctx.lineTo(670, 480);
      ctx.lineTo(740, 560);
      ctx.lineTo(770, 600);
      ctx.lineTo(750, 610);
      ctx.lineTo(700, 560);
      ctx.lineTo(630, 470);
      ctx.lineTo(540, 380);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. JAWA
      ctx.beginPath();
      ctx.moveTo(770, 630);
      ctx.lineTo(820, 635);
      ctx.lineTo(880, 645);
      ctx.lineTo(950, 660);
      ctx.lineTo(980, 670);
      ctx.lineTo(970, 685);
      ctx.lineTo(880, 675);
      ctx.lineTo(810, 655);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. KALIMANTAN
      ctx.beginPath();
      ctx.moveTo(800, 430);
      ctx.lineTo(890, 410);
      ctx.lineTo(960, 430);
      ctx.lineTo(980, 480);
      ctx.lineTo(970, 540);
      ctx.lineTo(950, 580);
      ctx.lineTo(920, 600);
      ctx.lineTo(840, 590);
      ctx.lineTo(800, 540);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4. SULAWESI
      ctx.beginPath();
      ctx.moveTo(1050, 430);
      ctx.lineTo(1070, 450);
      ctx.lineTo(1040, 480);
      ctx.lineTo(1060, 510);
      ctx.lineTo(1130, 520);
      ctx.lineTo(1120, 540);
      ctx.lineTo(1070, 540);
      ctx.lineTo(1100, 600);
      ctx.lineTo(1070, 610);
      ctx.lineTo(1050, 570);
      ctx.lineTo(1040, 630);
      ctx.lineTo(1015, 620);
      ctx.lineTo(1025, 520);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 5. PAPUA
      ctx.beginPath();
      ctx.moveTo(1230, 490);
      ctx.lineTo(1270, 480);
      ctx.lineTo(1330, 520);
      ctx.lineTo(1420, 510);
      ctx.lineTo(1420, 650);
      ctx.lineTo(1350, 650);
      ctx.lineTo(1300, 600);
      ctx.lineTo(1260, 530);
      ctx.lineTo(1210, 520);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sunda Kecil & Maluku
      const nusa = [
        [1005, 675, 14, 10],
        [1035, 675, 12, 10],
        [1075, 680, 26, 12],
        [1135, 680, 32, 12],
        [1195, 690, 34, 14],
        [1160, 470, 24, 38],
        [1180, 560, 36, 12],
      ];
      nusa.forEach(([nx, ny, nw, nh]) => {
        ctx.beginPath();
        ctx.ellipse(nx, ny, nw, nh, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Deklarasi Djuanda 1957 Maritime Archipelagic Baseline
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.moveTo(520, 360);
      ctx.lineTo(790, 380);
      ctx.lineTo(980, 390);
      ctx.lineTo(1280, 440);
      ctx.lineTo(1450, 490);
      ctx.lineTo(1450, 670);
      ctx.lineTo(1200, 720);
      ctx.lineTo(760, 650);
      ctx.lineTo(520, 360);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Sovereign Pins
      const markers = [
        { name: '📍 SABANG (0 KM BARAT)', x: 530, y: 360 },
        { name: '📍 MIANGAS (BATAS UTARA)', x: 1060, y: 390 },
        { name: '⭐ IKN NUSANTARA', x: 960, y: 535, star: true },
        { name: '📍 CIANJUR (SMANDE)', x: 825, y: 650 },
        { name: '📍 PULAU ROTE (SELATAN)', x: 1180, y: 720 },
        { name: '📍 MERAUKE (UJUNG TIMUR)', x: 1430, y: 660 },
      ];
      markers.forEach((m) => {
        ctx.fillStyle = m.star ? '#fbbf24' : '#ef4444';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.star ? 9 : 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(m.name, m.x + 12, m.y + 5);
      });

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('NEGARA KESATUAN REPUBLIK INDONESIA', 1024, 120);

      ctx.font = '700 22px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('WAWASAN NUSANTARA • DARI SABANG SAMPAI MERAUKE • DEKLARASI DJUANDA 1957', 1024, 160);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    // Material Library (PBR)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.22,
    });

    const polishedGold = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      metalness: 0.92,
      roughness: 0.15,
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.3,
      roughness: 0.4,
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.3,
    });

    const marblePedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.4,
      roughness: 0.4,
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c2b0e,
      metalness: 0.15,
      roughness: 0.6,
    });

    // -------------------------------------------------------------
    // MODEL 1: GARUDA PANCASILA (MENYERUPAI ASLI DENGAN PERISAI 5 SILA)
    // -------------------------------------------------------------
    if (type === 'garuda') {
      const shieldTex = createGarudaShieldTexture();
      const ribbonTex = createGarudaRibbonTexture();

      // 1. Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(2.6, 3.0, 0.45, 32);
      const baseMesh = new THREE.Mesh(baseGeo, marblePedestalMaterial);
      baseMesh.position.y = 0.22;
      group.add(baseMesh);

      const baseTrimGeo = new THREE.TorusGeometry(2.65, 0.08, 16, 64);
      const baseTrim = new THREE.Mesh(baseTrimGeo, polishedGold);
      baseTrim.rotation.x = Math.PI / 2;
      baseTrim.position.y = 0.45;
      group.add(baseTrim);

      // 2. Eagle Body & Golden Anatomy
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'eagleBody';

      // Golden Torso
      const torsoGeo = new THREE.CylinderGeometry(0.85, 0.65, 2.4, 24);
      const torsoMesh = new THREE.Mesh(torsoGeo, goldMaterial);
      torsoMesh.position.y = 1.95;
      bodyGroup.add(torsoMesh);

      // Muscular Chest curves
      const chestGeo = new THREE.SphereGeometry(0.85, 24, 16);
      const chestMesh = new THREE.Mesh(chestGeo, polishedGold);
      chestMesh.position.set(0, 2.2, 0.15);
      bodyGroup.add(chestMesh);

      // 3. Eagle Head turned to heraldic right (viewers left)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 3.3, 0.15);
      headGroup.rotation.y = -0.35; // Looking to the right

      const headGeo = new THREE.SphereGeometry(0.5, 20, 20);
      const headMesh = new THREE.Mesh(headGeo, polishedGold);
      headGroup.add(headMesh);

      // Royal Crest (Jambul Emas)
      for (let j = 0; j < 3; j++) {
        const crestGeo = new THREE.ConeGeometry(0.09, 0.6 - j * 0.1, 8);
        const crestMesh = new THREE.Mesh(crestGeo, polishedGold);
        crestMesh.position.set(0, 0.45 + j * 0.08, -0.15 - j * 0.15);
        crestMesh.rotation.x = -0.6 - j * 0.2;
        headGroup.add(crestMesh);
      }

      // Fierce Hooked Beak
      const beakGeo = new THREE.ConeGeometry(0.2, 0.65, 12);
      const beakMesh = new THREE.Mesh(beakGeo, new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.8,
        roughness: 0.2,
      }));
      beakMesh.position.set(0, -0.05, 0.55);
      beakMesh.rotation.x = Math.PI / 2.2;
      headGroup.add(beakMesh);

      // Piercing Eagle Eyes
      const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1 });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.32, 0.1, 0.3);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.32, 0.1, 0.3);
      headGroup.add(leftEye, rightEye);

      bodyGroup.add(headGroup);

      // 4. Neck: 45 Tiered Golden Feather Scales
      for (let ring = 0; ring < 5; ring++) {
        const ringY = 2.8 - ring * 0.12;
        const count = 9;
        for (let k = 0; k < count; k++) {
          const ka = (k * Math.PI * 2) / count;
          const scaleGeo = new THREE.BoxGeometry(0.12, 0.18, 0.04);
          const scaleMesh = new THREE.Mesh(scaleGeo, goldMaterial);
          scaleMesh.position.set(Math.cos(ka) * 0.55, ringY, Math.sin(ka) * 0.55);
          scaleMesh.rotation.y = -ka;
          scaleMesh.rotation.x = 0.25;
          bodyGroup.add(scaleMesh);
        }
      }

      // 5. Wings: 17 Feathers Each Side (Realistic Layered Wings)
      const leftWingGroup = new THREE.Group();
      leftWingGroup.name = 'leftWing';
      for (let i = 0; i < 17; i++) {
        const factor = i / 17;
        const featherGeo = new THREE.BoxGeometry(0.14, 2.2 - factor * 0.9, 0.08);
        const feather = new THREE.Mesh(featherGeo, polishedGold);
        feather.position.set(
          -1.0 - i * 0.13,
          2.6 + Math.sin(factor * Math.PI) * 0.9 - factor * 0.3,
          -0.1 - i * 0.03
        );
        feather.rotation.z = 0.35 + factor * 0.5;
        feather.rotation.y = 0.15;
        leftWingGroup.add(feather);
      }
      group.add(leftWingGroup);

      const rightWingGroup = new THREE.Group();
      rightWingGroup.name = 'rightWing';
      for (let i = 0; i < 17; i++) {
        const factor = i / 17;
        const featherGeo = new THREE.BoxGeometry(0.14, 2.2 - factor * 0.9, 0.08);
        const feather = new THREE.Mesh(featherGeo, polishedGold);
        feather.position.set(
          1.0 + i * 0.13,
          2.6 + Math.sin(factor * Math.PI) * 0.9 - factor * 0.3,
          -0.1 - i * 0.03
        );
        feather.rotation.z = -(0.35 + factor * 0.5);
        feather.rotation.y = -0.15;
        rightWingGroup.add(feather);
      }
      group.add(rightWingGroup);

      // 6. Tail: 8 Feathers at base
      const tailGroup = new THREE.Group();
      tailGroup.name = 'tail';
      for (let i = 0; i < 8; i++) {
        const tailGeo = new THREE.BoxGeometry(0.22, 1.4, 0.06);
        const tailFeather = new THREE.Mesh(tailGeo, goldMaterial);
        const spread = (i - 3.5) * 0.22;
        tailFeather.position.set(spread, 0.65, -0.35);
        tailFeather.rotation.z = spread * -0.4;
        tailGroup.add(tailFeather);
      }
      group.add(tailGroup);

      // 7. Base Tail: 19 Feathers below the shield
      for (let i = 0; i < 19; i++) {
        const bGeo = new THREE.BoxGeometry(0.08, 0.6, 0.04);
        const bMesh = new THREE.Mesh(bGeo, goldMaterial);
        const bSpread = (i - 9) * 0.09;
        bMesh.position.set(bSpread, 1.05, 0.25);
        bMesh.rotation.z = bSpread * -0.25;
        group.add(bMesh);
      }

      // 8. Claws / Talons (Cakar Mengcengkeram Pita)
      const clawMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.7, roughness: 0.3 });
      [-0.45, 0.45].forEach((cx) => {
        const claw = new THREE.Group();
        claw.position.set(cx, 0.72, 0.55);
        for (let t = 0; t < 3; t++) {
          const talonGeo = new THREE.ConeGeometry(0.06, 0.35, 8);
          const talon = new THREE.Mesh(talonGeo, clawMat);
          talon.position.set((t - 1) * 0.08, -0.05, 0.1);
          talon.rotation.x = 0.9;
          claw.add(talon);
        }
        group.add(claw);
      });

      // 9. Heraldic Shield with 5 Sila (Perisai 5 Sila Menyerupai Asli)
      const shieldMat = new THREE.MeshStandardMaterial({
        map: shieldTex,
        roughness: 0.25,
        metalness: 0.3,
      });
      const shieldGeo = new THREE.PlaneGeometry(1.85, 2.15);
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.set(0, 1.95, 0.78);
      group.add(shieldMesh);

      // Shield 3D Frame Backing
      const shieldBackGeo = new THREE.BoxGeometry(1.9, 2.2, 0.14);
      const shieldBack = new THREE.Mesh(shieldBackGeo, polishedGold);
      shieldBack.position.set(0, 1.95, 0.7);
      group.add(shieldBack);

      // 10. Ribbon Banner ("BHINNEKA TUNGGAL IKA")
      const ribbonMat = new THREE.MeshStandardMaterial({
        map: ribbonTex,
        roughness: 0.25,
        metalness: 0.1,
      });
      const ribbonGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.38, 36, 1, true, -Math.PI / 3.2, (Math.PI * 2) / 3.2);
      const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbonMesh.position.set(0, 0.65, 0.55);
      ribbonMesh.rotation.x = -0.15;
      group.add(ribbonMesh);

      group.add(bodyGroup);
    }

    // -------------------------------------------------------------
    // MODEL 2: KITAB KONSTITUSI UUD NRI 1945 (MENYERUPAI ASLI)
    // -------------------------------------------------------------
    if (type === 'uud1945') {
      const coverTex = createUudCoverTexture();
      const pagesTex = createUudPagesTexture();

      // 1. Altar Pedestal Base
      const altarGeo = new THREE.BoxGeometry(4.6, 0.45, 3.6);
      const altarMesh = new THREE.Mesh(altarGeo, marblePedestalMaterial);
      altarMesh.position.y = 0.22;
      group.add(altarMesh);

      const altarTrim = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.08, 3.7), polishedGold);
      altarTrim.position.y = 0.45;
      group.add(altarTrim);

      // 2. Open Monumental Codex (Kitab Terbuka)
      const bookGroup = new THREE.Group();
      bookGroup.name = 'constitutionCodex';
      bookGroup.position.set(0, 1.35, 0.1);

      // Bound Leather Cover under the pages
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        roughness: 0.4,
        metalness: 0.2,
      });
      const leftCover = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.14, 2.5), coverMat);
      leftCover.position.set(-0.95, -0.08, 0);
      leftCover.rotation.z = 0.1;
      const rightCover = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.14, 2.5), coverMat);
      rightCover.position.set(0.95, -0.08, 0);
      rightCover.rotation.z = -0.1;
      bookGroup.add(leftCover, rightCover);

      // Gold Book Spine
      const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.55, 16);
      const spine = new THREE.Mesh(spineGeo, polishedGold);
      spine.rotation.x = Math.PI / 2;
      spine.position.set(0, -0.12, 0);
      bookGroup.add(spine);

      // Curved Parchment Pages with High-Res Texture (Pembukaan & Alinea 1-4)
      const openPagesMat = new THREE.MeshStandardMaterial({
        map: pagesTex,
        roughness: 0.4,
        metalness: 0.05,
      });
      const pagesGeo = new THREE.PlaneGeometry(3.6, 2.4, 16, 8);
      // Gentle curve along the spine
      const pos = pagesGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const curve = -Math.sin(Math.abs(x) / 1.8 * Math.PI * 0.5) * 0.12;
        pos.setZ(i, curve);
      }
      pagesGeo.computeVertexNormals();

      const pagesMesh = new THREE.Mesh(pagesGeo, openPagesMat);
      pagesMesh.rotation.x = -Math.PI / 2.3;
      pagesMesh.position.set(0, 0.12, 0);
      bookGroup.add(pagesMesh);

      // Upright Front Cover Displayed Behind with Embossed Gold Seal & Title
      const uprightCoverMat = new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.35,
        metalness: 0.3,
      });
      const uprightCoverGeo = new THREE.PlaneGeometry(2.0, 2.8);
      const uprightCover = new THREE.Mesh(uprightCoverGeo, uprightCoverMat);
      uprightCover.position.set(0, 2.1, -1.2);
      uprightCover.rotation.x = -0.15;
      group.add(uprightCover);

      const uprightBacking = new THREE.Mesh(new THREE.BoxGeometry(2.08, 2.88, 0.1), coverMat);
      uprightBacking.position.set(0, 2.1, -1.26);
      uprightBacking.rotation.x = -0.15;
      group.add(uprightBacking);

      // 3. 4 Amendment Monolith Pillars (1999, 2000, 2001, 2002)
      const monolithCoords = [
        [-2.0, 0, -1.4, 'Amandemen I (1999)'],
        [-2.0, 0, 1.4, 'Amandemen II (2000)'],
        [2.0, 0, -1.4, 'Amandemen III (2001)'],
        [2.0, 0, 1.4, 'Amandemen IV (2002)'],
      ];
      monolithCoords.forEach(([x, , z]) => {
        const mGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.8, 16);
        const mMesh = new THREE.Mesh(mGeo, polishedGold);
        mMesh.position.set(x as number, 1.35, z as number);
        group.add(mMesh);

        const capGeo = new THREE.SphereGeometry(0.22, 12, 12);
        const cap = new THREE.Mesh(capGeo, whiteMaterial);
        cap.position.set(x as number, 2.3, z as number);
        group.add(cap);
      });

      // 4. Lex Superior Hierarchy Steps (Piramida Hukum UU No. 12 Tahun 2011)
      const pyramidGroup = new THREE.Group();
      pyramidGroup.name = 'legalPyramid';
      for (let lvl = 0; lvl < 5; lvl++) {
        const w = 1.8 - lvl * 0.3;
        const pGeo = new THREE.BoxGeometry(w, 0.12, 0.45);
        const pMat = lvl === 0 ? redMaterial : lvl === 1 ? polishedGold : whiteMaterial;
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(0, 0.5 + lvl * 0.13, 1.4);
        pyramidGroup.add(pMesh);
      }
      group.add(pyramidGroup);

      group.add(bookGroup);
    }

    // -------------------------------------------------------------
    // MODEL 3: BHINNEKA TUNGGAL IKA (PRASASTI MPU TANTULAR & HARMONI 6 AGAMA)
    // -------------------------------------------------------------
    if (type === 'bhinneka') {
      const steleTex = createBhinnekaSteleTexture();

      // 1. Tiered Lotus Pedestal
      const baseGeo = new THREE.CylinderGeometry(3.0, 3.4, 0.5, 32);
      const baseMesh = new THREE.Mesh(baseGeo, marblePedestalMaterial);
      baseMesh.position.y = 0.25;
      group.add(baseMesh);

      const lotusRingGeo = new THREE.TorusGeometry(3.05, 0.08, 16, 64);
      const lotusRing = new THREE.Mesh(lotusRingGeo, polishedGold);
      lotusRing.rotation.x = Math.PI / 2;
      lotusRing.position.y = 0.5;
      group.add(lotusRing);

      // 2. Central Monumental Stele of Kakawin Sutasoma Mpu Tantular
      const steleMat = new THREE.MeshStandardMaterial({
        map: steleTex,
        roughness: 0.35,
        metalness: 0.25,
      });
      const steleGeo = new THREE.PlaneGeometry(2.2, 3.2);
      const steleMesh = new THREE.Mesh(steleGeo, steleMat);
      steleMesh.position.set(0, 2.2, 0);
      group.add(steleMesh);

      // Stele 3D Stone Slab
      const slabGeo = new THREE.BoxGeometry(2.3, 3.3, 0.16);
      const slabMesh = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({
        color: 0x292524,
        roughness: 0.6,
        metalness: 0.2,
      }));
      slabMesh.position.set(0, 2.2, -0.08);
      group.add(slabMesh);

      // 3. Colonnade of 6 Classical Pillars of Interfaith Harmony
      const pillarRadius = 2.4;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const px = Math.cos(angle) * pillarRadius;
        const pz = Math.sin(angle) * pillarRadius;

        const pGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.0, 16);
        const pMesh = new THREE.Mesh(pGeo, whiteMaterial);
        pMesh.position.set(px, 2.0, pz);
        group.add(pMesh);

        // Gold Lotus Capitals
        const capGeo = new THREE.CylinderGeometry(0.28, 0.18, 0.2, 16);
        const capMesh = new THREE.Mesh(capGeo, polishedGold);
        capMesh.position.set(px, 3.55, pz);
        group.add(capMesh);
      }

      // 4. Pavilion Canopy Dome with Ethnic Frieze
      const domeGeo = new THREE.SphereGeometry(2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
      const domeMesh = new THREE.Mesh(domeGeo, goldMaterial);
      domeMesh.position.set(0, 3.55, 0);
      group.add(domeMesh);

      const finialGeo = new THREE.ConeGeometry(0.25, 1.2, 16);
      const finial = new THREE.Mesh(finialGeo, polishedGold);
      finial.position.set(0, 5.2, 0);
      group.add(finial);

      // 5. Eternal Flame of National Unity (Api Abadi Persatuan Bangsa)
      const flameGroup = new THREE.Group();
      flameGroup.name = 'eternalFlame';
      flameGroup.position.set(0, 1.1, 0.85);

      const flameAltarGeo = new THREE.CylinderGeometry(0.5, 0.65, 0.7, 16);
      const flameAltar = new THREE.Mesh(flameAltarGeo, polishedGold);
      flameGroup.add(flameAltar);

      const flameGeo = new THREE.OctahedronGeometry(0.42, 1);
      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.65;
      flameGroup.add(flameMesh);

      group.add(flameGroup);

      // 6. Red-and-White Ribbon of Unity encircling the pavilion
      const unityRingGeo = new THREE.TorusGeometry(2.45, 0.08, 16, 64);
      const unityRing = new THREE.Mesh(unityRingGeo, redMaterial);
      unityRing.rotation.x = Math.PI / 2;
      unityRing.position.y = 2.2;
      group.add(unityRing);
    }

    // -------------------------------------------------------------
    // MODEL 4: NKRI GLOBE GEOSPASIAL (WAWASAN NUSANTARA & KEPULAUAN)
    // -------------------------------------------------------------
    if (type === 'nkri') {
      const globeTex = createNkriGlobeTexture();

      // 1. Solid Mahogany & Marble Pedestal
      const pedestalBaseGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.45, 32);
      const pedestalBase = new THREE.Mesh(pedestalBaseGeo, marblePedestalMaterial);
      pedestalBase.position.y = 0.22;
      group.add(pedestalBase);

      const woodPedestalGeo = new THREE.CylinderGeometry(1.4, 1.7, 0.35, 24);
      const woodPedestal = new THREE.Mesh(woodPedestalGeo, woodMaterial);
      woodPedestal.position.y = 0.6;
      group.add(woodPedestal);

      const brassColumnGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.2, 16);
      const brassColumn = new THREE.Mesh(brassColumnGeo, polishedGold);
      brassColumn.position.y = 1.35;
      group.add(brassColumn);

      // 2. Brass Meridian Ring with Degree Ticks
      const meridianGeo = new THREE.TorusGeometry(2.1, 0.1, 16, 64);
      const meridian = new THREE.Mesh(meridianGeo, polishedGold);
      meridian.position.set(0, 2.7, 0);
      meridian.rotation.y = 0.42; // Axial tilt
      meridian.rotation.x = 0.25;
      group.add(meridian);

      // Polar Axis Spindle
      const polarGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.4, 16);
      const polarSpindle = new THREE.Mesh(polarGeo, polishedGold);
      polarSpindle.position.set(0, 2.7, 0);
      polarSpindle.rotation.x = 0.25;
      group.add(polarSpindle);

      // 3. Globe Sphere Mapped with True Indonesian Archipelago Texture
      const globeRadius = 1.85;
      const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 48);
      const globeMat = new THREE.MeshStandardMaterial({
        map: globeTex,
        metalness: 0.35,
        roughness: 0.45,
      });
      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      globeMesh.position.set(0, 2.7, 0);
      group.add(globeMesh);

      // 4. Tactile 3D Physical Islands hovering on globe surface
      const islandsGroup = new THREE.Group();
      islandsGroup.position.set(0, 2.7, 0);

      const tactileLandMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        metalness: 0.2,
        roughness: 0.5,
      });

      // Sumatra
      const sumatraGeo = new THREE.BoxGeometry(0.38, 1.25, 0.1);
      const sumatra = new THREE.Mesh(sumatraGeo, tactileLandMat);
      sumatra.position.set(-1.0, 0.2, 1.55);
      sumatra.rotation.z = -0.58;
      islandsGroup.add(sumatra);

      // Jawa
      const javaGeo = new THREE.BoxGeometry(1.2, 0.24, 0.1);
      const java = new THREE.Mesh(javaGeo, tactileLandMat);
      java.position.set(-0.4, -0.45, 1.68);
      java.rotation.z = -0.15;
      islandsGroup.add(java);

      // Kalimantan
      const kalimantanGeo = new THREE.DodecahedronGeometry(0.55);
      const kalimantan = new THREE.Mesh(kalimantanGeo, tactileLandMat);
      kalimantan.position.set(-0.2, 0.25, 1.72);
      islandsGroup.add(kalimantan);

      // Sulawesi
      const sulawesiGeo = new THREE.TorusGeometry(0.32, 0.09, 8, 16, Math.PI * 1.5);
      const sulawesi = new THREE.Mesh(sulawesiGeo, tactileLandMat);
      sulawesi.position.set(0.5, 0.08, 1.72);
      sulawesi.rotation.z = 0.85;
      islandsGroup.add(sulawesi);

      // Papua
      const papuaGeo = new THREE.BoxGeometry(0.95, 0.5, 0.12);
      const papua = new THREE.Mesh(papuaGeo, tactileLandMat);
      papua.position.set(1.2, -0.1, 1.55);
      papua.rotation.z = 0.22;
      islandsGroup.add(papua);

      // Deklarasi Djuanda Maritime Archipelagic Baseline Ring
      const djuandaRingGeo = new THREE.TorusGeometry(1.95, 0.04, 12, 64);
      const djuandaRing = new THREE.Mesh(djuandaRingGeo, redMaterial);
      djuandaRing.position.set(0, 0, 0);
      djuandaRing.rotation.x = 0.35;
      islandsGroup.add(djuandaRing);

      group.add(islandsGroup);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 cosmic dark blue
    scene.fog = new THREE.Fog(0x0f172a, 12, 30);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 8.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Procedural Studio Environment Map (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.6);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x0284c7, 0.6);
    scene.add(hemiLight);

    // Ground Contact Shadow Disc
    const groundShadowGeo = new THREE.CircleGeometry(3.2, 32);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // 6. Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip below ground
    controlsRef.current = controls;

    // Build the initial model
    buildModel(activeModel, modelGroup);

    // 8. Animation Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Auto rotation
      if (isAutoRotateRef.current) {
        modelGroup.rotation.y += 0.006;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Sync auto rotate ref
  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  // Rebuild model when activeModel changes
  useEffect(() => {
    if (modelGroupRef.current) {
      buildModel(activeModel, modelGroupRef.current);
      setActiveHotspotIndex(0);
      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.set(0, 0, 0);
      }
    }
  }, [activeModel]);

  // Handle Exploded View separation
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const group = modelGroupRef.current;

    const leftWing = group.getObjectByName('leftWing');
    const rightWing = group.getObjectByName('rightWing');
    const shield = group.getObjectByName('shield');
    const tail = group.getObjectByName('tail');

    const sep = isExploded ? 0.8 : 0;

    if (leftWing) leftWing.position.x = -sep;
    if (rightWing) rightWing.position.x = sep;
    if (shield) shield.position.z = 0.65 + sep * 0.8;
    if (tail) tail.position.y = 0.7 - sep * 0.5;
  }, [isExploded]);

  const currentInfo = MODEL_INFO[activeModel];
  const currentHotspot = currentInfo.hotspots[activeHotspotIndex] || currentInfo.hotspots[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-sky-600/15 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold">
            <Box size={14} className="text-amber-300" />
            <span>Laboratorium 3D Interaktif 4 Pilar Kebangsaan</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Eksplorasi Objek 3D Pendidikan Pancasila & Konstitusi
          </h2>

          <p className="text-xs md:text-sm text-sky-100 leading-relaxed font-medium">
            Media visualisasi 3D real-time untuk membedah filosofi luhur <b>Pancasila</b>, konstitusi{' '}
            <b>UUD NRI 1945</b>, semboyan <b>Bhinneka Tunggal Ika</b>, dan keutuhan geospasial{' '}
            <b>NKRI</b> di SMA Negeri 1 Mande (SMANDE).
          </p>

          {/* Quick Model Selector Pills in Banner */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {(
              [
                { id: 'garuda', label: '1. Garuda Pancasila', icon: Sparkles },
                { id: 'uud1945', label: '2. Kitab UUD 1945', icon: BookOpen },
                { id: 'bhinneka', label: '3. Bhinneka Tunggal Ika', icon: Layers },
                { id: 'nkri', label: '4. Globe NKRI Nusantara', icon: Compass },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveModel(m.id);
                  sound.playClick();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
                  activeModel === m.id
                    ? 'bg-amber-400 text-sky-950 scale-105 ring-2 ring-white/50'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
              >
                <m.icon size={14} />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-6 -bottom-8 text-[140px] md:text-[180px] opacity-10 pointer-events-none select-none">
          🏛️
        </div>
      </div>

      {/* 2. Interactive 3D Canvas Stage with Unified Collapsible Bottom Control Dock */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-300/80 bg-slate-950 aspect-[16/10] sm:aspect-[16/9] min-h-[460px] md:min-h-[560px]">
        {/* Three.js Canvas Mount Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left Minimalist Subject Badge */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-sky-500/40 text-white shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-black tracking-wide text-amber-300">
              {currentInfo.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-bold text-sky-100 hidden sm:inline">
              {currentInfo.name}
            </span>
          </div>
        </div>

        {/* Top-Right Quick Interaction Hints */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              setIsAutoRotate(!isAutoRotate);
              sound.playClick();
            }}
            title={isAutoRotate ? 'Jeda Putaran Otomatis' : 'Mulai Putaran Otomatis'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 ${
              isAutoRotate
                ? 'bg-sky-600/90 text-white border-sky-400'
                : 'bg-slate-900/80 text-sky-200 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <RotateCw size={13} className={isAutoRotate ? 'animate-spin-slow' : ''} />
            <span className="hidden sm:inline">Rotasi</span>
          </button>

          {activeModel === 'garuda' && (
            <button
              onClick={() => {
                setIsExploded(!isExploded);
                sound.playClick();
              }}
              title="Pisahkan Bagian untuk Inspeksi"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 ${
                isExploded
                  ? 'bg-amber-400 text-sky-950 border-amber-300'
                  : 'bg-slate-900/80 text-sky-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Layers size={13} />
              <span>{isExploded ? 'Satukan Model' : 'Pilah Bagian (Exploded)'}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (controlsRef.current) {
                controlsRef.current.reset();
                sound.playClick();
              }
            }}
            title="Reset Posisi Kamera"
            className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sky-200 hover:text-white backdrop-blur-md shadow-md"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Viewport Interaction Gesture Notice */}
        <div className="absolute bottom-28 left-4 z-10 pointer-events-none hidden sm:block">
          <div className="text-[11px] font-medium text-sky-300/80 bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-sky-900/40">
            🖱️ Klik & geser untuk memutar • Gulir untuk zoom • Klik kanan untuk menggeser
          </div>
        </div>

        {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30 transition-transform duration-300">
          <div className="bg-slate-900/90 backdrop-blur-md border-2 border-sky-500/50 rounded-2xl shadow-2xl p-3 md:p-4 text-white space-y-3">
            {/* Dock Header with Collapse Toggle */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-300 flex items-center gap-1">
                  <Sparkles size={14} /> Inspeksi Interaktif Materi
                </span>
                <span className="text-[10px] bg-sky-800/80 px-2 py-0.5 rounded-full text-sky-200 font-bold">
                  {activeHotspotIndex + 1} dari {currentInfo.hotspots.length} Bagian
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-300 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
                >
                  <span>{isHudCollapsed ? 'Tampilkan Penjelasan' : 'Sembunyikan'}</span>
                  {isHudCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {/* Hotspot Pills Selection Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {currentInfo.hotspots.map((spot, idx) => (
                <button
                  key={spot.title}
                  onClick={() => {
                    setActiveHotspotIndex(idx);
                    sound.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    activeHotspotIndex === idx
                      ? 'bg-amber-400 text-sky-950 font-black shadow-sm scale-105'
                      : 'bg-slate-800/80 text-sky-200 hover:bg-slate-700'
                  }`}
                >
                  {spot.title.split('(')[0]}
                </button>
              ))}
            </div>

            {/* Expanded Educational Insight Body */}
            {!isHudCollapsed && (
              <div className="bg-slate-950/70 rounded-xl p-3 border border-sky-900/60 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-sm text-amber-300">
                    {currentHotspot.title}
                  </div>
                  <button
                    onClick={() =>
                      speakHotspot(
                        `${currentHotspot.title}. ${currentHotspot.description}. Makna kontekstual: ${currentHotspot.significance}`
                      )
                    }
                    title="Dengarkan Penjelasan Suara"
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-300 hover:text-white bg-sky-800/60 px-2 py-1 rounded-lg"
                  >
                    <Volume2 size={13} />
                    <span>Dengarkan</span>
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed font-medium">
                  {currentHotspot.description}
                </p>

                <div className="p-2 bg-sky-900/30 rounded-lg border border-sky-800/40 text-[11px] text-sky-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-300 shrink-0" />
                  <span>
                    <b>Penerapan Siswa SMANDE:</b> {currentHotspot.significance}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Deep Educational Curriculum Cards for the 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(
          [
            {
              id: 'garuda' as ModelType,
              title: 'Pancasila Dasar Negara',
              desc: 'Filosofi lima sila sebagai meja statis pemersatu dan bintang penuntun (leitstar dinamis) kehidupan berbangsa.',
              points: ['5 Lambang Sila Heraldis', '17-8-1945 Makna Bulu', 'Cengkeraman Bhinneka'],
              badge: 'Pilar 1',
              borderColor: 'border-amber-300',
            },
            {
              id: 'uud1945' as ModelType,
              title: 'UUD NRI Tahun 1945',
              desc: 'Hukum dasar tertulis tertinggi, pembatasan kekuasaan negara, dan jaminan perlindungan HAM warga negara.',
              points: ['4 Pokok Pikiran Pembukaan', '4 Tahap Amandemen MPR', 'Hierarki Lex Superior'],
              badge: 'Pilar 2',
              borderColor: 'border-emerald-300',
            },
            {
              id: 'bhinneka' as ModelType,
              title: 'Bhinneka Tunggal Ika',
              desc: 'Semboyan toleransi mempersatukan 1.340 suku bangsa dan 6 agama dalam ikatan persaudaraan sejati.',
              points: ['Kitab Sutasoma Mpu Tantular', 'Moderasi Beragama Damai', 'Gotong Royong Kebudayaan'],
              badge: 'Pilar 3',
              borderColor: 'border-blue-300',
            },
            {
              id: 'nkri' as ModelType,
              title: 'Negara Kesatuan RI',
              desc: 'Kedaulatan wilayah tanah air dari Sabang sampai Merauke yang tidak terpisahkan dan wajib dibela segenap warga.',
              points: ['Deklarasi Djuanda 1957', '38 Provinsi & Batas Terluar', 'Wawasan Nusantara Geopolitik'],
              badge: 'Pilar 4',
              borderColor: 'border-red-300',
            },
          ]
        ).map((card) => {
          const isSelected = activeModel === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                setActiveModel(card.id);
                sound.playClick();
              }}
              className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50/40'
                  : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {card.badge}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-extrabold text-sky-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Sedang Ditampilkan
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-base text-slate-900">{card.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                {card.points.map((pt) => (
                  <div key={pt} className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
