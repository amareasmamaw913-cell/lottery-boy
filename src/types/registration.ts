export type PaymentStatus = 'pending_verification' | 'verified' | 'unpaid' | 'rejected';

export interface Registration {
  id: string;
  ticketNumber: string;
  name: string;
  phone: string;
  countryCode: string;
  luckyNumbers: number[];
  refCode: string;
  refName?: string;
  registeredAt: string;
  customNote?: string;
  // Telebirr Payment & Admin Confirmation Fields
  paymentMethod: 'telebirr' | 'cash' | 'free';
  paymentAmount: number; // in ETB
  paymentStatus: PaymentStatus;
  telebirrTxCode?: string; // Telebirr transaction code from SMS/App
  screenshotUrl?: string; // base64 or image url
  verifiedAt?: string;
  verifiedBy?: string; // Admin / Organizer name who confirmed
  adminNote?: string; // Verification note or audit remarks
  rejectionReason?: string; // Reason if payment was rejected/needs re-submission
}

export interface ReferralLink {
  id: string;
  code: string;
  title: string;
  creatorName: string;
  createdAt: string;
  clicksCount: number;
  registrationsCount?: number;
}

export interface TelebirrConfig {
  accountNumber: string;
  accountName: string;
  feePerTicket: number; // in ETB
  instructions: string;
  isActive: boolean;
}
