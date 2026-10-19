import React, { useState } from 'react';
import { LotterySettings, PrizeTier } from '../types/lotteryRules';
import { X, Save, Lock, Sliders, Trophy, Calendar, ShieldCheck, DollarSign } from 'lucide-react';

interface LotterySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LotterySettings;
  onSave: (newSettings: LotterySettings) => void;
}

export const LotterySettingsModal: React.FC<LotterySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [pinEntered, setPinEntered] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Form states
  const [ticketPriceETB, setTicketPriceETB] = useState(settings.ticketPriceETB);
  const [numberRangeMax, setNumberRangeMax] = useState(settings.numberRangeMax);
  const [pickCount, setPickCount] = useState(settings.pickCount);
  const [maxTicketsPerPerson, setMaxTicketsPerPerson] = useState(settings.maxTicketsPerPerson);
  const [nextDrawTime, setNextDrawTime] = useState(
    new Date(settings.nextDrawTime).toISOString().slice(0, 16)
  );
  const [registrationCloseMinutes, setRegistrationCloseMinutes] = useState(
    settings.registrationCloseMinutesBefore
  );
  const [claimDeadlineDays, setClaimDeadlineDays] = useState(settings.claimDeadlineDays);
  const [organizerPin, setOrganizerPin] = useState(settings.organizerPin);

  // Prize Tiers
  const [prizes, setPrizes] = useState<PrizeTier[]>(settings.fixedPrizes);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEntered === settings.organizerPin || pinEntered === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handlePrizeChange = (rank: number, newAmount: number) => {
    setPrizes((prev) =>
      prev.map((p) => (p.rank === rank ? { ...p, amountETB: newAmount } : p))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LotterySettings = {
      ...settings,
      ticketPriceETB: Number(ticketPriceETB) || 50,
      numberRangeMax: Number(numberRangeMax) || 100,
      pickCount: Number(pickCount) || 3,
      maxTicketsPerPerson: Number(maxTicketsPerPerson) || 5,
      nextDrawTime: new Date(nextDrawTime).toISOString(),
      registrationCloseMinutesBefore: Number(registrationCloseMinutes) || 30,
      claimDeadlineDays: Number(claimDeadlineDays) || 30,
      organizerPin: organizerPin.trim() || '1234',
      fixedPrizes: prizes
    };
    onSave(updated);
    onClose();
  };

  // If not authenticated, require PIN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
        <div className="bg-white rounded-2xl border border-neutral-200 max-w-sm w-full p-6 text-center shadow-xl space-y-4">
          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-neutral-900">Organizer Settings Access</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Enter organizer PIN to manage prize amounts, schedule, and rules (Default PIN: <code>1234</code>).
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              autoFocus
              maxLength={6}
              placeholder="Enter PIN (1234)"
              value={pinEntered}
              onChange={(e) => setPinEntered(e.target.value)}
              className="w-full text-center text-lg tracking-widest font-mono p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950"
            />
            {pinError && (
              <span className="text-xs text-red-600 block">Incorrect PIN. Try 1234.</span>
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-800" />
            <h3 className="font-bold text-sm text-neutral-900">Lottery & Rules Configuration</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
          {/* 1. Ticket Pricing & Limits */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block border-b pb-1">
              Ticket & Participant Limits
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Ticket Price (ETB)
                </label>
                <input
                  type="number"
                  min="5"
                  value={ticketPriceETB}
                  onChange={(e) => setTicketPriceETB(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Max Tickets Per Person
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={maxTicketsPerPerson}
                  onChange={(e) => setMaxTicketsPerPerson(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Number Rules */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block border-b pb-1">
              Lucky Number Rules
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Number Range (1 to Max)
                </label>
                <select
                  value={numberRangeMax}
                  onChange={(e) => setNumberRangeMax(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono bg-white"
                >
                  <option value={50}>1 to 50</option>
                  <option value={60}>1 to 60</option>
                  <option value={80}>1 to 80</option>
                  <option value={100}>1 to 100 (Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Required Pick Count
                </label>
                <select
                  value={pickCount}
                  onChange={(e) => setPickCount(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono bg-white"
                >
                  <option value={1}>1 Lucky Number</option>
                  <option value={3}>3 Lucky Numbers (Standard)</option>
                  <option value={5}>5 Lucky Numbers</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Prize Tiers */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block border-b pb-1">
              Prize Structure (ETB)
            </span>
            <div className="space-y-2.5">
              {prizes.map((p) => (
                <div key={p.rank} className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <div className="w-24 font-bold text-neutral-900">{p.name}</div>
                  <div className="flex-1 text-neutral-500 font-mono text-[11px]">{p.matchRequirement}</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={p.amountETB}
                      onChange={(e) => handlePrizeChange(p.rank, Number(e.target.value))}
                      className="w-28 p-1.5 border border-neutral-300 rounded font-mono font-bold text-right"
                    />
                    <span className="font-mono text-neutral-500">ETB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Draw Schedule & Countdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block border-b pb-1">
              Draw Schedule & Deadlines
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Next Scheduled Draw Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={nextDrawTime}
                  onChange={(e) => setNextDrawTime(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Registration Close (Mins before Draw)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={registrationCloseMinutes}
                  onChange={(e) => setRegistrationCloseMinutes(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* 5. Security PIN */}
          <div className="pt-2 border-t">
            <label className="block text-neutral-700 font-semibold mb-1">
              Organizer Master PIN
            </label>
            <input
              type="text"
              maxLength={6}
              value={organizerPin}
              onChange={(e) => setOrganizerPin(e.target.value)}
              className="w-36 p-2 border border-neutral-300 rounded-lg font-mono text-xs"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Rules & Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
