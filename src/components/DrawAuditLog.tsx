import React, { useState } from 'react';
import { DrawAuditRecord, LotterySettings } from '../types/lotteryRules';
import {
  ShieldCheck,
  Trophy,
  Calendar,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface DrawAuditLogProps {
  auditHistory: DrawAuditRecord[];
  settings: LotterySettings;
  onOpenTerms: () => void;
}

export const DrawAuditLog: React.FC<DrawAuditLogProps> = ({
  auditHistory,
  settings,
  onOpenTerms
}) => {
  const [selectedDrawIndex, setSelectedDrawIndex] = useState(0);
  const activeDraw = auditHistory[selectedDrawIndex] || auditHistory[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Transparency & Audit Log</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Provably Fair Records</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Official Draw Results & Winners Audit</h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Complete public ledger of all past lucky draws, verified winning numbers, cryptographic seeds, and Telebirr payout records.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTerms}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rules & Fairness Policy</span>
        </button>
      </div>

      {/* Main Draw View */}
      {activeDraw ? (
        <div className="space-y-6">
          {/* Active Draw Banner Card */}
          <div className="bg-neutral-900 text-white rounded-xl p-6 border border-neutral-800 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="bg-amber-500 text-neutral-950 font-bold px-2.5 py-0.5 rounded">
                OFFICIAL DRAW #{activeDraw.drawNumber}
              </span>
              <span className="text-neutral-400">
                DATE: {new Date(activeDraw.drawDate).toLocaleDateString()} {new Date(activeDraw.drawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT
              </span>
            </div>

            {/* Big Winning Numbers */}
            <div className="py-2 text-center space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block">
                Official Winning Numbers Drawn
              </span>
              <div className="flex items-center justify-center gap-3.5 flex-wrap">
                {activeDraw.drawnNumbers.map((num) => (
                  <div
                    key={num}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-neutral-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800 text-xs font-mono">
              <div>
                <span className="text-neutral-400 text-[11px] block">Tickets Participating:</span>
                <strong className="text-white text-sm">{activeDraw.totalTicketsSold}</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px] block">Total Prize Pool:</span>
                <strong className="text-amber-400 text-sm">{activeDraw.totalPoolETB.toLocaleString()} ETB</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px] block">Verified Winners:</span>
                <strong className="text-emerald-400 text-sm">{activeDraw.winnersCount} Participants</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[11px] block">Audit Proof Hash:</span>
                <span className="text-neutral-300 text-[10px] truncate block select-all font-mono" title={activeDraw.randomSeed}>
                  {activeDraw.randomSeed.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          {/* Winners Ledger Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-3">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Verified Winners for Draw #{activeDraw.drawNumber}</span>
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                Claim Deadline: {settings.claimDeadlineDays} Days from Draw
              </span>
            </div>

            {activeDraw.winners.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No winners recorded for this draw.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase font-mono tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Rank</th>
                      <th className="py-3 px-4 font-semibold">Ticket #</th>
                      <th className="py-3 px-4 font-semibold">Participant</th>
                      <th className="py-3 px-4 font-semibold">Phone (Masked)</th>
                      <th className="py-3 px-4 font-semibold">Matched Numbers</th>
                      <th className="py-3 px-4 font-semibold">Prize Amount</th>
                      <th className="py-3 px-4 font-semibold text-right">Telebirr Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-normal">
                    {activeDraw.winners.map((winner, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/70">
                        <td className="py-3 px-4 font-bold text-neutral-900">
                          {winner.prizeRank}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-amber-800">
                          {winner.ticketNumber}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-900">
                          {winner.participantName}
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-600">
                          {winner.phoneMasked}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {winner.matchedNumbers.map((m) => (
                              <span
                                key={m}
                                className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-bold font-mono text-[11px] flex items-center justify-center"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                          {winner.prizeAmountETB.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4 text-right">
                          {winner.payoutStatus === 'paid_telebirr' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Paid via Telebirr ✓</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                              <span>Pending Claim</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center text-xs text-neutral-500">
          No audit records currently available.
        </div>
      )}
    </div>
  );
};
