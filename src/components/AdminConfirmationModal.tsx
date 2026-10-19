import React, { useState, useEffect } from 'react';
import { Registration, PaymentStatus, TelebirrConfig } from '../types/registration';
import {
  X,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Phone,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
  FileText,
  DollarSign
} from 'lucide-react';

interface AdminConfirmationModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  telebirrConfig: TelebirrConfig;
  allRegistrations: Registration[];
  onSelectRegistration: (reg: Registration) => void;
  onConfirmStatus: (
    id: string,
    status: PaymentStatus,
    options: { adminNote?: string; rejectionReason?: string; verifiedBy?: string }
  ) => Promise<void>;
}

export const AdminConfirmationModal: React.FC<AdminConfirmationModalProps> = ({
  registration,
  isOpen,
  onClose,
  telebirrConfig,
  allRegistrations,
  onSelectRegistration,
  onConfirmStatus
}) => {
  const [adminNote, setAdminNote] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>(
    'Telebirr transaction code could not be verified'
  );
  const [customRejection, setCustomRejection] = useState<string>('');
  const [verifiedBy, setVerifiedBy] = useState<string>(telebirrConfig.accountName || 'Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);

  // Zoom / image inspection state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Synchronize state whenever a new registration is opened
  useEffect(() => {
    if (registration) {
      setAdminNote(registration.adminNote || '');
      setRejectionReason(
        registration.rejectionReason || 'Telebirr transaction code could not be verified'
      );
      setCustomRejection('');
      setVerifiedBy(registration.verifiedBy || telebirrConfig.accountName || 'Admin');
      setZoomLevel(1);
      setRotation(0);
      setCopiedCode(false);
      setCopiedSMS(false);
    }
  }, [registration, telebirrConfig.accountName]);

  if (!isOpen || !registration) return null;

  // Pending queue navigation
  const pendingList = allRegistrations.filter((r) => r.paymentStatus === 'pending_verification');
  const currentIndex = pendingList.findIndex((r) => r.id === registration.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < pendingList.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectRegistration(pendingList[currentIndex - 1]);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectRegistration(pendingList[currentIndex + 1]);
      setZoomLevel(1);
      setRotation(0);
    }
  };

  const handleCopyCode = () => {
    if (registration.telebirrTxCode) {
      navigator.clipboard.writeText(registration.telebirrTxCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const generateConfirmationSMS = (status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      return `🎉 ሰላም ${registration.name}! የዕድል ቲኬት ቁጥርዎ #${registration.ticketNumber} (የመረጧቸው ቁጥሮች: ${registration.luckyNumbers.join(', ')}) በቴሌብር ክፍያዎ ተረጋግጦ በአድሚን ጸድቋል! ወደ ዕጣው ገብተዋል። መልካም ዕድል! / Hello ${registration.name}, your Ticket #${registration.ticketNumber} has been CONFIRMED by Admin for the Lucky Draw. Good luck!`;
    } else {
      const reason = customRejection || rejectionReason;
      return `⚠️ ሰላም ${registration.name}፣ ለቲኬት #${registration.ticketNumber} ያስገቡት የቴሌብር ክፍያ ማረጋገጫ አልጸደቀም (${reason})። እባክዎ ትክክለኛውን የክፍያ ኮድ ወይም ደረሰኝ በድጋሚ ይላኩ። / Hello ${registration.name}, your payment for Ticket #${registration.ticketNumber} was not approved (${reason}). Please re-submit your receipt.`;
    }
  };

  const handleCopySMS = (status: 'approved' | 'rejected') => {
    const text = generateConfirmationSMS(status);
    navigator.clipboard.writeText(text);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2000);
  };

  const handleOpenWhatsApp = (status: 'approved' | 'rejected') => {
    const cleanPhone = registration.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(generateConfirmationSMS(status));
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleAction = async (status: PaymentStatus) => {
    setIsSubmitting(true);
    try {
      await onConfirmStatus(registration.id, status, {
        adminNote: adminNote.trim(),
        rejectionReason: status === 'rejected' ? (customRejection.trim() || rejectionReason) : undefined,
        verifiedBy: verifiedBy.trim()
      });

      // If we approved or rejected and there's a next item in the pending queue, go to it!
      if (status === 'verified' && hasNext) {
        handleNext();
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                registration.paymentStatus === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : registration.paymentStatus === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-neutral-950'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-neutral-500 uppercase">
                  Admin Confirmation Center
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    registration.paymentStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : registration.paymentStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  }`}
                >
                  {registration.paymentStatus === 'verified'
                    ? 'Confirmed by Admin'
                    : registration.paymentStatus === 'rejected'
                    ? 'Rejected / Action Needed'
                    : 'Pending Admin Review'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>{registration.ticketNumber}</span>
                <span className="text-neutral-400 font-normal">·</span>
                <span className="font-semibold text-neutral-800">{registration.name}</span>
              </h2>
            </div>
          </div>

          {/* Quick Queue Controls & Close */}
          <div className="flex items-center gap-2">
            {pendingList.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 text-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                  title="Previous pending ticket"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[11px] text-neutral-600">
                  {currentIndex !== -1 ? `${currentIndex + 1}/${pendingList.length}` : 'Review'}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                  title="Next pending ticket"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Participant & Payment Proof */}
            <div className="space-y-4">
              {/* Participant Info Card */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Participant Details</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Full Name</span>
                    <span className="font-semibold text-neutral-900">{registration.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Phone Number</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-neutral-900">
                      <span>{registration.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Host Link</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 inline-block mt-0.5">
                      {registration.refCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Submitted At</span>
                    <span className="text-neutral-600 font-mono text-[11px]">
                      {new Date(registration.registeredAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Lucky Numbers Selected */}
                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500 block text-[11px] font-medium mb-1.5">
                    Chosen Lucky Numbers ({registration.luckyNumbers.length}):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {registration.luckyNumbers.map((num) => (
                      <span
                        key={num}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-amber-400 font-black font-mono text-xs shadow-xs border border-amber-400/30"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {registration.customNote && (
                    <p className="mt-2 text-[11px] text-neutral-500 italic bg-white p-2 rounded border border-neutral-200">
                      "{registration.customNote}"
                    </p>
                  )}
                </div>
              </div>

              {/* Telebirr Payment Evidence Card */}
              <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0072bc]" />
                    <span>Telebirr Evidence</span>
                  </h3>
                  <span className="text-xs font-bold text-[#0072bc] bg-sky-100 px-2 py-0.5 rounded-full font-mono">
                    Required: {telebirrConfig.feePerTicket} ETB
                  </span>
                </div>

                {/* Transaction Code */}
                <div>
                  <span className="text-[11px] font-medium text-neutral-600 block mb-1">
                    Telebirr SMS / App Transaction Code:
                  </span>
                  {registration.telebirrTxCode ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-sky-300 rounded-lg px-3 py-2 font-mono font-bold text-sm text-sky-950 select-all tracking-wider">
                        {registration.telebirrTxCode}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-3 py-2 bg-[#0072bc] hover:bg-[#005a96] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Copy Transaction Code to search in Telebirr app"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                      No transaction code typed (Participant uploaded screenshot below).
                    </div>
                  )}
                </div>

                {/* Screenshot Viewer */}
                <div>
                  <span className="text-[11px] font-medium text-neutral-600 block mb-1">
                    Uploaded Receipt / Transfer Screenshot:
                  </span>
                  {registration.screenshotUrl ? (
                    <div className="space-y-2">
                      <div className="relative bg-neutral-950 rounded-xl overflow-hidden border border-neutral-300 flex items-center justify-center p-2 min-h-[220px] max-h-[320px]">
                        <img
                          src={registration.screenshotUrl}
                          alt="Telebirr Payment Receipt"
                          style={{
                            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                            transition: 'transform 0.2s ease'
                          }}
                          className="max-h-[300px] w-auto object-contain cursor-zoom-in"
                        />

                        {/* Image overlay controls */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-neutral-900/80 backdrop-blur-xs p-1 rounded-lg text-white text-xs border border-neutral-700">
                          <button
                            type="button"
                            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                            className="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                            title="Zoom out"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1 font-mono text-[10px]">{Math.round(zoomLevel * 100)}%</span>
                          <button
                            type="button"
                            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                            className="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                            title="Zoom in"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRotation((r) => (r + 90) % 360)}
                            className="p-1 hover:bg-neutral-800 rounded cursor-pointer"
                            title="Rotate 90 degrees"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>Check for matching amount, phone, and time</span>
                        <a
                          href={registration.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0072bc] hover:underline flex items-center gap-1"
                        >
                          <span>Open full size</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-100 rounded-lg text-neutral-500 text-xs text-center border border-dashed border-neutral-300">
                      No screenshot was uploaded. Verified solely via SMS Transaction Code above.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Admin Confirmation Decision & Actions */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Decision Panel */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Admin Decision & Status</span>
                  </h3>

                  {/* Confirmed Details if already approved */}
                  {registration.paymentStatus === 'verified' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ticket Confirmed for Draw!</span>
                      </div>
                      <p className="text-emerald-700 text-[11px]">
                        Verified by: <strong>{registration.verifiedBy || 'Admin'}</strong>
                        {registration.verifiedAt && ` on ${new Date(registration.verifiedAt).toLocaleString()}`}
                      </p>
                      {registration.adminNote && (
                        <p className="text-neutral-600 text-[11px] mt-1 italic">
                          Note: "{registration.adminNote}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rejected Details if rejected */}
                  {registration.paymentStatus === 'rejected' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Payment Rejected by Admin</span>
                      </div>
                      <p className="text-rose-700 text-[11px]">
                        Reason: <strong>{registration.rejectionReason}</strong>
                      </p>
                    </div>
                  )}

                  {/* Admin Reviewer Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Admin / Reviewer Name:
                    </label>
                    <input
                      type="text"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      placeholder="e.g. Amare Asmamaw (Admin)"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  {/* Admin Verification Note */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Admin Audit Note (Optional):
                    </label>
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g. Telebirr SMS matched 50 ETB received at 14:32"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  {/* Rejection Reason Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      If Rejecting, choose reason:
                    </label>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white mb-2"
                    >
                      <option value="Telebirr transaction code not found in statement">
                        Transaction code not found in Telebirr statement
                      </option>
                      <option value="Amount paid does not match required fee">
                        Amount paid is incorrect (less than {telebirrConfig.feePerTicket} ETB)
                      </option>
                      <option value="Screenshot is blurry or unreadable">
                        Screenshot is blurry or illegible
                      </option>
                      <option value="Duplicate transaction code already used for another ticket">
                        Duplicate transaction code already claimed
                      </option>
                      <option value="Other / Custom reason">Other / Custom reason</option>
                    </select>
                    {rejectionReason === 'Other / Custom reason' && (
                      <input
                        type="text"
                        value={customRejection}
                        onChange={(e) => setCustomRejection(e.target.value)}
                        placeholder="Type custom rejection explanation..."
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900"
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-neutral-200 space-y-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAction('verified')}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve & Confirm Ticket (Draw Ready)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleAction('rejected')}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Reject Payment</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleAction('pending_verification')}
                        className="py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Reset to Pending</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant Participant Notification Tool */}
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2 text-xs">
                  <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Participant Confirmation Notification</span>
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Send instant confirmation SMS or WhatsApp to <strong>{registration.phone}</strong>:
                  </p>

                  <div className="p-2.5 bg-white border border-neutral-200 rounded-lg text-[11px] text-neutral-700 font-sans leading-relaxed">
                    {generateConfirmationSMS(registration.paymentStatus === 'rejected' ? 'rejected' : 'approved')}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopySMS(registration.paymentStatus === 'rejected' ? 'rejected' : 'approved')
                      }
                      className="flex-1 py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSMS ? 'SMS Copied!' : 'Copy SMS Message'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenWhatsApp(registration.paymentStatus === 'rejected' ? 'rejected' : 'approved')
                      }
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono">Ticket: {registration.ticketNumber}</span>
            <span>·</span>
            <span className="font-mono">{registration.phone}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
