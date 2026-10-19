import React, { useState, useEffect } from 'react';
import { LotterySettings } from '../types/lotteryRules';
import { Clock, Trophy, Sparkles, AlertCircle, Calendar } from 'lucide-react';

interface DrawScheduleCountdownProps {
  settings: LotterySettings;
  onGoToRegister: () => void;
  onGoToResults: () => void;
}

export const DrawScheduleCountdown: React.FC<DrawScheduleCountdownProps> = ({
  settings,
  onGoToRegister,
  onGoToResults
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isClosed: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(settings.nextDrawTime).getTime();
      const now = Date.now();
      const diff = target - now;

      // Close registration X minutes before
      const closeBufferMs = settings.registrationCloseMinutesBefore * 60 * 1000;
      const isRegistrationClosed = diff <= closeBufferMs;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isClosed: isRegistrationClosed });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.nextDrawTime, settings.registrationCloseMinutesBefore]);

  const jackpotPrize = settings.fixedPrizes.find((p) => p.rank === 1)?.amountETB || 15000;
  const drawDateFormatted = new Date(settings.nextDrawTime).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white rounded-2xl p-5 sm:p-7 border border-neutral-800 shadow-xl overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Draw Title & Prize Pool */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Telebirr Lucky Draw</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{settings.drawScheduleType.toUpperCase()} EVENT</span>
            <span aria-hidden="true">·</span>
            <span>{settings.pickCount} NUMBERS (1–{settings.numberRangeMax})</span>
          </div>

          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 block">
              Grand Jackpot Prize:
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
                {jackpotPrize.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-amber-400 font-mono">ETB</span>
              <span className="text-xs text-neutral-400 ml-2 font-mono">
                (Ticket: {settings.ticketPriceETB} ETB)
              </span>
            </div>
          </div>

          {/* Prize breakdown strip */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-neutral-300">
            {settings.fixedPrizes.map((tier) => (
              <div key={tier.rank} className="bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60">
                <span className="text-neutral-400 mr-1.5">{tier.rank === 1 ? '1st' : tier.rank === 2 ? '2nd' : '3rd'}:</span>
                <strong className="text-white">{tier.amountETB.toLocaleString()} ETB</strong>
                <span className="text-[10px] text-neutral-400 block sm:inline sm:ml-1">({tier.matchRequirement})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Countdown Timer & CTA */}
        <div className="bg-neutral-800/60 p-4 sm:p-5 rounded-xl border border-neutral-700/80 w-full lg:w-auto flex flex-col items-center gap-3.5">
          <div className="flex items-center justify-between w-full text-xs font-mono text-neutral-400 border-b border-neutral-700/60 pb-2">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>NEXT DRAW: {drawDateFormatted} EAT</span>
            </span>
            <span className={`text-[11px] font-semibold ${timeLeft.isClosed ? 'text-red-400' : 'text-emerald-400'}`}>
              {timeLeft.isClosed ? 'REGISTRATION CLOSED' : 'REGISTRATION OPEN'}
            </span>
          </div>

          {/* Countdown Digit Boxes */}
          <div className="flex items-center gap-2 sm:gap-3 text-center font-mono">
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 min-w-[56px]">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Days</span>
            </div>
            <span className="text-neutral-500 font-bold">:</span>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 min-w-[56px]">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Hours</span>
            </div>
            <span className="text-neutral-500 font-bold">:</span>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 min-w-[56px]">
              <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Mins</span>
            </div>
            <span className="text-neutral-500 font-bold">:</span>
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-2 min-w-[56px]">
              <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Secs</span>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 w-full pt-1">
            <button
              type="button"
              onClick={onGoToRegister}
              disabled={timeLeft.isClosed}
              className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              {timeLeft.isClosed ? 'Registration Closed' : `Pick Lucky Numbers (${settings.ticketPriceETB} ETB)`}
            </button>
            <button
              type="button"
              onClick={onGoToResults}
              className="py-2 px-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Past Draws
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
