import React, { useState } from 'react';
import { nusantaraData, ProvinceCulture } from '../data/nusantaraData';
import { sound } from '../utils/audio';
import { MapPin, Sparkles, Compass, Home, HeartHandshake, ShieldCheck } from 'lucide-react';

export const NusantaraInteractiveMap: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceCulture>(nusantaraData[3]); // default DKI / Jawa
  const [selectedIsland, setSelectedIsland] = useState<string>('Semua');

  const islands = ['Semua', 'Sumatera', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Papua'];

  const filteredProvinces = nusantaraData.filter(
    (p) => selectedIsland === 'Semua' || p.island === selectedIsland
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Compass size={14} /> Peta Eksplorasi Kebinekaan
          </span>
          <h3 className="text-xl font-bold">Kearifan Lokal Gotong Royong 38 Provinsi</h3>
        </div>

        {/* Island filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {islands.map((isl) => (
            <button
              key={isl}
              onClick={() => {
                setSelectedIsland(isl);
                sound.playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIsland === isl
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Province Selection List / Visual Grid */}
        <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-2">
          {filteredProvinces.map((prov) => {
            const isSelected = selectedProvince.id === prov.id;
            return (
              <div
                key={prov.id}
                onClick={() => {
                  setSelectedProvince(prov);
                  sound.playClick();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-950/60 border-red-500 ring-2 ring-red-500/50 shadow-lg'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{prov.name}</h5>
                    <span className="text-[11px] text-slate-400">
                      {prov.island} • {prov.capital}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                    {prov.gotongRoyongWisdom.term}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Province Cultural Detail Card */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-xs uppercase tracking-widest text-red-400 font-bold">
                  Wilayah Kepulauan {selectedProvince.island}
                </span>
                <h4 className="text-2xl font-black text-white mt-0.5">{selectedProvince.name}</h4>
                <p className="text-xs text-slate-400">Ibu Kota Provinsi: {selectedProvince.capital}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1 justify-end">
                  <Sparkles size={14} /> Ragam Kebinekaan
                </span>
              </div>
            </div>

            {/* Cultural highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                  <Home size={14} /> Rumah Adat Tradisional
                </div>
                <div className="text-sm font-semibold text-slate-200">{selectedProvince.traditionalHouse}</div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-bold mb-1">
                  <Sparkles size={14} /> Tarian Khas Daerah
                </div>
                <div className="text-sm font-semibold text-slate-200">{selectedProvince.dance}</div>
              </div>
            </div>

            {/* Local Wisdom of Gotong Royong */}
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-4 rounded-2xl mb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <HeartHandshake size={16} /> Tradisi Gotong Royong: "{selectedProvince.gotongRoyongWisdom.term}"
              </div>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {selectedProvince.gotongRoyongWisdom.description}
              </p>
            </div>

            {/* Pancasila Connection */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck size={15} /> Korelasi Nilai Sila Pancasila:
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                {selectedProvince.pancasilaValue}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic text-center">
            "Bhinneka Tunggal Ika Tan Hana Dharma Mangrwa — Berbeda-beda suku bangsa, satu cita-cita persatuan Indonesia."
          </div>
        </div>
      </div>
    </div>
  );
};
