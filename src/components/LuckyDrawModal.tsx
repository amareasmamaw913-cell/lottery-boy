import React, { useState } from 'react';
import { Registration } from '../types/registration';
import { X, Dices, Trophy, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';

interface LuckyDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
}

export const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({
  isOpen,
  onClose,
  registrations
}) => {
  const [numberOfBalls, setNumberOfBalls] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [onlyConfirmedTickets, setOnlyConfirmedTickets] = useState(true);

  if (!isOpen) return null;

  const handleStartDraw = () => {
    setIsDrawing(true);
    setDrawnNumbers([]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      // temporary random numbers
      const tempPicks: number[] = [];
      while (tempPicks.length < numberOfBalls) {
        const rand = Math.floor(Math.random() * 80) + 1;
        if (!tempPicks.includes(rand)) tempPicks.push(rand);
      }
      setDrawnNumbers(tempPicks);

      if (step > 15) {
        clearInterval(interval);
        // Final draw
        const finalPicks: number[] = [];
        while (finalPicks.length < numberOfBalls) {
          const rand = Math.floor(Math.random() * 80) + 1;
          if (!finalPicks.includes(rand)) finalPicks.push(rand);
        }
        setDrawnNumbers(finalPicks.sort((a, b) => a - b));
        setIsDrawing(false);
      }
    }, 100);
  };

  const confirmedCount = registrations.filter((r) => r.paymentStatus === 'verified').length;
  const eligibleRegistrations = onlyConfirmedTickets
    ? registrations.filter((r) => r.paymentStatus === 'verified')
    : registrations;

  // Find matching winners
  const winners = drawnNumbers.length > 0
    ? eligibleRegistrations
        .map((r) => {
          const matched = r.luckyNumbers.filter((n) => drawnNumbers.includes(n));
          return {
            registration: r,
            matchedNumbers: matched,
            matchCount: matched.length
          };
        })
        .filter((w) => w.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full p-6 shadow-2xl space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Live Lucky Number Draw</h3>
              <p className="text-xs text-neutral-500">Pick winning numbers and find matching participants.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Confirmation Filter / Eligibility Notice */}
        <div className="flex items-center justify-between gap-3 bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">
                {onlyConfirmedTickets ? 'Drawing from Admin-Confirmed Tickets Only' : 'Drawing from All Registered Tickets'}
              </span>
              <p className="text-[11px] text-emerald-800">
                {eligibleRegistrations.length} eligible participants
                {onlyConfirmedTickets && registrations.length > confirmedCount && (
                  <span> ({registrations.length - confirmedCount} unconfirmed pending review excluded)</span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOnlyConfirmedTickets((v) => !v)}
            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-lg cursor-pointer transition-colors"
          >
            {onlyConfirmedTickets ? 'Include All' : 'Only Confirmed'}
          </button>
        </div>

        {/* Draw Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700">Numbers to draw:</span>
            {[1, 3, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setNumberOfBalls(count)}
                disabled={isDrawing}
                className={`px-3 py-1 rounded-md font-mono font-bold transition-colors cursor-pointer ${
                  numberOfBalls === count
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {count} {count === 1 ? 'Number' : 'Numbers'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleStartDraw}
            disabled={isDrawing}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Dices className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? 'Drawing Numbers...' : 'Roll Winning Numbers'}</span>
          </button>
        </div>

        {/* Drawn Balls Display */}
        <div className="bg-neutral-950 rounded-xl p-6 text-center text-white space-y-3">
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            Official Winning Numbers
          </span>
          <div className="flex items-center justify-center gap-4 py-2 min-h-[64px]">
            {drawnNumbers.length === 0 ? (
              <span className="text-neutral-500 text-xs italic">
                Press "Roll Winning Numbers" to spin the draw
              </span>
            ) : (
              drawnNumbers.map((num) => (
                <div
                  key={num}
                  className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-neutral-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white animate-bounce"
                >
                  {num}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Winners Results List */}
        {drawnNumbers.length > 0 && !isDrawing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Matching Participants ({winners.length})</span>
              </span>
              <span className="text-neutral-500">
                {winners.length === 0 ? 'No exact matches this round' : 'Matched their chosen numbers!'}
              </span>
            </div>

            {winners.length === 0 ? (
              <div className="p-4 bg-neutral-50 rounded-lg text-center text-xs text-neutral-500">
                None of the {registrations.length} registered participants selected these exact numbers. Try rolling again!
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {winners.map((w) => (
                  <div
                    key={w.registration.id}
                    className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{w.registration.name}</span>
                        <span className="font-mono text-neutral-500 text-[11px]">({w.registration.ticketNumber})</span>
                      </div>
                      <span className="font-mono text-neutral-600 text-[11px] block mt-0.5">
                        Phone: {w.registration.phone} · Link: {w.registration.refCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-amber-800 mr-1">
                        Matched {w.matchCount}:
                      </span>
                      {w.matchedNumbers.map((m) => (
                        <span
                          key={m}
                          className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-bold font-mono text-[11px] flex items-center justify-center"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
