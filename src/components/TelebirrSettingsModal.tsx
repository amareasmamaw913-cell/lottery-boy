import React, { useState } from 'react';
import { TelebirrConfig } from '../types/registration';
import { updateTelebirrConfig } from '../utils/registrationApi';
import { X, Save, Settings, Phone, DollarSign, User, ShieldCheck } from 'lucide-react';

interface TelebirrSettingsModalProps {
  config: TelebirrConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newConfig: TelebirrConfig) => void;
}

export const TelebirrSettingsModal: React.FC<TelebirrSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaved
}) => {
  const [accountNumber, setAccountNumber] = useState(config.accountNumber);
  const [accountName, setAccountName] = useState(config.accountName);
  const [feePerTicket, setFeePerTicket] = useState(config.feePerTicket);
  const [instructions, setInstructions] = useState(config.instructions);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateTelebirrConfig({
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        feePerTicket: Number(feePerTicket) || 50,
        instructions: instructions.trim()
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full shadow-xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0072bc] text-white flex items-center justify-center font-bold text-xs">
              tb
            </div>
            <h3 className="font-bold text-sm text-neutral-900">Configure Telebirr Receiver</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block font-semibold text-neutral-800 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              <span>Telebirr Account / Phone Number *</span>
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 0911234567 or 09XXXXXXXX"
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Recipient Account Name *</span>
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Amare Asmamaw"
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
              <span>Registration Fee per Ticket (ETB) *</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={feePerTicket}
              onChange={(e) => setFeePerTicket(Number(e.target.value))}
              placeholder="50"
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Payment Instructions to Show User
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 text-[11px] font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0072bc] hover:bg-[#005a96] text-white font-semibold rounded-lg cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Telebirr Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
