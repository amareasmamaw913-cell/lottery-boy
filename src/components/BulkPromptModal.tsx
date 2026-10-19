import React, { useState } from 'react';
import { X, Check, FileText } from 'lucide-react';

interface BulkPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPrompts: (prompts: string[]) => void;
  currentCount: number;
}

export const BulkPromptModal: React.FC<BulkPromptModalProps> = ({
  isOpen,
  onClose,
  onImportPrompts,
  currentCount
}) => {
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  // Clean lines and parse
  const parsedPrompts = rawText
    .split('\n')
    .map((line) => {
      let cleaned = line.trim();
      // Remove Python list formatting if present: quotes, trailing commas
      cleaned = cleaned.replace(/^['"]/, '').replace(/['"],?$/, '').trim();
      // Remove leading number like "1. " or "Scene 01: "
      cleaned = cleaned.replace(/^(?:Scene\s*\d+[:.]?|\d+[:.)])\s*/i, '').trim();
      return cleaned;
    })
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('//') && line !== '[' && line !== ']');

  const handleImport = () => {
    if (parsedPrompts.length > 0) {
      onImportPrompts(parsedPrompts);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-2xl w-full flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-700" />
            <h3 className="text-sm font-bold text-neutral-900">Bulk Import Scene Prompts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-neutral-600">
            Paste your 30 scene prompts below (one prompt per line, or pasted directly from Python code/quotes). They will instantly populate into individual storyboard scenes.
          </p>

          <textarea
            rows={10}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`"Minimalist stickman running late, line art, white background",\n"Minimalist stickman tripping over a rock, line art, white background",\n"Minimalist stickman airborne tumbling mid-air, line art, white background"...`}
            className="w-full p-3 font-mono text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
          />

          <div className="flex items-center justify-between text-neutral-500 font-mono tabular-nums">
            <span>Detected Prompts: <strong className="text-neutral-900">{parsedPrompts.length}</strong></span>
            <span>Current Workspace: {currentCount} scenes</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={parsedPrompts.length === 0}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-md cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Load {parsedPrompts.length} Scenes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
