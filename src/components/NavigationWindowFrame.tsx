import React from 'react';
import { ArrowLeft, ChevronRight, RotateCcw } from 'lucide-react';

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
  const currentItem = navItems.find((item) => item.id === activeMenuId) || navItems[0];
  const CurrentIcon = currentItem.icon;
  const siblingItems = navItems.filter((item) => item.category === currentItem.category);

  return (
    <div className="w-full space-y-5">
      {/* Clean Contextual Sub-Page Header Bar */}
      <div className="bg-white border border-sky-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {canGoBack && onGoBack && (
              <button
                type="button"
                onClick={onGoBack}
                className="btn-3d btn-3d-white inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sky-800 text-xs font-bold shrink-0 cursor-pointer"
                title="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft size={14} />
                <span>Kembali</span>
              </button>
            )}

            <div className="btn-3d-sky w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0">
              <CurrentIcon size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700">
                <button
                  type="button"
                  onClick={() => onNavigate('beranda')}
                  className="hover:underline cursor-pointer"
                >
                  Beranda
                </button>
                <ChevronRight size={12} className="text-slate-400 shrink-0" />
                <span>{currentItem.category}</span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
                {currentItem.label}
              </h2>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                {currentItem.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-3d btn-3d-white p-2 rounded-xl text-slate-600 hover:text-sky-700 cursor-pointer"
              title="Gulir ke atas halaman"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Category Sibling Quick Links (3D Category Buttons) */}
        {siblingItems.length > 1 && (
          <div className="px-4 py-2.5 sm:px-5 bg-sky-50/70 border-t border-sky-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">
              {currentItem.category}:
            </span>
            {siblingItems.map((sib) => {
              const SibIcon = sib.icon;
              const isSibActive = sib.id === activeMenuId;
              return (
                <button
                  key={sib.id}
                  type="button"
                  onClick={() => onNavigate(sib.id)}
                  className={`btn-3d inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                    isSibActive
                      ? 'btn-3d-sky text-white'
                      : 'btn-3d-white text-slate-700 hover:text-sky-800'
                  }`}
                >
                  <SibIcon size={13} className={isSibActive ? 'text-amber-300' : 'text-sky-600'} />
                  <span>{sib.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Page Content */}
      <div className="w-full">{children}</div>
    </div>
  );
};
