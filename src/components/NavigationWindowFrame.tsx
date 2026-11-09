import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Layers,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2,
  ExternalLink,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  Search,
  Check
} from 'lucide-react';

interface NavItemInfo {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: string;
  desc: string;
}

interface NavigationWindowFrameProps {
  activeMenuId: string;
  navItems: NavItemInfo[];
  onNavigate: (menuId: string) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  children: React.ReactNode;
}

export const NavigationWindowFrame: React.FC<NavigationWindowFrameProps> = ({
  activeMenuId,
  navItems,
  onNavigate,
  onGoBack,
  canGoBack = false,
  children,
}) => {
  const [isWindowExpanded, setIsWindowExpanded] = useState<boolean>(true);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState<boolean>(false);
  const [windowSearch, setWindowSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('Semua');

  // Find active item
  const currentItem = navItems.find((item) => item.id === activeMenuId) || navItems[0];
  const CurrentIcon = currentItem.icon;

  // Categories list
  const categories = ['Semua', ...Array.from(new Set(navItems.map((n) => n.category)))];

  // Filtered items in dropdown
  const filteredNavItems = navItems.filter((item) => {
    const matchSearch =
      item.label.toLowerCase().includes(windowSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(windowSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(windowSearch.toLowerCase());
    const matchCat = selectedCat === 'Semua' || item.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="w-full space-y-4 transition-all">
      {/* JENDELA HALAMAN: Window Header & Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-2 border-sky-300 rounded-3xl shadow-xl shadow-sky-900/10 overflow-hidden transition-all duration-300">
        {/* Top Window Title Bar (Mac/OS App Style) */}
        <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-600">
          {/* Left: Window Traffic Dots & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Window Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate('beranda')}
                className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-300 transition-transform active:scale-90 cursor-pointer shadow-xs"
                title="Ke Halaman Beranda"
              />
              <button
                onClick={() => setIsWindowExpanded(!isWindowExpanded)}
                className="w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-300 transition-transform active:scale-90 cursor-pointer shadow-xs"
                title="Ringkas / Tampilkan Bilah Alat"
              />
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 transition-transform active:scale-90 cursor-pointer shadow-xs"
                title="Gulir ke Atas Jendela"
              />
            </div>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 text-xs text-sky-100 font-medium overflow-x-auto whitespace-nowrap py-0.5">
              <span className="opacity-80">SMA Negeri 1 Mande</span>
              <ChevronRight size={12} className="opacity-60 shrink-0" />
              <span className="bg-sky-900/80 px-2 py-0.5 rounded text-[10px] font-extrabold text-sky-200 border border-sky-500/40 uppercase tracking-wider shrink-0">
                {currentItem.category}
              </span>
              <ChevronRight size={12} className="opacity-60 shrink-0" />
              <span className="font-extrabold text-white flex items-center gap-1 shrink-0">
                <CurrentIcon size={14} className="text-amber-300" />
                <span>{currentItem.label}</span>
              </span>
            </div>
          </div>

          {/* Right: Window Controls & Prominent "Pindah Jendela" Switcher */}
          <div className="flex items-center gap-2 relative shrink-0">
            {/* Back Button */}
            {canGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-colors border border-white/20 active:scale-95"
                title="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft size={13} />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}

            {/* Prominent High-Visibility "Pindah Jendela" Button */}
            <div className="relative">
              <button
                onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-sky-950 font-black text-xs sm:text-sm rounded-xl border border-amber-200 shadow-md transition-all transform hover:scale-105 active:scale-95"
                title="Pindah Jendela Halaman (Klik untuk membuka daftar semua jendela)"
              >
                <Layers size={16} className="text-sky-950 stroke-[2.5]" />
                <span className="font-extrabold">Pindah Jendela</span>
                <span className="bg-sky-950 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black">
                  {navItems.length}
                </span>
                <span className="text-[10px] font-mono leading-none">▾</span>
              </button>

              {/* Quick Menu Dropdown Box with Search */}
              {isQuickMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-sky-400 p-4 z-50 text-slate-800 animate-fadeIn"
                  style={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-sky-100">
                    <span className="text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers size={16} className="text-sky-600" />
                      <span>Navigasi Jendela ({navItems.length} Halaman)</span>
                    </span>
                    <button
                      onClick={() => setIsQuickMenuOpen(false)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Search inside Dropdown */}
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={windowSearch}
                      onChange={(e) => setWindowSearch(e.target.value)}
                      placeholder="Cari jendela halaman..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCat(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                          selectedCat === cat
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* List of Window Items */}
                  <div className="space-y-1">
                    {filteredNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === activeMenuId;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsQuickMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                            isActive
                              ? 'bg-sky-600 text-white font-bold shadow-md'
                              : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon size={16} className={isActive ? 'text-amber-300' : 'text-sky-600'} />
                            <div className="truncate">
                              <span className="block leading-tight font-bold">{item.label}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  isActive ? 'text-sky-100' : 'text-slate-400'
                                }`}
                              >
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 font-bold ${
                              isActive ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Refresh / Top Button */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-1.5 rounded-xl bg-sky-900/60 hover:bg-sky-900 text-sky-200 hover:text-white transition-colors border border-sky-600"
              title="Gulir ke atas jendela"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* ALWAYS-VISIBLE HORIZONTAL WINDOW TABS ROW (Baris Jendela Cepat) */}
        <div className="bg-sky-50/80 px-4 py-2 border-b border-sky-200/80 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 shrink-0 flex items-center gap-1 mr-1">
            <Layers size={13} className="text-sky-600" />
            <span>Pilih Jendela:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeMenuId;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-1 ring-sky-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100 hover:text-sky-800'
                  }`}
                  title={`${item.label} - ${item.desc}`}
                >
                  <Icon size={13} className={isActive ? 'text-amber-300' : 'text-sky-600'} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Window Content Toolbar: Active page badge & Category Siblings */}
        {isWindowExpanded && (
          <div className="px-4 py-3 bg-gradient-to-r from-white via-sky-50/30 to-white flex flex-wrap items-center justify-between gap-3">
            {/* Title & Description of Current Window */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0 shadow-sm">
                <CurrentIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-extrabold text-slate-800">
                    Jendela: {currentItem.label}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-tight hidden sm:block">
                  {currentItem.desc}
                </p>
              </div>
            </div>

            {/* Quick Sibling Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
                Terkait {currentItem.category}:
              </span>
              {navItems
                .filter((item) => item.category === currentItem.category)
                .map((sib) => {
                  const SibIcon = sib.icon;
                  const isSibActive = sib.id === activeMenuId;
                  return (
                    <button
                      key={sib.id}
                      onClick={() => onNavigate(sib.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isSibActive
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-sky-700 hover:bg-sky-100 border border-slate-200'
                      }`}
                    >
                      <SibIcon size={12} className={isSibActive ? 'text-amber-300' : 'text-sky-600'} />
                      <span>{sib.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Main Window Page Content */}
      <div className="w-full transition-opacity duration-300">
        {children}
      </div>
    </div>
  );
};
