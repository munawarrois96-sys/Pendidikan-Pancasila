import React, { useState } from 'react';
import { MaterialSection } from '../types';
import { sound } from '../utils/audio';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import {
  BookOpen,
  CheckCircle2,
  Play,
  FileText,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Printer,
  Sparkles,
  Shield,
  Clock,
  Send,
} from 'lucide-react';

interface MaterialDetailProps {
  material: MaterialSection;
  onTakeQuiz: (quizId: string) => void;
  onNextMaterial?: () => void;
  onPrevMaterial?: () => void;
  onCompleteMaterial?: (materialId: string) => void;
}

export const MaterialDetailView: React.FC<MaterialDetailProps> = ({
  material,
  onTakeQuiz,
  onNextMaterial,
  onPrevMaterial,
  onCompleteMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<'teori' | 'video' | 'kasus' | 'lkpd'>('teori');
  const [lkpdAnswers, setLkpdAnswers] = useState<Record<string, string>>({});
  const [lkpdSubmitted, setLkpdSubmitted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleLkpdSubmit = () => {
    sound.playVictory();
    setLkpdSubmitted(true);
    if (onCompleteMaterial) {
      onCompleteMaterial(material.id);
    }
  };

  const handlePrintLkpd = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-500 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-white text-sky-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Fase {material.grade === 'X' ? 'E' : 'F'} (Kelas {material.grade})
            </span>
            <span className="text-xs text-amber-300 font-bold bg-sky-800/80 px-2.5 py-1 rounded-full border border-sky-400/60">
              Bab {material.chapterNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-sky-100">
            <Clock size={14} />
            <span>Alokasi Waktu: {material.durationMinutes} Menit</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
          {material.title}
        </h1>
        <p className="text-sky-100 text-sm md:text-base max-w-3xl leading-relaxed mb-6 font-medium">
          {material.subtitle}
        </p>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sky-500/60">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-sky-100 mr-2">Pilar Sila Terkait:</span>
            {material.pancasilaPillars.map((p) => (
              <span
                key={p}
                className="w-7 h-7 rounded-lg bg-sky-800 text-amber-300 border border-sky-400/60 flex items-center justify-center font-bold text-xs"
                title={`Sila Ke-${p}`}
              >
                {p}
              </span>
            ))}
          </div>

          <button
            onClick={() => onTakeQuiz(material.relatedQuizId)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-sky-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={16} />
            <span>Uji Pemahaman Saya (Kuis)</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-sky-200 pb-2 overflow-x-auto">
        {[
          { id: 'teori', label: '📖 Materi & Teori', icon: BookOpen },
          { id: 'video', label: '🎬 Video Pembelajaran', icon: Play },
          { id: 'kasus', label: '🔍 Studi Kasus Nyata', icon: Shield },
          { id: 'lkpd', label: '📝 LKPD Interaktif', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-100'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Teori & Ringkasan */}
      {activeTab === 'teori' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Learning Objectives */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} /> Capaian & Tujuan Pembelajaran:
              </h3>
              <ul className="space-y-2">
                {material.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-2">Ringkasan Konsep Kunci</h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{material.summary}</p>
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              {material.contentBlocks.map((block, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-white mb-3 text-red-400">{block.heading}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{block.text}</p>

                  {block.keyPoints && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Poin Telaah Penting:
                      </span>
                      {block.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Quick Checklist and Next Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20 shadow-xl">
              <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" /> Alur Belajar Siswa
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 size={14} /> Membaca Rangkuman Teori
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" /> Simak Video Pembelajaran
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" /> Analisis Studi Kasus Nyata
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" /> Kerjakan LKPD Digital
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" /> Uji Pemahaman Kuis
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => onTakeQuiz(material.relatedQuizId)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 font-bold text-xs text-white rounded-xl shadow-md transition-all"
                >
                  Langsung Buka Kuis Materi Ini 🚀
                </button>
                <div className="flex gap-2">
                  {onPrevMaterial && (
                    <button
                      onClick={onPrevMaterial}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={13} /> Sebelumnya
                    </button>
                  )}
                  {onNextMaterial && (
                    <button
                      onClick={onNextMaterial}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1"
                    >
                      Materi Lanjut <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Video Pembelajaran */}
      {activeTab === 'video' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Interactive Player with full animated graphics and YouTube mode */}
          <InteractiveVideoPlayer
            material={material}
            onTakeQuiz={onTakeQuiz}
          />

          {/* Key Takeaways & Discussion Guide */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-sky-800/40 shadow-xl">
            <h4 className="font-extrabold text-sm text-amber-400 mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              Poin Intisari Tayangan Video Animasi:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {material.video.keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 font-medium leading-relaxed">{kp}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Setelah menyimak video pembelajaran di atas, lanjut uji pemahaman Anda melalui kuis interaktif.
              </span>
              <button
                onClick={() => onTakeQuiz(material.relatedQuizId)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Buka Kuis Evaluasi</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Studi Kasus */}
      {activeTab === 'kasus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-bold mb-3">
            <Shield size={16} /> Analisis Masalah Kehidupan Berbangsa
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{material.caseStudy.title}</h2>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-5 text-sm text-slate-200 leading-relaxed shadow-inner">
            <span className="font-bold text-slate-400 text-xs block mb-1">Konteks Kasus:</span>
            {material.caseStudy.context}
          </div>

          <div className="bg-red-950/30 border border-red-500/40 p-5 rounded-2xl mb-6">
            <span className="font-bold text-red-300 text-xs block mb-1 flex items-center gap-1.5">
              <HelpCircle size={14} /> Pertanyaan Kritis:
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">{material.caseStudy.question}</p>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-2xl">
            <span className="font-bold text-emerald-300 text-xs block mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Panduan Refleksi Moral Pancasila:
            </span>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">{material.caseStudy.moralGuidance}</p>
          </div>
        </div>
      )}

      {/* TAB 4: LKPD Interaktif */}
      {activeTab === 'lkpd' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Lembar Kerja Peserta Didik (LKPD)
              </span>
              <h3 className="text-xl font-bold text-white">{material.lkpd.title}</h3>
            </div>
            <button
              onClick={handlePrintLkpd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
            >
              <Printer size={15} /> Cetak / Unduh PDF
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6">
            <span className="font-bold text-amber-400 block mb-1">Petunjuk Pengerjaan:</span>
            <ul className="list-disc list-inside space-y-1">
              {material.lkpd.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {material.lkpd.questions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <label className="text-xs md:text-sm font-bold text-white flex items-start gap-2">
                  <span className="text-red-400 font-black">Soal {idx + 1}:</span>
                  <span>{q.prompt}</span>
                </label>
                <textarea
                  rows={4}
                  value={lkpdAnswers[q.id] || ''}
                  onChange={(e) => setLkpdAnswers({ ...lkpdAnswers, [q.id]: e.target.value })}
                  placeholder="Tuliskan jawaban analisismu di sini secara runut dan objektif..."
                  disabled={lkpdSubmitted}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 focus:border-red-500 outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            {!lkpdSubmitted ? (
              <button
                onClick={handleLkpdSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 font-bold text-white text-xs md:text-sm rounded-xl shadow-lg transition-all"
              >
                <Send size={15} /> Simpan & Kumpulkan Jawaban LKPD
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-950/40 border border-emerald-500/40 px-4 py-2 rounded-xl">
                <CheckCircle2 size={18} /> LKPD Berhasil Dikumpulkan & Dicatat dalam Riwayat Guru!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
