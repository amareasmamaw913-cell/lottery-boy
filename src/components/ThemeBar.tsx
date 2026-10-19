import React from 'react';
import { RenderStyleConfig, ColorTheme } from '../types/storyboard';
import { Palette, Ratio, Sliders, FileText, Plus, RotateCcw } from 'lucide-react';

interface ThemeBarProps {
  config: RenderStyleConfig;
  onChangeConfig: (newConfig: RenderStyleConfig) => void;
  onOpenBulkModal: () => void;
  onAddScene: () => void;
  onResetScenes: () => void;
  sceneCount: number;
}

const THEME_OPTIONS: { id: ColorTheme; label: string; bg: string; stroke: string }[] = [
  { id: 'lineart', label: 'Classic Line Art', bg: '#ffffff', stroke: '#111111' },
  { id: 'blueprint', label: 'Blueprint Blue', bg: '#0b192e', stroke: '#e2f1ff' },
  { id: 'chalkboard', label: 'Chalkboard', bg: '#1c222b', stroke: '#f5f7fa' },
  { id: 'sepia', label: 'Sepia Notebook', bg: '#f9f6ef', stroke: '#3a2e2b' },
  { id: 'darkline', label: 'Dark Minimal', bg: '#09090b', stroke: '#ffffff' }
];

export const ThemeBar: React.FC<ThemeBarProps> = ({
  config,
  onChangeConfig,
  onOpenBulkModal,
  onAddScene,
  onResetScenes,
  sceneCount
}) => {
  const handleThemeChange = (themeId: ColorTheme) => {
    const selected = THEME_OPTIONS.find((t) => t.id === themeId);
    if (!selected) return;
    onChangeConfig({
      ...config,
      theme: themeId,
      bgColor: selected.bg,
      strokeColor: selected.stroke
    });
  };

  return (
    <div className="bg-white border-b border-neutral-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left side: Rendering Style controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-600">Style:</span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    config.theme === theme.id
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-1.5">
            <Ratio className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-600">Ratio:</span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
              {(['16:9', '1:1', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, aspectRatio: ratio })}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    config.aspectRatio === ratio
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-600">Stroke:</span>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-md">
              {[
                { label: 'Fine', w: 3 },
                { label: 'Normal', w: 5 },
                { label: 'Bold', w: 7 }
              ].map((sw) => (
                <button
                  key={sw.label}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, lineWidth: sw.w })}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    config.lineWidth === sw.w
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {sw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark toggle */}
          <label className="hidden md:flex items-center gap-1.5 cursor-pointer text-neutral-600 hover:text-neutral-900">
            <input
              type="checkbox"
              checked={config.showSceneWatermark}
              onChange={(e) => onChangeConfig({ ...config, showSceneWatermark: e.target.checked })}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950"
            />
            <span className="text-xs font-medium">Show Scene Number</span>
          </label>
        </div>

        {/* Right side: Scene Management Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            title="Paste or import a raw list of 30 prompts"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste 30 Prompts</span>
          </button>

          <button
            type="button"
            onClick={onAddScene}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            title="Add a new blank scene"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>

          <button
            type="button"
            onClick={onResetScenes}
            className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            title="Reset to default 30 scenes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
