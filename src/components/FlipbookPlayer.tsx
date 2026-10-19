import React, { useState, useEffect, useRef } from 'react';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { renderSceneToCanvas } from '../utils/canvasRenderer';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Maximize2 } from 'lucide-react';

interface FlipbookPlayerProps {
  scenes: Scene[];
  config: RenderStyleConfig;
  onEditScene: (scene: Scene) => void;
}

export const FlipbookPlayer: React.FC<FlipbookPlayerProps> = ({
  scenes,
  config,
  onEditScene
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(2); // Default 2 frames per second
  const [loop, setLoop] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScene = scenes[currentFrameIndex] || scenes[0];

  // Render active scene to canvas
  useEffect(() => {
    if (canvasRef.current && activeScene) {
      renderSceneToCanvas(canvasRef.current, activeScene, config, 1.5);
    }
  }, [activeScene, config]);

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying || scenes.length <= 1) return;

    const intervalTime = 1000 / fps;
    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= scenes.length - 1) {
          if (loop) return 0;
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, fps, loop, scenes.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentFrameIndex((prev) => Math.min(scenes.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentFrameIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scenes.length]);

  const handleNext = () => {
    setCurrentFrameIndex((prev) => (prev >= scenes.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentFrameIndex((prev) => (prev <= 0 ? scenes.length - 1 : prev - 1));
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-neutral-900 rounded-xl p-4 sm:p-6 text-white flex flex-col gap-5 border border-neutral-800 shadow-md"
    >
      {/* Player Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span className="text-white font-semibold">
            FRAME {String(currentFrameIndex + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span>{activeScene ? activeScene.title : 'No Scene'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full aspect-video bg-neutral-950 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-800">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block"
          style={{ backgroundColor: config.bgColor }}
        />

        {/* Floating Scene Prompt Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between gap-4">
          <p className="text-sm font-medium text-white drop-shadow-sm max-w-2xl line-clamp-2">
            {activeScene?.prompt}
          </p>
          <button
            type="button"
            onClick={() => activeScene && onEditScene(activeScene)}
            className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Edit Frame
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, scenes.length - 1)}
            value={currentFrameIndex}
            onChange={(e) => {
              setCurrentFrameIndex(Number(e.target.value));
              if (isPlaying) setIsPlaying(false);
            }}
            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Frame ticks thumbnail bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-thin">
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setCurrentFrameIndex(idx);
                if (isPlaying) setIsPlaying(false);
              }}
              className={`h-7 min-w-[28px] px-1 text-[11px] font-mono tabular-nums rounded border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                currentFrameIndex === idx
                  ? 'bg-white text-neutral-950 font-bold border-white'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
              }`}
              title={`Scene ${idx + 1}: ${s.title}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-800 text-xs">
        {/* Play / Next / Prev */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Previous Frame (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 font-semibold rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Flipbook'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Next Frame (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setLoop(!loop)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              loop ? 'text-white bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed / FPS Selector */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Speed:</span>
          <div className="flex items-center gap-1 p-0.5 bg-neutral-800 rounded-md">
            {[
              { label: '1 fps', val: 1 },
              { label: '2 fps', val: 2 },
              { label: '4 fps', val: 4 },
              { label: '8 fps', val: 8 },
              { label: '12 fps', val: 12 }
            ].map((speed) => (
              <button
                key={speed.val}
                type="button"
                onClick={() => setFps(speed.val)}
                className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  fps === speed.val ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
