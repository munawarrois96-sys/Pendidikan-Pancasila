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
  Home
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

  // Find active item
  const currentItem = navItems.find((item) => item.id === activeMenuId) || navItems[0];
  const CurrentIcon = currentItem.icon;

  // Find sibling items in same category for quick toolbar navigation
  const siblingItems = navItems.filter((item) => item.category === currentItem.category);

  return (
    <div className="w-full space-y-4 transition-all">
      {/* JENDELA HALAMAN: Window Header & Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-2 border-sky-200/90 rounded-3xl shadow-lg shadow-sky-900/5 overflow-hidden transition-all duration-300">
        {/* Top Window Title Bar (Mac/OS App Style) */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-sky-500">
          {/* Left: Window Traffic Dots & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Window Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onNavigate('beranda')}
                className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300 transition-colors cursor-pointer"
                title="Ke Halaman Beranda"
              />
              <button
                onClick={() => setIsWindowExpanded(!isWindowExpanded)}
                className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                title="Ringkas / Tampilkan Bilah Alat"
              />
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                title="Gulir ke Atas Jendela"
              />
            </div>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 text-xs text-sky-100 font-medium overflow-x-auto whitespace-nowrap">
              <span className="opacity-75">SMA Negeri 1 Mande</span>
              <ChevronRight size={12} className="opacity-60" />
              <span className="bg-sky-800/80 px-2 py-0.5 rounded text-[10px] font-bold text-sky-200 border border-sky-400/40 uppercase tracking-wider">
                {currentItem.category}
              </span>
              <ChevronRight size={12} className="opacity-60" />
              <span className="font-extrabold text-white flex items-center gap-1">
                <CurrentIcon size={13} className="text-amber-300" />
                {currentItem.label}
              </span>
            </div>
          </div>

          {/* Right: Window Controls & Quick Switcher */}
          <div className="flex items-center gap-2 relative">
            {/* Back Button */}
            {canGoBack && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors border border-white/20"
                title="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft size={13} />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}

            {/* Quick Window Dropdown Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1 bg-sky-800/90 hover:bg-sky-900 text-sky-100 hover:text-white text-xs font-bold rounded-xl border border-sky-400/40 shadow-sm transition-all"
                title="Buka menu cepat jendela halaman"
              >
                <Layers size={13} className="text-amber-300" />
                <span className="hidden md:inline">Pindah Jendela</span>
                <span className="md:hidden">Menu</span>
                <span className="text-[10px] bg-sky-600 px-1.5 py-0.2 rounded-full font-mono">{navItems.length}</span>
              </button>

              {/* Quick Menu Dropdown Box */}
              {isQuickMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border-2 border-sky-300 p-3 z-50 text-slate-800 animate-fade-in"
                  style={{ maxHeight: '75vh', overflowY: 'auto' }}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-100">
                    <span className="text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={14} className="text-sky-600" /> Jendela Navigasi ({navItems.length} Halaman)
                    </span>
                    <button
                      onClick={() => setIsQuickMenuOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.id === activeMenuId;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsQuickMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                            isActive
                              ? 'bg-sky-600 text-white font-bold shadow-md'
                              : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon size={15} className={isActive ? 'text-amber-300' : 'text-sky-600'} />
                            <div className="truncate">
                              <span className="block leading-tight">{item.label}</span>
                              <span className={`text-[10px] truncate block ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${
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
              className="p-1 rounded-lg bg-sky-800/60 hover:bg-sky-800 text-sky-200 hover:text-white transition-colors"
              title="Segarkan tampilan ke atas jendela"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Window Content Toolbar: Active page badge & Category Siblings */}
        {isWindowExpanded && (
          <div className="px-4 py-3 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 flex flex-wrap items-center justify-between gap-3 border-b border-sky-100">
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
              {siblingItems.map((sib) => {
                const SibIcon = sib.icon;
                const isSibActive = sib.id === activeMenuId;
                return (
                  <button
                    key={sib.id}
                    onClick={() => onNavigate(sib.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isSibActive
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-100/70 border border-sky-200/80'
                    }`}
                  >
                    <SibIcon size={13} className={isSibActive ? 'text-amber-300' : 'text-sky-600'} />
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
