import React, { useState, useEffect, useRef } from 'react';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { renderSceneToCanvas } from '../utils/canvasRenderer';
import { downloadSingleScenePNG } from '../utils/zipExporter';
import { X, Download, Save, Sparkles } from 'lucide-react';

interface SceneEditorModalProps {
  scene: Scene | null;
  config: RenderStyleConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedScene: Scene) => void;
}

export const SceneEditorModal: React.FC<SceneEditorModalProps> = ({
  scene,
  config,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedScene, setEditedScene] = useState<Scene | null>(scene);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setEditedScene(scene ? { ...scene, customDetails: { ...scene.customDetails } } : null);
  }, [scene]);

  useEffect(() => {
    if (canvasRef.current && editedScene) {
      renderSceneToCanvas(canvasRef.current, editedScene, config, 1.5);
    }
  }, [editedScene, config]);

  if (!isOpen || !editedScene) return null;

  const handleActionChange = (actionType: Scene['actionType']) => {
    setEditedScene((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        actionType
      };
    });
  };

  const handleExpressionChange = (expression: any) => {
    setEditedScene((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customDetails: {
          ...prev.customDetails,
          expression
        }
      };
    });
  };

  const handlePropChange = (prop: any) => {
    setEditedScene((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customDetails: {
          ...prev.customDetails,
          prop
        }
      };
    });
  };

  const handleSpeechBubbleChange = (text: string) => {
    setEditedScene((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customDetails: {
          ...prev.customDetails,
          speechBubble: text
        }
      };
    });
  };

  const handleSpeedLinesToggle = (hasSpeedLines: boolean) => {
    setEditedScene((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customDetails: {
          ...prev.customDetails,
          hasSpeedLines
        }
      };
    });
  };

  const handleSave = () => {
    if (editedScene) {
      onSave(editedScene);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
              SCENE {String(editedScene.sceneNumber).padStart(2, '0')}
            </span>
            <h3 className="text-sm font-bold text-neutral-900">Fine-Tune Scene Visuals</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Live Canvas Preview */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Live Preview ({config.aspectRatio})
            </span>
            <div className="relative aspect-video w-full rounded-lg border border-neutral-200 overflow-hidden bg-neutral-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain block"
                style={{ backgroundColor: config.bgColor }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
              <span>Renders instantly with high-res anti-aliasing</span>
              <button
                type="button"
                onClick={() => downloadSingleScenePNG(editedScene, config)}
                className="flex items-center gap-1 text-neutral-800 hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          {/* Right: Controls & Parameters */}
          <div className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Scene Title</label>
              <input
                type="text"
                value={editedScene.title}
                onChange={(e) => setEditedScene({ ...editedScene, title: e.target.value })}
                className="w-full p-2 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Prompt Text</label>
              <textarea
                rows={3}
                value={editedScene.prompt}
                onChange={(e) => setEditedScene({ ...editedScene, prompt: e.target.value })}
                className="w-full p-2 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:outline-hidden font-mono text-[11px]"
              />
            </div>

            {/* Action Pose Selector */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Pose & Action</label>
              <select
                value={editedScene.actionType}
                onChange={(e) => handleActionChange(e.target.value as any)}
                className="w-full p-2 border border-neutral-300 rounded-md bg-white capitalize focus:ring-1 focus:ring-neutral-900"
              >
                <option value="running_late">Running Late (Sprint)</option>
                <option value="tripping">Tripping over Rock / Obstacle</option>
                <option value="falling">Freefall / Tumbling</option>
                <option value="looking_clock">Checking Clock (Panic)</option>
                <option value="coffee_spill">Coffee Splash Catastrophe</option>
                <option value="briefcase_flying">Briefcase Bursting Open</option>
                <option value="bicycle_ride">Bicycle Ride</option>
                <option value="bus_chase">Chasing City Bus</option>
                <option value="rain_umbrella">Rainstorm / Inside-Out Umbrella</option>
                <option value="sliding">Sliding Down Rail</option>
                <option value="jumping">Jumping in Air</option>
                <option value="superhero_fly">Superhero Flying Pose</option>
                <option value="desk_typing">Typing at Desk</option>
                <option value="celebrating">Celebrating Victory</option>
                <option value="thinking">Thinking / Confused</option>
                <option value="sleeping">Sleeping Peacefully</option>
                <option value="generic">Neutral Standing</option>
              </select>
            </div>

            {/* Expression */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Facial Expression</label>
              <div className="grid grid-cols-3 gap-2">
                {(['panic', 'shock', 'happy', 'determined', 'dizzy', 'neutral'] as const).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => handleExpressionChange(exp)}
                    className={`py-1.5 px-2 rounded border text-center capitalize cursor-pointer transition-colors ${
                      (editedScene.customDetails?.expression || 'neutral') === exp
                        ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Props */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Prop Element</label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'rock', 'clock', 'coffee', 'briefcase', 'banana'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePropChange(p)}
                    className={`py-1.5 px-2 rounded border text-center capitalize cursor-pointer transition-colors ${
                      (editedScene.customDetails?.prop || 'none') === p
                        ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech bubble caption */}
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Optional Dialogue / Sound Effect Bubble
              </label>
              <input
                type="text"
                placeholder='e.g., "Oh no!", "AAAH!", "8:59!"'
                value={editedScene.customDetails?.speechBubble || ''}
                onChange={(e) => handleSpeechBubbleChange(e.target.value)}
                className="w-full p-2 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>

            {/* Speed Lines checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={editedScene.customDetails?.hasSpeedLines ?? true}
                onChange={(e) => handleSpeedLinesToggle(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900"
              />
              <span className="text-neutral-700 font-medium">Draw dynamic speed/action lines</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
