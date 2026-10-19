import React, { useState } from 'react';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { SceneCard } from './SceneCard';
import { Search, Sparkles, Filter } from 'lucide-react';

interface StoryboardGridProps {
  scenes: Scene[];
  config: RenderStyleConfig;
  onEditScene: (scene: Scene) => void;
  onUpdatePrompt: (sceneId: string, newPrompt: string) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onDuplicateScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
  onBatchAppendSuffix: (suffix: string) => void;
}

export const StoryboardGrid: React.FC<StoryboardGridProps> = ({
  scenes,
  config,
  onEditScene,
  onUpdatePrompt,
  onMoveScene,
  onDuplicateScene,
  onDeleteScene,
  onBatchAppendSuffix
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBatchBar, setShowBatchBar] = useState(false);
  const [batchSuffix, setBatchSuffix] = useState(', line art, white background');

  const filteredScenes = scenes.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.actionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-neutral-200">
        {/* Left: Search & Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search prompts or actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
            />
          </div>

          <div className="text-xs text-neutral-500 whitespace-nowrap font-mono tabular-nums">
            <span>{filteredScenes.length}</span>
            <span> of </span>
            <span>{scenes.length}</span>
            <span> scenes</span>
          </div>
        </div>

        {/* Right: Batch Suffix Tool toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBatchBar(!showBatchBar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
              showBatchBar
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Batch Prompt Suffix</span>
          </button>
        </div>
      </div>

      {/* Optional Batch Suffix Bar */}
      {showBatchBar && (
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-neutral-700 font-medium mb-1">
              Append to all {scenes.length} scene prompts:
            </label>
            <input
              type="text"
              value={batchSuffix}
              onChange={(e) => setBatchSuffix(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900"
              placeholder=", line art, white background"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                if (batchSuffix.trim()) {
                  onBatchAppendSuffix(batchSuffix);
                  setShowBatchBar(false);
                }
              }}
              className="px-4 py-2 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Apply to All Prompts
            </button>
          </div>
        </div>
      )}

      {/* Grid of Scenes */}
      {filteredScenes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-600">No scenes match your search query.</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 rounded-md hover:bg-neutral-200 cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenes.map((scene, index) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              config={config}
              index={index}
              totalScenes={scenes.length}
              onEditScene={onEditScene}
              onUpdatePrompt={onUpdatePrompt}
              onMoveScene={onMoveScene}
              onDuplicateScene={onDuplicateScene}
              onDeleteScene={onDeleteScene}
            />
          ))}
        </div>
      )}
    </div>
  );
};
