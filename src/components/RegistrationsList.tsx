import React, { useState } from 'react';
import { Registration, ReferralLink, TelebirrConfig, PaymentStatus } from '../types/registration';
import {
  Download,
  Dices,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  X,
  Settings,
  Filter,
  Trophy,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { verifyPayment, batchVerifyPayments, VerifyOptions } from '../utils/registrationApi';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface RegistrationsListProps {
  registrations: Registration[];
  links: ReferralLink[];
  telebirrConfig: TelebirrConfig;
  onDeleteRegistration: (id: string) => void;
  onOpenLuckyDraw: () => void;
  onOpenTelebirrSettings: () => void;
  onOpenLotteryRules?: () => void;
  onPaymentStatusChanged: (reg: Registration) => void;
}

export const RegistrationsList: React.FC<RegistrationsListProps> = ({
  registrations,
  links,
  telebirrConfig,
  onDeleteRegistration,
  onOpenLuckyDraw,
  onOpenTelebirrSettings,
  onOpenLotteryRules,
  onPaymentStatusChanged
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefFilter, setSelectedRefFilter] = useState<string>('all');
  const [luckyNumberFilter, setLuckyNumberFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Admin Confirmation Modal state
  const [reviewingReg, setReviewingReg] = useState<Registration | null>(null);

  // Multi-selection for Batch Admin Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchActionInProgress, setIsBatchActionInProgress] = useState(false);

  // Financial & Admin Status Stats
  const totalVerified = registrations.filter((r) => r.paymentStatus === 'verified').length;
  const totalPending = registrations.filter((r) => r.paymentStatus === 'pending_verification').length;
  const totalRejected = registrations.filter((r) => r.paymentStatus === 'rejected').length;
  const totalUnpaid = registrations.filter((r) => r.paymentStatus === 'unpaid').length;
  const totalRevenueETB = registrations
    .filter((r) => r.paymentStatus === 'verified')
    .reduce((sum, r) => sum + (r.paymentAmount || telebirrConfig.feePerTicket), 0);

  // Filtering
  const filtered = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.telebirrTxCode && reg.telebirrTxCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRef =
      selectedRefFilter === 'all' ||
      reg.refCode.toLowerCase() === selectedRefFilter.toLowerCase();

    const matchesNumber =
      !luckyNumberFilter ||
      reg.luckyNumbers.includes(parseInt(luckyNumberFilter, 10));

    const matchesPayment =
      paymentStatusFilter === 'all' || reg.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesRef && matchesNumber && matchesPayment;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerify = async (
    id: string,
    newStatus: PaymentStatus,
    options?: VerifyOptions
  ) => {
    const updated = await verifyPayment(id, newStatus, options);
    if (updated) {
      onPaymentStatusChanged(updated);
    }
  };

  const handleBatchConfirm = async (status: PaymentStatus) => {
    if (selectedIds.length === 0) return;
    setIsBatchActionInProgress(true);
    try {
      const updatedList = await batchVerifyPayments(selectedIds, status, {
        verifiedBy: telebirrConfig.accountName || 'Admin',
        adminNote: `Batch ${status} by Admin on ${new Date().toLocaleDateString()}`
      });
      updatedList.forEach((item) => onPaymentStatusChanged(item));
      setSelectedIds([]);
    } finally {
      setIsBatchActionInProgress(false);
    }
  };

  const handleStartReviewPending = () => {
    const firstPending = registrations.find((r) => r.paymentStatus === 'pending_verification');
    if (firstPending) {
      setReviewingReg(firstPending);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'Ticket Number',
      'Name',
      'Phone',
      'Lucky Numbers',
      'Payment Status',
      'Admin Verified By',
      'Verified At',
      'Admin Note',
      'Rejection Reason',
      'Amount (ETB)',
      'Telebirr Tx Code',
      'Referral Link',
      'Registered At',
      'Participant Note'
    ];
    const rows = registrations.map((r) => [
      `"${r.ticketNumber}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.luckyNumbers.join(' - ')}"`,
      `"${r.paymentStatus}"`,
      `"${r.verifiedBy || ''}"`,
      `"${r.verifiedAt ? new Date(r.verifiedAt).toLocaleString() : ''}"`,
      `"${(r.adminNote || '').replace(/"/g, '""')}"`,
      `"${(r.rejectionReason || '').replace(/"/g, '""')}"`,
      `"${r.paymentAmount || 50}"`,
      `"${r.telebirrTxCode || ''}"`,
      `"${r.refCode}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`,
      `"${(r.customNote || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lucky_telebirr_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-900">{registrations.length} Total Registrations</span>
            <span aria-hidden="true">·</span>
            <span>Admin Confirmation Portal</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Registered Participants & Telebirr Verification</h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Inspect registrations, verify Telebirr payment codes or uploaded screenshot receipts, confirm eligible tickets for the draw, or reject invalid payments.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenTelebirrSettings}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            title="Configure Telebirr receiver account and ticket fee"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Telebirr Settings</span>
          </button>

          {onOpenLotteryRules && (
            <button
              type="button"
              onClick={onOpenLotteryRules}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              title="Configure Prize Tiers, Draw Schedule & Rules"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Rules & Prizes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLuckyDraw}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Dices className="w-4 h-4" />
            <span>Launch Lucky Draw</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={registrations.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Action Attention Banner for Pending Confirmations */}
      {totalPending > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>{totalPending} Registrations Awaiting Admin Confirmation</span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full font-mono text-[10px] font-bold">
                  Action Required
                </span>
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Participants have submitted Telebirr transaction codes or receipts. Confirm them so their lucky numbers enter the live draw.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStartReviewPending}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review Pending Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Telebirr Financial & Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 block uppercase">Total Verified Revenue</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-neutral-900 font-mono tabular-nums">{totalRevenueETB}</span>
            <span className="text-xs font-bold text-[#0072bc]">ETB</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">From admin-confirmed tickets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 block uppercase">Confirmed by Admin</span>
          <div className="mt-1 flex items-baseline gap-1 text-emerald-700">
            <span className="text-xl font-black font-mono tabular-nums">{totalVerified}</span>
            <span className="text-xs font-semibold">Tickets</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono mt-0.5 block">Eligible for Lucky Draw</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 block uppercase">Pending Review</span>
          <div className="mt-1 flex items-baseline gap-1 text-amber-700">
            <span className="text-xl font-black font-mono tabular-nums">{totalPending}</span>
            <span className="text-xs font-semibold">Tickets</span>
          </div>
          <span className="text-[10px] text-amber-600 font-mono mt-0.5 block">Waiting for approval</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 block uppercase">Telebirr Account</span>
          <div className="mt-1 font-mono font-bold text-xs text-neutral-900 truncate">
            {telebirrConfig.accountNumber}
          </div>
          <span className="text-[10px] text-neutral-500 truncate block">
            {telebirrConfig.accountName} ({telebirrConfig.feePerTicket} ETB)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, phone, ticket #, Tx code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-md focus:ring-1 focus:ring-neutral-950 focus:outline-hidden"
            />
          </div>

          {/* Filter by Link */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500 font-medium">Link:</span>
            <select
              value={selectedRefFilter}
              onChange={(e) => setSelectedRefFilter(e.target.value)}
              className="p-2 border border-neutral-200 rounded-md bg-white text-xs font-medium"
            >
              <option value="all">All Referral Links</option>
              {links.map((link) => (
                <option key={link.id} value={link.code}>
                  {link.title} ({link.code})
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Lucky Number */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Number:</span>
            <input
              type="number"
              placeholder="e.g. 7"
              value={luckyNumberFilter}
              onChange={(e) => setLuckyNumberFilter(e.target.value)}
              className="w-20 p-2 border border-neutral-200 rounded-md text-xs font-mono"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-neutral-100 pt-3 flex-wrap text-xs">
          <span className="text-neutral-400 font-medium text-[11px] uppercase tracking-wider mr-1">
            Status Filter:
          </span>
          <button
            type="button"
            onClick={() => setPaymentStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              paymentStatusFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            All ({registrations.length})
          </button>
          <button
            type="button"
            onClick={() => setPaymentStatusFilter('pending_verification')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              paymentStatusFilter === 'pending_verification'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Admin Review ({totalPending})</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentStatusFilter('verified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              paymentStatusFilter === 'verified'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirmed ({totalVerified})</span>
          </button>
          {totalRejected > 0 && (
            <button
              type="button"
              onClick={() => setPaymentStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                paymentStatusFilter === 'rejected'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rejected ({totalRejected})</span>
            </button>
          )}
          {totalUnpaid > 0 && (
            <button
              type="button"
              onClick={() => setPaymentStatusFilter('unpaid')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                paymentStatusFilter === 'unpaid'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              Unpaid ({totalUnpaid})
            </button>
          )}
        </div>
      </div>

      {/* Floating Batch Admin Action Bar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-neutral-900 text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-neutral-800 px-2.5 py-1 rounded-md text-amber-400">
              {selectedIds.length} Tickets Selected
            </span>
            <span className="text-xs text-neutral-300 hidden sm:inline">
              Apply bulk admin decision to selected registrations:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBatchActionInProgress}
              onClick={() => handleBatchConfirm('verified')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve & Confirm Selected</span>
            </button>
            <button
              type="button"
              disabled={isBatchActionInProgress}
              onClick={() => handleBatchConfirm('rejected')}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reject Selected</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-neutral-400 hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Registrations Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-neutral-400" />
            <h4 className="text-base font-bold text-neutral-900">No Registrations Found</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No participants match the selected filters. Invite participants to register or change the filter parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-8">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="cursor-pointer text-neutral-500 hover:text-neutral-900"
                      title="Select / Deselect all"
                    >
                      {selectedIds.length === filtered.length && filtered.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-neutral-900" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Ticket & Participant</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Lucky Numbers</th>
                  <th className="py-3 px-4">Admin Confirmation & Telebirr</th>
                  <th className="py-3 px-4">Host Link</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((reg) => {
                  const isSelected = selectedIds.includes(reg.id);
                  return (
                    <tr
                      key={reg.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(reg.id)}
                          className="cursor-pointer text-neutral-400 hover:text-neutral-900"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-neutral-900" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Ticket & Participant */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-neutral-900 text-xs tracking-wider block">
                            {reg.ticketNumber}
                          </span>
                          <span className="font-semibold text-neutral-800 text-xs block">
                            {reg.name}
                          </span>
                          {reg.customNote && (
                            <span className="text-[10px] text-neutral-500 block truncate max-w-[180px] italic">
                              "{reg.customNote}"
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono text-neutral-700 whitespace-nowrap">
                        {reg.phone}
                      </td>

                      {/* Lucky Numbers Balls */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {reg.luckyNumbers.map((num) => (
                            <span
                              key={num}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-mono ${
                                luckyNumberFilter && Number(luckyNumberFilter) === num
                                  ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-300'
                                  : 'bg-neutral-900 text-white'
                              }`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Telebirr Payment Confirmation */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {reg.paymentStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Confirmed ({reg.paymentAmount || 50} ETB)</span>
                              </span>
                            ) : reg.paymentStatus === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-mono">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>Rejected</span>
                              </span>
                            ) : reg.paymentStatus === 'pending_verification' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                <span>Pending Admin Review</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full font-mono">
                                Unpaid
                              </span>
                            )}

                            {/* Review & Confirm Button */}
                            <button
                              type="button"
                              onClick={() => setReviewingReg(reg)}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-[10px] rounded-md cursor-pointer transition-colors flex items-center gap-1"
                              title="Open full admin confirmation modal with receipt inspect & verification"
                            >
                              <ShieldCheck className="w-3 h-3 text-amber-400" />
                              <span>Review & Confirm</span>
                            </button>
                          </div>

                          {/* Transaction Code & Screenshot Button */}
                          <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
                            {reg.telebirrTxCode && (
                              <span className="font-bold text-sky-800 select-all" title="Telebirr SMS Code">
                                Tx: {reg.telebirrTxCode}
                              </span>
                            )}

                            {reg.screenshotUrl && (
                              <button
                                type="button"
                                onClick={() => setReviewingReg(reg)}
                                className="flex items-center gap-1 text-emerald-700 hover:underline cursor-pointer font-sans"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Receipt</span>
                              </button>
                            )}

                            {reg.rejectionReason && (
                              <span className="text-rose-600 font-sans text-[10px] italic">
                                ({reg.rejectionReason})
                              </span>
                            )}

                            {reg.verifiedBy && reg.paymentStatus === 'verified' && (
                              <span className="text-neutral-400 text-[10px]">
                                by {reg.verifiedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Link */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                          {reg.refCode}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(reg.registeredAt).toLocaleDateString()} {new Date(reg.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setReviewingReg(reg)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                            title="Inspect details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRegistration(reg.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete registration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Confirmation Modal */}
      {reviewingReg && (
        <AdminConfirmationModal
          registration={reviewingReg}
          isOpen={Boolean(reviewingReg)}
          onClose={() => setReviewingReg(null)}
          telebirrConfig={telebirrConfig}
          allRegistrations={registrations}
          onSelectRegistration={(nextReg) => setReviewingReg(nextReg)}
          onConfirmStatus={async (id, status, options) => {
            await handleVerify(id, status, options);
          }}
        />
      )}
    </div>
  );
};
