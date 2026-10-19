import React from 'react';
import { X, ShieldAlert, CheckCircle2, Scale, Clock, Phone, FileText } from 'lucide-react';
import { LotterySettings } from '../types/lotteryRules';

interface TermsAndLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LotterySettings;
}

export const TermsAndLegalModal: React.FC<TermsAndLegalModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-neutral-800" />
            <h3 className="font-bold text-sm text-neutral-900">Official Rules, Trust & Legal Compliance</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 leading-relaxed text-neutral-700">
          {/* Regulatory & 18+ Warning */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Strict 18+ Age Requirement & Ethiopian Regulatory Compliance</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Participation in prize draws involving real money requires players to be at least 18 years of age. All operations adhere to standard fair gaming guidelines and consumer protections aligned with the National Lottery Administration of Ethiopia.
            </p>
          </div>

          {/* 1. Ticket & Prizes */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>01. Ticket Pricing & Prize Structure</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
              <li>Ticket Price: <strong>{settings.ticketPriceETB} ETB</strong> per ticket.</li>
              <li>Each participant chooses <strong>{settings.pickCount} lucky numbers</strong> from the range <strong>{settings.numberRangeMin} to {settings.numberRangeMax}</strong>.</li>
              <li>Maximum ticket limit: <strong>{settings.maxTicketsPerPerson} tickets</strong> per participant phone number to encourage responsible play.</li>
              <li>
                Prizes:
                <ul className="list-circle list-inside pl-4 mt-0.5 space-y-0.5 font-mono text-[11px]">
                  {settings.fixedPrizes.map((p) => (
                    <li key={p.rank}>
                      {p.name}: <strong>{p.amountETB.toLocaleString()} ETB</strong> ({p.matchRequirement})
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {/* 2. Draw Schedule & Closing Times */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>02. Draw Schedule & Cutoff Times</span>
            </h4>
            <p className="text-neutral-600">
              Draws take place on a public, transparent schedule. Registration strictly closes <strong>{settings.registrationCloseMinutesBefore} minutes prior</strong> to the scheduled draw to lock the participant ledger and compute verifiable cryptographic audit seeds.
            </p>
          </div>

          {/* 3. Telebirr Payment & Verification */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>03. Telebirr Payment & Verification</span>
            </h4>
            <p className="text-neutral-600">
              All ticket entry payments are made via Telebirr. To ensure accurate verification, participants must provide their Telebirr SMS transaction reference code or upload a clear screenshot of the transaction receipt. Tickets with unverified payments are not entered into the draw.
            </p>
          </div>

          {/* 4. Winner Notification & Claim Procedures */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>04. Winner Notification & Payouts</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
              <li>Winners are immediately posted to the public Results page with masked phone numbers for privacy.</li>
              <li>Winners receive official notification via SMS or WhatsApp to their registered mobile number.</li>
              <li>Prize payouts are disbursed directly to the winner's registered Telebirr mobile wallet.</li>
              <li>Claim Deadline: Prizes must be claimed within <strong>{settings.claimDeadlineDays} calendar days</strong> of the draw date.</li>
            </ul>
          </div>

          {/* 5. Cancellation & Refund Policy */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>05. Cancellation & Refund Guarantee</span>
            </h4>
            <p className="text-neutral-600">
              If an event is cancelled or permanently discontinued, 100% of verified ticket payments will be refunded back to the participant's Telebirr account within 7 business days, or rolled over to the rescheduled date at the participant's option.
            </p>
          </div>

          {/* 6. Privacy & Data Protection */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>06. Privacy & Phone Number Protection</span>
            </h4>
            <p className="text-neutral-600">
              Participant phone numbers are strictly used for registration verification and winner notification. Public winner logs always mask phone numbers (e.g. <code>+251 91 *** 4567</code>) to safeguard user confidentiality.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            {settings.complianceNote}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
