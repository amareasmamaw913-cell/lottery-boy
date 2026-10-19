import React, { useState } from 'react';
import { Registration } from '../types/registration';
import { LotterySettings, DrawAuditRecord } from '../types/lotteryRules';
import {
  Search,
  CheckCircle2,
  Clock,
  Trophy,
  Sparkles,
  Phone,
  Hash,
  AlertCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface TicketLookupProps {
  registrations: Registration[];
  settings: LotterySettings;
  auditHistory: DrawAuditRecord[];
  onGoToRegister: () => void;
}

export const TicketLookup: React.FC<TicketLookupProps> = ({
  registrations,
  settings,
  auditHistory,
  onGoToRegister
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const cleanQuery = query.trim().toLowerCase().replace(/[\s-]/g, '');

  const matchingTickets = hasSearched && cleanQuery
    ? registrations.filter((r) => {
        const cleanPhone = r.phone.toLowerCase().replace(/[\s-]/g, '');
        const cleanTicket = r.ticketNumber.toLowerCase().replace(/[\s-]/g, '');
        return cleanPhone.includes(cleanQuery) || cleanTicket.includes(cleanQuery);
      })
    : [];

  const latestDraw = auditHistory[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs text-center space-y-3">
        <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          Public Ticket Verification & Results
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Check Your Ticket & Winning Status</h2>
        <p className="text-xs text-neutral-600 max-w-lg mx-auto">
          Enter your registered mobile phone number or your 5-digit Ticket Number to view your ticket, check Telebirr payment confirmation, and see if your lucky numbers matched!
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="e.g. 0911234567 or LUCK-82914"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value) setHasSearched(false);
              }}
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Check Ticket
          </button>
        </form>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-600 font-mono">
            <span>
              Found <strong>{matchingTickets.length}</strong> ticket(s) for "{query}"
            </span>
            {latestDraw && (
              <span>
                Latest Draw Numbers: <strong>{latestDraw.drawnNumbers.join(' - ')}</strong>
              </span>
            )}
          </div>

          {matchingTickets.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-neutral-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-800">No Tickets Found</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No registered tickets matched "{query}". Please double-check your phone number (including country code) or ticket number.
              </p>
              <button
                type="button"
                onClick={onGoToRegister}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                Register a New Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {matchingTickets.map((ticket) => {
                // Check match against latest draw if available
                const matchesWithDraw = latestDraw
                  ? ticket.luckyNumbers.filter((num) => latestDraw.drawnNumbers.includes(num))
                  : [];
                const isWinner = matchesWithDraw.length > 0;

                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-xl border overflow-hidden shadow-xs transition-all ${
                      isWinner ? 'border-amber-400 ring-1 ring-amber-400' : 'border-neutral-200'
                    }`}
                  >
                    {/* Ticket Header Bar */}
                    <div className="p-4 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold tracking-wider text-amber-400">
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          Registered {new Date(ticket.registeredAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Payment Status Pill */}
                      <div className="flex items-center gap-2">
                        {ticket.paymentStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Confirmed by Admin ({ticket.paymentAmount || 50} ETB)</span>
                          </span>
                        ) : ticket.paymentStatus === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Payment Rejected / Resubmission Required</span>
                          </span>
                        ) : ticket.paymentStatus === 'pending_verification' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Awaiting Admin Confirmation</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold bg-neutral-700 text-neutral-300 px-2.5 py-0.5 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Confirmation Status Banner */}
                    {ticket.paymentStatus === 'verified' && (
                      <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            <strong>Approved & Confirmed for Draw:</strong> Your Telebirr payment was verified
                            {ticket.verifiedBy && ` by ${ticket.verifiedBy}`}.
                          </span>
                        </div>
                        {ticket.verifiedAt && (
                          <span className="font-mono text-[11px] text-emerald-700">
                            {new Date(ticket.verifiedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {ticket.paymentStatus === 'rejected' && (
                      <div className="bg-rose-50 border-b border-rose-200 px-5 py-2.5 flex items-center justify-between text-xs text-rose-900">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>
                            <strong>Admin Note:</strong> {ticket.rejectionReason || 'Please contact organizer with correct transfer code.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {ticket.paymentStatus === 'pending_verification' && (
                      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          <span>
                            <strong>Under Admin Review:</strong> Your Telebirr transfer code ({ticket.telebirrTxCode || 'Receipt uploaded'}) is currently in the review queue.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Ticket Details Body */}
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-neutral-100 pb-3">
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Participant:</span>
                          <strong className="text-neutral-900 font-semibold">{ticket.name}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Phone:</span>
                          <strong className="text-neutral-900 font-mono">{ticket.phone}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Telebirr Tx:</span>
                          <span className="text-sky-800 font-mono font-semibold">
                            {ticket.telebirrTxCode || 'Pending Receipt'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[11px]">Referral Link:</span>
                          <span className="font-mono text-neutral-700 bg-neutral-100 px-1.5 py-0.2 rounded text-[11px]">
                            {ticket.refCode}
                          </span>
                        </div>
                      </div>

                      {/* Lucky Numbers Display */}
                      <div>
                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                          Your Chosen Lucky Numbers:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {ticket.luckyNumbers.map((num) => {
                            const isMatched = latestDraw && latestDraw.drawnNumbers.includes(num);
                            return (
                              <div
                                key={num}
                                className={`w-10 h-10 rounded-full font-mono font-bold text-sm flex items-center justify-center shadow-xs ${
                                  isMatched
                                    ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-300 scale-105'
                                    : 'bg-neutral-900 text-white'
                                }`}
                                title={isMatched ? 'WINNING MATCH!' : 'Selected number'}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Winning Outcome Banner if matched */}
                      {latestDraw && (
                        <div
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                            isWinner
                              ? 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isWinner ? (
                              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                            )}
                            <span>
                              {isWinner
                                ? `🎉 Congratulations! Matched ${matchesWithDraw.length} winning number(s): ${matchesWithDraw.join(', ')}!`
                                : `Draw #${latestDraw.drawNumber} completed. Ready for next scheduled draw.`}
                            </span>
                          </div>

                          {isWinner && (
                            <span className="font-mono font-bold text-amber-800 text-[11px]">
                              Claim via Telebirr (Deadline: {settings.claimDeadlineDays} days)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
