import React from 'react';
import { STORY_PACKS } from '../data/storyPacks';
import { StoryPack } from '../types/storyboard';
import { BookOpen, Check, ArrowRight } from 'lucide-react';

interface StoryPacksViewProps {
  currentPackId: string;
  onSelectPack: (pack: StoryPack) => void;
}

export const StoryPacksView: React.FC<StoryPacksViewProps> = ({
  currentPackId,
  onSelectPack
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h2 className="text-base font-bold text-neutral-900">Curated 30-Scene Story Packs</h2>
        <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
          Pre-written, frame-by-frame 30-scene narrative arcs optimized for minimalist line art stickman animation, YouTube Shorts, and comic storyboards. Select any pack to immediately load all 30 scenes into your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORY_PACKS.map((pack) => {
          const isSelected = currentPackId === pack.id;
          return (
            <div
              key={pack.id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                isSelected
                  ? 'border-neutral-900 ring-1 ring-neutral-900 shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div>
                {/* Zero-Pill text metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-mono">
                  <span>30 Scenes</span>
                  <span aria-hidden="true">·</span>
                  <span>{pack.genre}</span>
                  {isSelected && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-emerald-600">Active Workspace</span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-900">{pack.title}</h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{pack.description}</p>

                {/* Sample scenes preview */}
                <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Sample Scenes:
                  </span>
                  {pack.scenes.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="text-xs text-neutral-700 flex items-start gap-2">
                      <span className="font-mono text-neutral-400 shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>
                  ))}
                  <div className="text-[11px] text-neutral-400 font-mono italic pl-6">
                    + 26 more consecutive scenes...
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPack(pack)}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Currently Loaded</span>
                    </>
                  ) : (
                    <>
                      <span>Load 30 Scenes into Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
