import React, { useState } from 'react';
import { Scene, RenderStyleConfig } from '../types/storyboard';
import { generatePythonScript, ScriptOptions } from '../utils/scriptGenerator';
import { Copy, Check, Download, Terminal, Settings2, ExternalLink } from 'lucide-react';

interface PythonScriptModalProps {
  scenes: Scene[];
  config: RenderStyleConfig;
  isOpen?: boolean;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  scenes,
  config
}) => {
  const [modelName, setModelName] = useState<'imagen-3.0-generate-002' | 'imagen-3.0-fast-generate-001'>(
    'imagen-3.0-generate-002'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3'>(config.aspectRatio);
  const [includeSleep, setIncludeSleep] = useState(true);
  const [useEnvKey, setUseEnvKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const scriptOptions: ScriptOptions = {
    modelName,
    aspectRatio,
    includeSleep,
    sleepSeconds: 1,
    outputDir: 'scenes_output',
    useEnvKey
  };

  const code = generatePythonScript(scenes, scriptOptions);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generate_scenes.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col">
      {/* Header bar */}
      <div className="p-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/60">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-700" />
            <span>Python Imagen Batch Generator Script</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Ready-to-run script containing your active {scenes.length} scene prompts. Run locally or in Google Colab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Script'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      {/* Script Configuration Bar */}
      <div className="p-3 bg-neutral-100/70 border-b border-neutral-200 flex flex-wrap items-center gap-6 text-xs text-neutral-700">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-600">Model:</span>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value as any)}
            className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-mono"
          >
            <option value="imagen-3.0-generate-002">imagen-3.0-generate-002 (High Quality)</option>
            <option value="imagen-3.0-fast-generate-001">imagen-3.0-fast-generate-001 (Fast)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-600">Aspect Ratio:</span>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as any)}
            className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-mono"
          >
            <option value="16:9">16:9 (Landscape standard)</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="9:16">9:16 (Shorts / Reels)</option>
            <option value="4:3">4:3 (Classic TV)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSleep}
            onChange={(e) => setIncludeSleep(e.target.checked)}
            className="rounded border-neutral-300 text-neutral-900"
          />
          <span>Rate limit delay (1s pause)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useEnvKey}
            onChange={(e) => setUseEnvKey(e.target.checked)}
            className="rounded border-neutral-300 text-neutral-900"
          />
          <span>Read from GEMINI_API_KEY env</span>
        </label>
      </div>

      {/* Code Viewer */}
      <div className="p-4 bg-neutral-950 overflow-x-auto text-neutral-200 text-xs font-mono max-h-[500px] leading-relaxed">
        <pre className="select-all">
          <code>{code}</code>
        </pre>
      </div>

      {/* Quick Setup Instructions */}
      <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-600 space-y-2">
        <h4 className="font-semibold text-neutral-900">How to execute this script:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded border border-neutral-200">
            <span className="font-medium text-neutral-900 block mb-1">Option A: Run in Terminal (Local)</span>
            <ol className="list-decimal list-inside space-y-1 text-neutral-600 font-mono text-[11px]">
              <li>pip install google-generativeai</li>
              <li>export GEMINI_API_KEY="your-api-key"</li>
              <li>python generate_scenes.py</li>
            </ol>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200">
            <span className="font-medium text-neutral-900 block mb-1">Option B: Run in Google Colab</span>
            <p className="text-neutral-600 mb-1">Paste into a Colab cell with this top line:</p>
            <code className="bg-neutral-100 p-1 rounded font-mono text-[11px] block text-neutral-800">
              !pip install -q google-generativeai
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
