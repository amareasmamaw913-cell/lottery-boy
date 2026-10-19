import React, { useEffect, useRef, useState } from 'react';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { renderSceneToCanvas } from '../utils/canvasRenderer';
import { downloadSingleScenePNG } from '../utils/zipExporter';
import { Edit3, Download, ChevronUp, ChevronDown, Trash2, Copy, Check } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  config: RenderStyleConfig;
  index: number;
  totalScenes: number;
  onEditScene: (scene: Scene) => void;
  onUpdatePrompt: (sceneId: string, newPrompt: string) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
  onDuplicateScene: (scene: Scene) => void;
  onDeleteScene: (sceneId: string) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  config,
  index,
  totalScenes,
  onEditScene,
  onUpdatePrompt,
  onMoveScene,
  onDuplicateScene,
  onDeleteScene
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState(scene.prompt);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Synchronize internal prompt state if scene prop changes
  useEffect(() => {
    setPromptText(scene.prompt);
  }, [scene.prompt]);

  // Re-render canvas whenever scene or config changes
  useEffect(() => {
    if (canvasRef.current) {
      renderSceneToCanvas(canvasRef.current, scene, config, 1);
    }
  }, [scene, config]);

  const handleSavePrompt = () => {
    setIsEditingPrompt(false);
    if (promptText.trim() !== scene.prompt) {
      onUpdatePrompt(scene.id, promptText.trim());
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(scene.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  // Compute aspect ratio class for thumbnail container
  let aspectClass = 'aspect-video';
  if (config.aspectRatio === '1:1') aspectClass = 'aspect-square';
  if (config.aspectRatio === '9:16') aspectClass = 'aspect-[9/16] max-h-72';
  if (config.aspectRatio === '4:3') aspectClass = 'aspect-[4/3]';

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col transition-all hover:border-neutral-300 hover:shadow-xs group">
      {/* Visual Canvas Area */}
      <div
        className={`relative w-full ${aspectClass} overflow-hidden flex items-center justify-center cursor-pointer`}
        onClick={() => onEditScene(scene)}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block"
          style={{ backgroundColor: config.bgColor }}
        />
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/90 backdrop-blur-xs text-neutral-800 text-xs font-medium px-2.5 py-1 rounded shadow-xs">
            Click to edit scene
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        {/* Zero-Pill Metadata Line */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <div className="flex items-center gap-1.5 font-mono tabular-nums">
              <span className="font-semibold text-neutral-900">
                Scene {String(scene.sceneNumber).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{config.aspectRatio}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{scene.actionType.replace('_', ' ')}</span>
            </div>

            {/* Reorder buttons */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onMoveScene(index, 'up')}
                disabled={index === 0}
                className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 cursor-pointer"
                title="Move scene up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onMoveScene(index, 'down')}
                disabled={index === totalScenes - 1}
                className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 cursor-pointer"
                title="Move scene down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-neutral-900 truncate" title={scene.title}>
            {scene.title}
          </h3>

          {/* Prompt text or inline editor */}
          {isEditingPrompt ? (
            <div className="mt-2">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onBlur={handleSavePrompt}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSavePrompt();
                  }
                }}
                autoFocus
                rows={2}
                className="w-full text-xs p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
              />
              <div className="flex justify-end gap-1 mt-1">
                <button
                  type="button"
                  onClick={handleSavePrompt}
                  className="px-2 py-0.5 text-xs bg-neutral-900 text-white rounded font-medium cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingPrompt(true)}
              className="text-xs text-neutral-600 line-clamp-2 mt-1 cursor-text hover:text-neutral-900 transition-colors"
              title="Click to edit prompt"
            >
              {scene.prompt}
            </p>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEditScene(scene)}
              className="flex items-center gap-1 px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              title="Copy prompt"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied' : 'Prompt'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicateScene(scene)}
              className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              title="Duplicate scene"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => downloadSingleScenePNG(scene, config)}
              className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              title="Download scene PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteScene(scene.id)}
              className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete scene"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
