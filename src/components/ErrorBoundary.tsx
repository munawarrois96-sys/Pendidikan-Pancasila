import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
          <div className="max-w-md w-full bg-white border border-sky-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">Terjadi Kendala Tampilan</h2>
            <p className="text-xs text-slate-600">
              Silakan muat ulang halaman untuk melanjutkan aktivitas pembelajaran Pendidikan Pancasila.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-3d btn-3d-sky px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
