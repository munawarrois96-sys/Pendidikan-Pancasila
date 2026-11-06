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

    const blackShieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.35,
    });

    const marblePedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.4,
      roughness: 0.5,
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      metalness: 0.15,
      roughness: 0.65,
    });

    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.25,
    });

    const landMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.2,
      roughness: 0.55,
    });

    // -------------------------------------------------------------
    // MODEL 1: GARUDA PANCASILA & PERISAI
    // -------------------------------------------------------------
    if (type === 'garuda') {
      // 1. Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.4, 32);
      const baseMesh = new THREE.Mesh(baseGeo, marblePedestalMaterial);
      baseMesh.position.y = 0.2;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // Gold base trim
      const trimGeo = new THREE.TorusGeometry(2.45, 0.08, 16, 64);
      const trimMesh = new THREE.Mesh(trimGeo, goldMaterial);
      trimMesh.rotation.x = Math.PI / 2;
      trimMesh.position.y = 0.4;
      group.add(trimMesh);

      // 2. Eagle Body & Torso
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'bodyPart';

      const torsoGeo = new THREE.CylinderGeometry(0.8, 0.5, 2.2, 16);
      const torsoMesh = new THREE.Mesh(torsoGeo, goldMaterial);
      torsoMesh.position.y = 1.9;
      bodyGroup.add(torsoMesh);

      // 3. Eagle Head & Crown (45 feathers crest)
      const headGeo = new THREE.ConeGeometry(0.55, 1.0, 16);
      const headMesh = new THREE.Mesh(headGeo, polishedGold);
      headMesh.position.set(0, 3.2, 0.2);
      headMesh.rotation.x = 0.4;
      bodyGroup.add(headMesh);

      // Beak
      const beakGeo = new THREE.ConeGeometry(0.2, 0.5, 8);
      const beakMesh = new THREE.Mesh(beakGeo, new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.7, roughness: 0.3 }));
      beakMesh.position.set(0, 3.1, 0.8);
      beakMesh.rotation.x = Math.PI / 2;
      bodyGroup.add(beakMesh);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.25, 3.25, 0.45);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.25, 3.25, 0.45);
      bodyGroup.add(leftEye, rightEye);

      // 4. Wings (17 feathers each side)
      const leftWingGroup = new THREE.Group();
      leftWingGroup.name = 'leftWing';
      for (let i = 0; i < 17; i++) {
        const angle = 0.1 + i * 0.08;
        const featherGeo = new THREE.BoxGeometry(0.12, 1.8 - i * 0.06, 0.08);
        const feather = new THREE.Mesh(featherGeo, goldMaterial);
        feather.position.set(-1.1 - i * 0.12, 2.3 + Math.sin(angle) * 0.7, -i * 0.03);
        feather.rotation.z = 0.4 + i * 0.06;
        leftWingGroup.add(feather);
      }
      group.add(leftWingGroup);

      const rightWingGroup = new THREE.Group();
      rightWingGroup.name = 'rightWing';
      for (let i = 0; i < 17; i++) {
        const angle = 0.1 + i * 0.08;
        const featherGeo = new THREE.BoxGeometry(0.12, 1.8 - i * 0.06, 0.08);
        const feather = new THREE.Mesh(featherGeo, goldMaterial);
        feather.position.set(1.1 + i * 0.12, 2.3 + Math.sin(angle) * 0.7, -i * 0.03);
        feather.rotation.z = -(0.4 + i * 0.06);
        rightWingGroup.add(feather);
      }
      group.add(rightWingGroup);

      // 5. Tail (8 feathers)
      const tailGroup = new THREE.Group();
      tailGroup.name = 'tail';
      for (let i = 0; i < 8; i++) {
        const tailGeo = new THREE.BoxGeometry(0.18, 1.2, 0.06);
        const tailFeather = new THREE.Mesh(tailGeo, goldMaterial);
        const spread = (i - 3.5) * 0.18;
        tailFeather.position.set(spread, 0.7, -0.3);
        tailFeather.rotation.z = spread * -0.5;
        tailGroup.add(tailFeather);
      }
      group.add(tailGroup);

      // 6. Central Heraldic Shield (Perisai 5 Sila)
      const shieldGroup = new THREE.Group();
      shieldGroup.name = 'shield';
      shieldGroup.position.set(0, 1.9, 0.65);

      // Shield Frame
      const shieldFrameGeo = new THREE.BoxGeometry(1.5, 1.7, 0.18);
      const shieldFrameMesh = new THREE.Mesh(shieldFrameGeo, goldMaterial);
      shieldGroup.add(shieldFrameMesh);

      // 4 Quadrants (Red & White)
      const qTopLeft = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.75, 0.05), redMaterial);
      qTopLeft.position.set(-0.35, 0.4, 0.1);
      const qTopRight = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.75, 0.05), whiteMaterial);
      qTopRight.position.set(0.35, 0.4, 0.1);
      const qBottomLeft = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.75, 0.05), whiteMaterial);
      qBottomLeft.position.set(-0.35, -0.4, 0.1);
      const qBottomRight = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.75, 0.05), redMaterial);
      qBottomRight.position.set(0.35, -0.4, 0.1);
      shieldGroup.add(qTopLeft, qTopRight, qBottomLeft, qBottomRight);

      // Center Heart/Star Shield (Sila 1)
      const centerShield = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 5), blackShieldMaterial);
      centerShield.position.set(0, 0, 0.14);
      centerShield.rotation.x = Math.PI / 2;
      centerShield.rotation.y = Math.PI;
      shieldGroup.add(centerShield);

      // Sila 1 Golden Star Emblem
      const starGeo = new THREE.DodecahedronGeometry(0.18);
      const starMesh = new THREE.Mesh(starGeo, polishedGold);
      starMesh.position.set(0, 0, 0.22);
      shieldGroup.add(starMesh);

      // Sila 2: Golden Chain ring in bottom-right
      const chainGeo = new THREE.TorusGeometry(0.14, 0.03, 8, 16);
      const chainMesh = new THREE.Mesh(chainGeo, polishedGold);
      chainMesh.position.set(0.35, -0.4, 0.16);
      shieldGroup.add(chainMesh);

      // Sila 3: Banyan Tree in top-right
      const banyanGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const banyanMesh = new THREE.Mesh(banyanGeo, new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 }));
      banyanMesh.position.set(0.35, 0.4, 0.16);
      shieldGroup.add(banyanMesh);

      // Sila 4: Bull Head in top-left
      const bullGeo = new THREE.ConeGeometry(0.15, 0.26, 6);
      const bullMesh = new THREE.Mesh(bullGeo, new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4 }));
      bullMesh.position.set(-0.35, 0.4, 0.16);
      shieldGroup.add(bullMesh);

      // Sila 5: Rice and Cotton in bottom-left
      const riceGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
      const riceMesh = new THREE.Mesh(riceGeo, polishedGold);
      riceMesh.position.set(-0.35, -0.4, 0.16);
      riceMesh.rotation.z = 0.5;
      shieldGroup.add(riceMesh);

      group.add(shieldGroup);

      // 7. White Silk Ribbon ("BHINNEKA TUNGGAL IKA")
      const ribbonGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.28, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
      const ribbonMesh = new THREE.Mesh(ribbonGeo, whiteMaterial);
      ribbonMesh.position.set(0, 0.45, 0.4);
      ribbonMesh.rotation.x = -0.2;
      group.add(ribbonMesh);

      group.add(bodyGroup);
    }

    // -------------------------------------------------------------
    // MODEL 2: KITAB KONSTITUSI UUD NRI 1945
    // -------------------------------------------------------------
    if (type === 'uud1945') {
      // 1. Pedestal Altar
      const altarGeo = new THREE.BoxGeometry(4.2, 0.4, 3.2);
      const altarMesh = new THREE.Mesh(altarGeo, marblePedestalMaterial);
      altarMesh.position.y = 0.2;
      group.add(altarMesh);

      // 2. Open Monumental Constitution Book
      const bookGroup = new THREE.Group();
      bookGroup.name = 'constitutionBook';
      bookGroup.position.set(0, 1.2, 0);

      // Left Cover & Page
      const leftPageGeo = new THREE.BoxGeometry(1.6, 0.22, 2.2);
      const leftPageMesh = new THREE.Mesh(leftPageGeo, whiteMaterial);
      leftPageMesh.position.set(-0.85, 0, 0);
      leftPageMesh.rotation.z = 0.08;
      bookGroup.add(leftPageMesh);

      // Right Cover & Page
      const rightPageGeo = new THREE.BoxGeometry(1.6, 0.22, 2.2);
      const rightPageMesh = new THREE.Mesh(rightPageGeo, whiteMaterial);
      rightPageMesh.position.set(0.85, 0, 0);
      rightPageMesh.rotation.z = -0.08;
      bookGroup.add(rightPageMesh);

      // Book Spine & Gold Rim
      const spineGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.3, 16);
      const spineMesh = new THREE.Mesh(spineGeo, goldMaterial);
      spineMesh.rotation.x = Math.PI / 2;
      spineMesh.position.set(0, -0.05, 0);
      bookGroup.add(spineMesh);

      // Embossed Gold Garuda Seal on Left Page
      const sealGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.04, 24);
      const sealMesh = new THREE.Mesh(sealGeo, polishedGold);
      sealMesh.position.set(-0.85, 0.15, 0);
      bookGroup.add(sealMesh);

      // 4 Amandemen Pillars (1999, 2000, 2001, 2002) around the book
      const pillarPositions = [
        [-1.8, 0.4, -1.2],
        [-1.8, 0.4, 1.2],
        [1.8, 0.4, -1.2],
        [1.8, 0.4, 1.2],
      ];
      pillarPositions.forEach(([x, y, z]) => {
        const pillarGeo = new THREE.CylinderGeometry(0.16, 0.2, 1.6, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, polishedGold);
        pillarMesh.position.set(x, y + 0.8, z);
        group.add(pillarMesh);

        // Pillar capital sphere
        const capGeo = new THREE.SphereGeometry(0.2, 12, 12);
        const capMesh = new THREE.Mesh(capGeo, whiteMaterial);
        capMesh.position.set(x, y + 1.7, z);
        group.add(capMesh);
      });

      // Hierarchy Lex Superior Stele (Piramida Hukum)
      const hierarchyGroup = new THREE.Group();
      hierarchyGroup.name = 'hierarchyPyramid';
      for (let lvl = 0; lvl < 5; lvl++) {
        const stepWidth = 1.6 - lvl * 0.26;
        const stepGeo = new THREE.BoxGeometry(stepWidth, 0.15, 0.6);
        const stepMat = lvl === 0 ? redMaterial : lvl === 1 ? goldMaterial : whiteMaterial;
        const stepMesh = new THREE.Mesh(stepGeo, stepMat);
        stepMesh.position.set(0, 2.2 + lvl * 0.16, -0.5);
        hierarchyGroup.add(stepMesh);
      }
      group.add(hierarchyGroup);

      group.add(bookGroup);
    }

    // -------------------------------------------------------------
    // MODEL 3: PAVILIUN MONUMEN BHINNEKA TUNGGAL IKA
    // -------------------------------------------------------------
    if (type === 'bhinneka') {
      // 1. Lotus Base Plinth
      const baseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.5, 32);
      const baseMesh = new THREE.Mesh(baseGeo, marblePedestalMaterial);
      baseMesh.position.y = 0.25;
      group.add(baseMesh);

      // 2. Ring of 6 Pillars of Interfaith Harmony
      const pillarRadius = 2.0;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const px = Math.cos(angle) * pillarRadius;
        const pz = Math.sin(angle) * pillarRadius;

        const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.8, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, whiteMaterial);
        pillarMesh.position.set(px, 1.8, pz);
        group.add(pillarMesh);

        // Gold capitals
        const capGeo = new THREE.CylinderGeometry(0.26, 0.2, 0.15, 16);
        const capMesh = new THREE.Mesh(capGeo, goldMaterial);
        capMesh.position.set(px, 3.25, pz);
        group.add(capMesh);
      }

      // 3. Pavilion Dome / Canopy
      const domeGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh = new THREE.Mesh(domeGeo, goldMaterial);
      domeMesh.position.set(0, 3.25, 0);
      group.add(domeMesh);

      // Dome Finial Tip
      const finialGeo = new THREE.ConeGeometry(0.2, 1.0, 16);
      const finialMesh = new THREE.Mesh(finialGeo, polishedGold);
      finialMesh.position.set(0, 4.8, 0);
      group.add(finialMesh);

      // 4. Central Monumental Flame of Unity
      const flameGeo = new THREE.OctahedronGeometry(0.55, 1);
      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.1,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, 1.8, 0);
      group.add(flameMesh);

      // Pedestal for flame
      const flameBaseGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 16);
      const flameBase = new THREE.Mesh(flameBaseGeo, marblePedestalMaterial);
      flameBase.position.set(0, 0.9, 0);
      group.add(flameBase);

      // 5. Ribbon of Unity Wrapping the Pavilion
      const ribbonGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
      const ribbonMesh = new THREE.Mesh(ribbonGeo, redMaterial);
      ribbonMesh.rotation.x = Math.PI / 2;
      ribbonMesh.position.set(0, 2.2, 0);
      group.add(ribbonMesh);
    }

    // -------------------------------------------------------------
    // MODEL 4: GLOBE GEOSPASIAL NKRI (WAWASAN NUSANTARA)
    // -------------------------------------------------------------
    if (type === 'nkri') {
      // 1. Heavy Brass / Marble Stand
      const standBaseGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.4, 32);
      const standBase = new THREE.Mesh(standBaseGeo, marblePedestalMaterial);
      standBase.position.y = 0.2;
      group.add(standBase);

      const standColumnGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.4, 16);
      const standColumn = new THREE.Mesh(standColumnGeo, goldMaterial);
      standColumn.position.y = 1.0;
      group.add(standColumn);

      // 2. Brass Meridian Ring
      const meridianGeo = new THREE.TorusGeometry(1.85, 0.09, 16, 64);
      const meridianMesh = new THREE.Mesh(meridianGeo, polishedGold);
      meridianMesh.position.set(0, 2.4, 0);
      meridianMesh.rotation.y = 0.4;
      group.add(meridianMesh);

      // 3. The 3D Earth Globe (with Indonesian Archipelago emphasis)
      const globeRadius = 1.6;
      const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 36);
      const globeMesh = new THREE.Mesh(globeGeo, oceanMaterial);
      globeMesh.position.set(0, 2.4, 0);
      group.add(globeMesh);

      // Archipelago Continental Landmass Islands (Procedural Indonesian Island Chain)
      const islandsGroup = new THREE.Group();
      islandsGroup.position.set(0, 2.4, 0);

      // Sumatra Island Arc
      const sumatraGeo = new THREE.BoxGeometry(0.35, 1.2, 0.12);
      const sumatra = new THREE.Mesh(sumatraGeo, landMaterial);
      sumatra.position.set(-0.85, 0.15, 1.35);
      sumatra.rotation.z = -0.55;
      islandsGroup.add(sumatra);

      // Java Island Chain (SMANDE Cianjur)
      const javaGeo = new THREE.BoxGeometry(1.1, 0.22, 0.14);
      const java = new THREE.Mesh(javaGeo, landMaterial);
      java.position.set(-0.35, -0.4, 1.45);
      java.rotation.z = -0.15;
      islandsGroup.add(java);

      // Kalimantan Island
      const kalimantanGeo = new THREE.DodecahedronGeometry(0.48);
      const kalimantan = new THREE.Mesh(kalimantanGeo, landMaterial);
      kalimantan.position.set(-0.15, 0.2, 1.48);
      islandsGroup.add(kalimantan);

      // Sulawesi K-Shaped Island
      const sulawesiGeo = new THREE.TorusGeometry(0.28, 0.08, 8, 16, Math.PI * 1.5);
      const sulawesi = new THREE.Mesh(sulawesiGeo, landMaterial);
      sulawesi.position.set(0.45, 0.05, 1.48);
      sulawesi.rotation.z = 0.8;
      islandsGroup.add(sulawesi);

      // Papua Island
      const papuaGeo = new THREE.BoxGeometry(0.9, 0.45, 0.16);
      const papua = new THREE.Mesh(papuaGeo, landMaterial);
      papua.position.set(1.1, -0.1, 1.35);
      papua.rotation.z = 0.25;
      islandsGroup.add(papua);

      // Red-White Maritime Border Ring (Deklarasi Djuanda 1957)
      const djuandaRingGeo = new THREE.TorusGeometry(1.68, 0.04, 12, 64);
      const djuandaRing = new THREE.Mesh(djuandaRingGeo, redMaterial);
      djuandaRing.position.set(0, 0, 0);
      djuandaRing.rotation.x = 0.3;
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
