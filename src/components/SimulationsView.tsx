import React, { useState } from 'react';
import { simulationsData } from '../data/simulationsData';
import { SimulationScenario } from '../types';
import { sound } from '../utils/audio';
import { Vote, CheckCircle2, Shield, Award, Sparkles, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react';

export const SimulationsView: React.FC<{ onBadgeEarned?: (badgeTitle: string) => void }> = ({ onBadgeEarned }) => {
  const [selectedSim, setSelectedSim] = useState<SimulationScenario>(simulationsData[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSimCompleted, setIsSimCompleted] = useState(false);
  const [studentReflection, setStudentReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const activeStep = selectedSim.steps[currentStepIdx];
  const chosenOption = activeStep?.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    setShowFeedback(true);
    const opt = activeStep.options.find((o) => o.id === optId);
    if (opt?.isRecommended) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < selectedSim.steps.length - 1) {
      setCurrentStepIdx((p) => p + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
      sound.playClick();
    } else {
      setIsSimCompleted(true);
      sound.playVictory();
      if (onBadgeEarned) {
        onBadgeEarned(selectedSim.badgeTitle);
      }
    }
  };

  const handleReset = (sim: SimulationScenario) => {
    setSelectedSim(sim);
    setCurrentStepIdx(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setIsSimCompleted(false);
    setStudentReflection('');
    setReflectionSaved(false);
    sound.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border border-sky-500 rounded-3xl p-6 md:p-8 shadow-xl text-white">
        <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5 mb-2">
          <Vote size={15} /> Praktik Demokrasi & Musyawarah • SMA Negeri 1 Mande (SMANDE)
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          🇮🇩 Laboratorium Simulasi Demokrasi Pancasila
        </h2>
        <p className="text-xs md:text-sm text-sky-100 max-w-2xl leading-relaxed">
          Belajar berdemokrasi bukan sekadar menghafal definisi buku, tetapi berlatih mengambil keputusan berani, bijaksana, dan berlandaskan musyawarah mufakat demi kemaslahatan bersama.
        </p>

        {/* Simulation Selector Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          {simulationsData.map((sim) => (
            <button
              key={sim.id}
              onClick={() => handleReset(sim)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSim.id === sim.id
                  ? 'bg-white text-sky-800 font-black shadow-md'
                  : 'bg-sky-800/80 text-sky-100 hover:text-white border border-sky-500/50'
              }`}
            >
              {sim.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-3xl mx-auto">
        {!isSimCompleted ? (
          <div>
            {/* Step Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Tahap {currentStepIdx + 1} dari {selectedSim.steps.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Pencapaian: {selectedSim.badgeTitle}
              </span>
            </div>

            {/* Context & Background */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl mb-4 text-xs text-slate-300 leading-relaxed shadow-inner">
              <span className="font-bold text-red-400 block mb-1">Konteks Sejarah / Peristiwa:</span>
              {selectedSim.background}
            </div>

            {/* Step Narrative */}
            <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl mb-6">
              <h4 className="text-base font-bold text-white mb-2">{activeStep.title}</h4>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{activeStep.narrative}</p>
            </div>

            {/* Choices */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Pilihan Tindakan Keputusanmu:
              </span>
              {activeStep.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={showFeedback}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm transition-all leading-relaxed ${
                      isSelected
                        ? opt.isRecommended
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold shadow-md'
                          : 'bg-red-950/70 border-red-500 text-red-200 shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* Feedback and Sila Correlation */}
            {showFeedback && chosenOption && (
              <div
                className={`p-5 rounded-2xl border mb-6 animate-fade-in ${
                  chosenOption.isRecommended
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                    : 'bg-red-950/50 border-red-500/60 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                  <CheckCircle2 size={18} className={chosenOption.isRecommended ? 'text-emerald-400' : 'text-red-400'} />
                  <span>Korelasi Nilai: {chosenOption.silaCorrelation}</span>
                </div>
                <p className="text-xs leading-relaxed mb-4">{chosenOption.feedback}</p>

                <button
                  onClick={handleNextStep}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  {currentStepIdx < selectedSim.steps.length - 1 ? 'Lanjut ke Tahap Berikutnya ⏩' : 'Selesaikan Simulasi & Refleksi 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completion & Student Reflection */
          <div className="space-y-6">
            <div className="text-center py-6 bg-slate-950 border border-slate-800 rounded-3xl p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
                <Award size={36} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Simulasi Selesai dengan Baik!</h3>
              <p className="text-xs text-slate-400 mb-3">
                Kamu telah dianugerahi gelar kehormatan: <span className="text-amber-300 font-bold">{selectedSim.badgeTitle}</span>
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                +100 Poin Demokrasi
              </span>
            </div>

            {/* Reflection Prompt */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} /> Refleksi Pribadi Siswa:
              </h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {selectedSim.reflectionPrompt}
              </p>

              {!reflectionSaved ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={studentReflection}
                    onChange={(e) => setStudentReflection(e.target.value)}
                    placeholder="Tuliskan renungan dan komitmen perilakumu di sekolah..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-red-500 outline-none"
                  />
                  <button
                    disabled={!studentReflection.trim()}
                    onClick={() => {
                      setReflectionSaved(true);
                      sound.playCorrect();
                    }}
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Simpan Catatan Refleksi
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Catatan refleksimu telah tersimpan dalam portofolio Profil Pelajar Pancasila!
                </div>
              )}
            </div>

            <button
              onClick={() => handleReset(selectedSim)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              <RotateCcw size={14} /> Mainkan Ulang Skenario Ini
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
