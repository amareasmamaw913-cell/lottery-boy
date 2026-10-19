import React from 'react';
import { Download, Film } from 'lucide-react';

export type AppTab = 'register' | 'links' | 'roster' | 'lookup' | 'storyboard' | 'python';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onExportZip: () => void;
  isExporting: boolean;
  exportProgress: { current: number; total: number };
  totalRegistrations: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportZip,
  isExporting,
  exportProgress,
  totalRegistrations
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
            <Film className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
            StickScene Studio
          </span>
        </div>

        {/* Zone 2: 4-5 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'register'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            Register with Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'links'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            Shareable Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            <span>Registrations (Admin)</span>
            <span className="font-mono text-xs font-semibold px-1.5 py-0.2 bg-neutral-100 rounded text-neutral-700 tabular-nums">
              {totalRegistrations}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lookup')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'lookup'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            Ticket Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('storyboard')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'storyboard'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            30-Scene Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'python'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950'
                : 'hover:text-neutral-950'
            }`}
          >
            Python Script
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab === 'storyboard' || activeTab === 'python' ? (
            <button
              type="button"
              onClick={onExportZip}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isExporting
                  ? `Exporting (${exportProgress.current}/${exportProgress.total})...`
                  : 'Export 30 Scenes (ZIP)'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <span>Register Now</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
