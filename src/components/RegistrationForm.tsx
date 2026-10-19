import React, { useState, useEffect, useRef } from 'react';
import { Registration, ReferralLink, TelebirrConfig } from '../types/registration';
import { LotterySettings, DEFAULT_LOTTERY_SETTINGS } from '../types/lotteryRules';
import { submitRegistration, fetchTelebirrConfig } from '../utils/registrationApi';
import {
  Sparkles,
  CheckCircle2,
  Phone,
  User,
  Hash,
  Dices,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Tag,
  ArrowRight,
  CreditCard,
  Upload,
  Image as ImageIcon,
  X,
  FileCheck2,
  Clock,
  ShieldCheck,
  HelpCircle,
  ShieldAlert,
  FileText
} from 'lucide-react';

interface RegistrationFormProps {
  initialRefCode?: string;
  links: ReferralLink[];
  settings?: LotterySettings;
  registrations?: Registration[];
  onRegistrationSuccess: (reg: Registration) => void;
  onGoToLinks: () => void;
  onOpenTerms?: () => void;
}

const COUNTRY_CODES = [
  { code: '+251', label: 'Ethiopia (+251)' },
  { code: '+1', label: 'USA / Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+254', label: 'Kenya (+254)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+61', label: 'Australia (+61)' }
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialRefCode = '',
  links = [],
  settings,
  registrations = [],
  onRegistrationSuccess,
  onGoToLinks,
  onOpenTerms = () => {}
}) => {
  const activeSettings = settings || DEFAULT_LOTTERY_SETTINGS;
  const safeRegistrations = registrations || [];

  const [telebirrConfig, setTelebirrConfig] = useState<TelebirrConfig>({
    accountNumber: '0911234567',
    accountName: 'Amare Asmamaw',
    feePerTicket: activeSettings.ticketPriceETB || 50,
    instructions: '1. Open Telebirr App or dial *127#\n2. Transfer 50 ETB to 0911234567 (Amare Asmamaw)\n3. Enter your Telebirr SMS transaction code or upload screenshot below to confirm your ticket.',
    isActive: true
  });

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState(initialRefCode || (links[0]?.code || 'default'));
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([7, 21]);
  const [customInputNumber, setCustomInputNumber] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [agreedTo18Plus, setAgreedTo18Plus] = useState(false);

  // Telebirr Payment State
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'free'>('telebirr');
  const [telebirrTxCode, setTelebirrTxCode] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState<Registration | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTelebirrConfig().then((cfg) => {
      setTelebirrConfig({
        ...cfg,
        feePerTicket: activeSettings.ticketPriceETB || cfg.feePerTicket
      });
    });
  }, [activeSettings.ticketPriceETB]);

  useEffect(() => {
    if (initialRefCode) {
      setRefCode(initialRefCode);
    }
  }, [initialRefCode]);

  const activeLink = links.find((l) => l.code.toLowerCase() === refCode.toLowerCase());

  // Toggle number in/out
  const handleToggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length >= 10) {
        setErrorMessage('You can choose up to 10 lucky numbers');
        return;
      }
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
      setErrorMessage(null);
    }
  };

  // Add custom typed number
  const handleAddCustomNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInputNumber.trim(), 10);
    if (isNaN(val) || val <= 0 || val > 9999) {
      setErrorMessage('Please enter a valid number between 1 and 9999');
      return;
    }
    if (selectedNumbers.includes(val)) {
      setErrorMessage(`Number ${val} is already chosen`);
      return;
    }
    if (selectedNumbers.length >= 10) {
      setErrorMessage('Maximum 10 lucky numbers reached');
      return;
    }
    setSelectedNumbers([...selectedNumbers, val].sort((a, b) => a - b));
    setCustomInputNumber('');
    setErrorMessage(null);
  };

  // Quick Random Pick
  const handleQuickPick = () => {
    const picks = new Set<number>();
    while (picks.size < 3) {
      const rand = Math.floor(Math.random() * 99) + 1;
      picks.add(rand);
    }
    setSelectedNumbers(Array.from(picks).sort((a, b) => a - b));
    setErrorMessage(null);
  };

  // Clear numbers
  const handleClearNumbers = () => {
    setSelectedNumbers([]);
  };

  // Handle screenshot upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (PNG, JPG, or JPEG)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Screenshot size must be under 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyTelebirrAccount = () => {
    navigator.clipboard.writeText(telebirrConfig.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Submit Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }
    if (activeSettings.requireAge18 && !agreedTo18Plus) {
      setErrorMessage(
        'You must confirm you are at least 18 years old and agree to the Official Rules and Terms to participate.'
      );
      return;
    }

    // Check maximum tickets limit per person/phone
    const normalizedPhone = phone.replace(/[\s-]/g, '');
    const countForThisPhone = safeRegistrations.filter((r) =>
      r.phone.replace(/[\s-]/g, '').endsWith(normalizedPhone.slice(-9))
    ).length;

    if (countForThisPhone >= activeSettings.maxTicketsPerPerson) {
      setErrorMessage(
        `Ticket limit reached: A maximum of ${activeSettings.maxTicketsPerPerson} tickets are permitted per phone number.`
      );
      return;
    }

    // Telebirr validation: require either transaction code or uploaded screenshot
    if (paymentMethod === 'telebirr') {
      if (!telebirrTxCode.trim() && !screenshotPreview) {
        setErrorMessage(
          'Please enter your Telebirr transaction code OR upload your payment screenshot to confirm payment.'
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const fullPhone = phone.trim().startsWith('+') ? phone.trim() : `${countryCode} ${phone.trim()}`;
      const reg = await submitRegistration({
        name: name.trim(),
        phone: fullPhone,
        countryCode,
        luckyNumbers: selectedNumbers,
        refCode: refCode.trim(),
        refName: activeLink ? activeLink.title : 'Direct Link',
        customNote: customNote.trim(),
        paymentMethod,
        paymentAmount: telebirrConfig.feePerTicket,
        telebirrTxCode: telebirrTxCode.trim() || undefined,
        screenshotUrl: screenshotPreview || undefined
      });

      setCompletedRegistration(reg);
      onRegistrationSuccess(reg);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (!completedRegistration) return;
    const text = `🎟️ Lucky Ticket: ${completedRegistration.ticketNumber}\n👤 Name: ${completedRegistration.name}\n📞 Phone: ${completedRegistration.phone}\n✨ Lucky Numbers: ${completedRegistration.luckyNumbers.join(', ')}\n💳 Telebirr Payment: ${completedRegistration.paymentStatus === 'verified' ? 'Verified' : 'Pending Verification'} (${completedRegistration.paymentAmount} ETB)\n${completedRegistration.telebirrTxCode ? `🔢 Tx Code: ${completedRegistration.telebirrTxCode}\n` : ''}🔗 Registered via Link: ${completedRegistration.refCode}`;
    navigator.clipboard.writeText(text);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!completedRegistration) return;
    const text = `I just registered my lucky numbers (${completedRegistration.luckyNumbers.join(', ')}) with ticket ${completedRegistration.ticketNumber}! Confirmed via Telebirr. Register yours here: ${window.location.origin}?ref=${encodeURIComponent(completedRegistration.refCode)}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // If completed, show confirmation ticket
  if (completedRegistration) {
    return (
      <div className="max-w-xl mx-auto py-6">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-lg animate-fade-in">
          {/* Ticket Header */}
          <div className="bg-neutral-900 text-white p-6 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                  Digital Lucky Pass
                </span>
                <h3 className="text-xl font-bold mt-0.5">
                  {completedRegistration.paymentStatus === 'verified'
                    ? 'Registration & Payment Confirmed'
                    : 'Registration Received · Awaiting Admin Confirmation'}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  completedRegistration.paymentStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {completedRegistration.paymentStatus === 'verified' ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <Clock className="w-7 h-7" />
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">TICKET NUMBER</span>
              <span className="text-white font-bold tracking-wider">{completedRegistration.ticketNumber}</span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-500 block mb-0.5">Participant Name</span>
                <strong className="text-sm font-semibold text-neutral-900 block">{completedRegistration.name}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Phone Number</span>
                <strong className="text-sm font-semibold text-neutral-900 block font-mono">{completedRegistration.phone}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Registration Link</span>
                <span className="font-mono text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                  {completedRegistration.refCode}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Registered Date</span>
                <span className="text-neutral-700 font-mono text-[11px]">
                  {new Date(completedRegistration.registeredAt).toLocaleDateString()} {new Date(completedRegistration.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Telebirr Payment Status Badge & Details */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#0072bc] text-white flex items-center justify-center font-bold text-xs">
                    tb
                  </span>
                  <span className="font-bold text-xs text-neutral-900">Telebirr Payment</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {completedRegistration.paymentStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Confirmed by Admin</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Awaiting Admin Confirmation</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-neutral-700">
                <div>
                  <span className="text-neutral-500 text-[11px] block">Amount Paid:</span>
                  <strong className="text-neutral-900">{completedRegistration.paymentAmount} ETB</strong>
                </div>
                {completedRegistration.telebirrTxCode && (
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Telebirr Tx Code:</span>
                    <strong className="text-sky-800">{completedRegistration.telebirrTxCode}</strong>
                  </div>
                )}
              </div>

              {completedRegistration.screenshotUrl && (
                <div className="pt-2 border-t border-sky-100">
                  <span className="text-[11px] text-neutral-500 block mb-1">Uploaded Telebirr Receipt:</span>
                  <img
                    src={completedRegistration.screenshotUrl}
                    alt="Telebirr Receipt Screenshot"
                    className="max-h-36 rounded-lg border border-neutral-200 object-contain bg-white"
                  />
                </div>
              )}
            </div>

            {/* Chosen Lucky Numbers */}
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Your Chosen Lucky Numbers:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {completedRegistration.luckyNumbers.map((num) => (
                  <div
                    key={num}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white font-bold text-lg flex items-center justify-center shadow-md border-2 border-white"
                  >
                    {num}
                  </div>
                ))}
              </div>
              {completedRegistration.customNote && (
                <p className="mt-2 text-xs italic text-neutral-500">
                  "{completedRegistration.customNote}"
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyTicket}
                className="w-full sm:flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedTicket ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedTicket ? 'Copied to Clipboard!' : 'Copy Ticket Info'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setCompletedRegistration(null);
                  setName('');
                  setPhone('');
                  setTelebirrTxCode('');
                  setScreenshotPreview(null);
                  setSelectedNumbers([7, 21]);
                }}
                className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
              >
                Register Another Person
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {/* Banner with Link context */}
        <div className="bg-neutral-900 text-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono tracking-wider text-amber-400 uppercase font-semibold">
                Participant Portal
              </span>
              <h2 className="text-lg font-bold">Register with Name, Phone, Lucky Numbers & Telebirr</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Join through this link, select your lucky numbers, and confirm entry via Telebirr.
              </p>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono">
              <span className="text-neutral-400 block text-[10px]">REGISTERING VIA LINK:</span>
              <span className="font-bold text-white tracking-wide">{refCode}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amare Asmamaw"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-950 focus:outline-hidden transition-all"
            />
          </div>

          {/* 2. Phone Number with Country Code */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              <span>Phone Number <span className="text-red-500">*</span></span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-40 text-xs p-3 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-neutral-950 focus:outline-hidden"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                required
                placeholder="0911234567 or 91 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 text-sm p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-950 focus:outline-hidden font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Your registered phone number for Telebirr and winner notification.
            </p>
          </div>

          {/* 3. Link Selection if multiple available */}
          {links.length > 1 && (
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                <span>Referral / Campaign Link</span>
              </label>
              <select
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-neutral-950"
              >
                {links.map((link) => (
                  <option key={link.id} value={link.code}>
                    {link.title} ({link.code}) - by {link.creatorName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 4. CHOOSE YOUR LUCKY NUMBERS (By their choice!) */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose Your Lucky Numbers <span className="text-red-500">*</span></span>
                </label>
                <span className="text-[11px] text-neutral-500">
                  Pick your favorite lucky numbers by tapping the board, typing below, or rolling quick pick.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickPick}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
                  title="Randomly pick 3 lucky numbers"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Pick</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearNumbers}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors cursor-pointer"
                  title="Clear all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Currently Selected Numbers Display */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 mb-4 min-h-[72px] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-neutral-600 mr-1">Selected:</span>
                {selectedNumbers.length === 0 ? (
                  <span className="text-xs text-neutral-400 italic">No numbers picked yet. Choose below!</span>
                ) : (
                  selectedNumbers.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleToggleNumber(num)}
                      className="group relative w-10 h-10 rounded-full bg-neutral-900 text-white font-bold text-sm flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-xs"
                      title="Click to remove"
                    >
                      <span className="group-hover:hidden">{num}</span>
                      <span className="hidden group-hover:block text-xs">✕</span>
                    </button>
                  ))
                )}
              </div>

              <span className="text-xs font-mono text-neutral-500">
                {selectedNumbers.length} / 10 chosen
              </span>
            </div>

            {/* Custom Input for any special number */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="number"
                  min="1"
                  max="9999"
                  placeholder="Type any custom number (e.g. 77, 333, 2026)"
                  value={customInputNumber}
                  onChange={(e) => setCustomInputNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomNumber(e);
                    }
                  }}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomNumber}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Add Number
              </button>
            </div>

            {/* Interactive Number Board */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                Lucky Number Board (Range: 1 to {activeSettings.numberRangeMax} - Click to toggle):
              </span>
              <div className="grid grid-cols-10 gap-1.5 p-3 bg-neutral-100/70 rounded-xl border border-neutral-200 max-h-48 overflow-y-auto scrollbar-thin">
                {Array.from({ length: activeSettings.numberRangeMax }, (_, i) => i + 1).map((n) => {
                  const isSelected = selectedNumbers.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleToggleNumber(n)}
                      className={`h-8 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-neutral-900 text-white shadow-xs scale-105 font-bold'
                          : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Note */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Why are these your lucky numbers? (Optional note)
              </label>
              <input
                type="text"
                placeholder="e.g. My birthday, wedding date, or favorite player jersey"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 5. TELEBIRR PAYMENT OPTION & CONFIRMATION */}
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#0072bc]" />
                  <span>Telebirr Payment & Confirmation <span className="text-red-500">*</span></span>
                </label>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Complete your {telebirrConfig.feePerTicket} ETB ticket payment via Telebirr to confirm entry.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-md text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('telebirr')}
                  className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'telebirr'
                      ? 'bg-[#0072bc] text-white shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Telebirr ({telebirrConfig.feePerTicket} ETB)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('free')}
                  className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                    paymentMethod === 'free'
                      ? 'bg-neutral-900 text-white shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Free Pass
                </button>
              </div>
            </div>

            {paymentMethod === 'telebirr' && (
              <div className="space-y-4">
                {/* Telebirr Payment Instructions Box */}
                <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#0072bc] text-white flex items-center justify-center font-bold text-sm">
                        tb
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 text-xs">Telebirr Transfer Details</span>
                        <span className="block text-[11px] text-neutral-500">Ethio Telecom Mobile Money</span>
                      </div>
                    </div>

                    <div className="font-mono text-xs bg-white px-2.5 py-1 rounded-md border border-sky-200">
                      Fee: <strong className="text-neutral-900">{telebirrConfig.feePerTicket} ETB</strong>
                    </div>
                  </div>

                  {/* Account Receiver Box */}
                  <div className="p-3 bg-white rounded-lg border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Recipient Account:</span>
                      <strong className="text-sm font-bold text-neutral-900 font-mono">
                        {telebirrConfig.accountNumber}
                      </strong>
                      <span className="text-neutral-600 block text-[11px]">
                        ({telebirrConfig.accountName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyTelebirrAccount}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Copied Number!' : 'Copy Telebirr No.'}</span>
                      </button>

                      <a
                        href={`tel:*127#`}
                        className="px-3 py-1.5 bg-[#0072bc] hover:bg-[#005a96] text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        Dial *127#
                      </a>
                    </div>
                  </div>

                  {/* Step Instructions */}
                  <div className="text-[11px] text-neutral-700 space-y-1 font-mono">
                    <p className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0072bc]">1.</span> Send <strong>{telebirrConfig.feePerTicket} ETB</strong> to <strong>{telebirrConfig.accountNumber}</strong> via Telebirr app or *127#
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0072bc]">2.</span> Confirm using <strong>Payment Code</strong> (from SMS) OR <strong>Upload Screenshot</strong> below:
                    </p>
                  </div>
                </div>

                {/* 2 Ways to Confirm: Code OR Screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Payment Code */}
                  <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                    <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-sky-600" />
                      <span>Confirmation Method A:</span>
                    </label>
                    <span className="text-[11px] text-neutral-500 block">
                      Telebirr SMS Transaction Code
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. TB91827401 or FT24019284"
                      value={telebirrTxCode}
                      onChange={(e) => setTelebirrTxCode(e.target.value)}
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 font-mono uppercase"
                    />
                    <p className="text-[10px] text-neutral-400">
                      Copy the reference ID from your Telebirr SMS receipt.
                    </p>
                  </div>

                  {/* Option B: Screenshot Upload */}
                  <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                    <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Confirmation Method B:</span>
                    </label>
                    <span className="text-[11px] text-neutral-500 block">
                      Upload Payment Screenshot
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />

                    {screenshotPreview ? (
                      <div className="relative border border-neutral-200 rounded-lg p-2 bg-neutral-50 flex items-center gap-3">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot Preview"
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <span className="font-semibold text-emerald-700 block truncate">
                            Receipt attached ✓
                          </span>
                          <span className="text-[10px] text-neutral-500">Ready for verification</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 border border-dashed border-neutral-300 hover:border-neutral-500 rounded-lg text-xs font-medium text-neutral-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-neutral-50 hover:bg-neutral-100"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Select Screenshot Image</span>
                      </button>
                    )}
                    <p className="text-[10px] text-neutral-400">
                      Snap or upload a photo of the completed transaction screen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 18+ Verification & Terms Agreement */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={agreedTo18Plus}
                onChange={(e) => setAgreedTo18Plus(e.target.checked)}
                className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950"
              />
              <span className="text-neutral-700 leading-snug">
                I confirm that I am at least <strong>18 years of age</strong> and agree to the{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="text-neutral-950 font-bold underline hover:text-[#0072bc] cursor-pointer inline"
                >
                  Official Rules, Terms & Telebirr Policy
                </button>
                .
              </span>
            </label>
            <p className="text-[10px] text-neutral-400 pl-6">
              Fair play rules apply. One person may hold up to {activeSettings.maxTicketsPerPerson} tickets. Unlicensed lottery operation is strictly regulated under Ethiopian law.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || selectedNumbers.length === 0}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting
                  ? 'Verifying & Submitting...'
                  : paymentMethod === 'telebirr'
                  ? `Confirm ${telebirrConfig.feePerTicket} ETB Payment & Register`
                  : 'Complete Registration & Get Ticket'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
