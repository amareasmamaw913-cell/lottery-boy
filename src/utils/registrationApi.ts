import { Registration, ReferralLink, TelebirrConfig, PaymentStatus } from '../types/registration';

const STORAGE_KEY_REGISTRATIONS = 'stickscene_registrations_v2';
const STORAGE_KEY_LINKS = 'stickscene_referral_links_v2';
const STORAGE_KEY_TELEBIRR = 'stickscene_telebirr_config_v2';

const DEFAULT_TELEBIRR: TelebirrConfig = {
  accountNumber: '0911234567',
  accountName: 'Amare Asmamaw',
  feePerTicket: 50,
  instructions: '1. Open Telebirr App or dial *127#\n2. Transfer 50 ETB to 0911234567 (Amare Asmamaw)\n3. Enter your Telebirr SMS transaction code or upload screenshot below to confirm your ticket.',
  isActive: true
};

function getLocalRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [
    {
      id: 'reg_1001',
      ticketNumber: 'LUCK-82914',
      name: 'Amare Asmamaw',
      phone: '+251 91 123 4567',
      countryCode: '+251',
      luckyNumbers: [7, 21, 77],
      refCode: 'amare-vip',
      refName: 'Amare VIP Link',
      registeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      customNote: 'My birthday & lucky 77',
      paymentMethod: 'telebirr',
      paymentAmount: 50,
      paymentStatus: 'verified',
      telebirrTxCode: 'TB91827401',
      verifiedAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
    },
    {
      id: 'reg_1002',
      ticketNumber: 'LUCK-39102',
      name: 'Selamawit Tadesse',
      phone: '+251 92 884 9210',
      countryCode: '+251',
      luckyNumbers: [3, 9, 14, 27],
      refCode: 'amare-vip',
      refName: 'Amare VIP Link',
      registeredAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      customNote: 'Family lucky draw',
      paymentMethod: 'telebirr',
      paymentAmount: 50,
      paymentStatus: 'pending_verification',
      telebirrTxCode: 'TB88391042'
    },
    {
      id: 'reg_1003',
      ticketNumber: 'LUCK-44921',
      name: 'Daniel Johnson',
      phone: '+1 415 555 0192',
      countryCode: '+1',
      luckyNumbers: [11, 23, 45, 88],
      refCode: 'lucky-raffle',
      refName: 'Official Raffle 2026',
      registeredAt: new Date(Date.now() - 3600000 * 9).toISOString(),
      customNote: 'Good luck to all!',
      paymentMethod: 'telebirr',
      paymentAmount: 50,
      paymentStatus: 'verified',
      telebirrTxCode: 'FT24019284',
      verifiedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ];
}

function saveLocalRegistrations(data: Registration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

function getLocalLinks(): ReferralLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LINKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [
    {
      id: 'link_1',
      code: 'amare-vip',
      title: 'Amare VIP Registration Link',
      creatorName: 'Amare Asmamaw',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      clicksCount: 24,
      registrationsCount: 2
    },
    {
      id: 'link_2',
      code: 'lucky-raffle',
      title: 'Public Lucky Draw Link',
      creatorName: 'Event Team',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      clicksCount: 58,
      registrationsCount: 1
    }
  ];
}

function saveLocalLinks(data: ReferralLink[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export function getLocalTelebirrConfig(): TelebirrConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEBIRR);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return DEFAULT_TELEBIRR;
}

export function saveLocalTelebirrConfig(config: TelebirrConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_TELEBIRR, JSON.stringify(config));
  } catch (e) {
    // ignore
  }
}

export async function fetchTelebirrConfig(): Promise<TelebirrConfig> {
  try {
    const res = await fetch('/api/telebirr-config');
    if (res.ok) {
      const data = await res.json();
      saveLocalTelebirrConfig(data);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  return getLocalTelebirrConfig();
}

export async function updateTelebirrConfig(config: Partial<TelebirrConfig>): Promise<TelebirrConfig> {
  try {
    const res = await fetch('/api/telebirr-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) {
      const data = await res.json();
      saveLocalTelebirrConfig(data);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  const current = getLocalTelebirrConfig();
  const updated = { ...current, ...config };
  saveLocalTelebirrConfig(updated);
  return updated;
}

export async function fetchRegistrations(refCode?: string): Promise<Registration[]> {
  try {
    const url = refCode ? `/api/registrations?ref=${encodeURIComponent(refCode)}` : '/api/registrations';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      saveLocalRegistrations(data);
      return data;
    }
  } catch (err) {
    // Fallback to localStorage
  }

  const local = getLocalRegistrations();
  if (refCode) {
    return local.filter((r) => r.refCode.toLowerCase() === refCode.toLowerCase());
  }
  return local;
}

export async function submitRegistration(payload: {
  name: string;
  phone: string;
  countryCode: string;
  luckyNumbers: number[];
  refCode: string;
  refName?: string;
  customNote?: string;
  paymentMethod: 'telebirr' | 'cash' | 'free';
  paymentAmount: number;
  telebirrTxCode?: string;
  screenshotUrl?: string;
}): Promise<Registration> {
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const created = await res.json();
      const current = getLocalRegistrations();
      saveLocalRegistrations([created, ...current.filter((c) => c.id !== created.id)]);
      return created;
    }
  } catch (err) {
    // Fallback locally
  }

  const randomTicket = Math.floor(10000 + Math.random() * 90000);
  const fallback: Registration = {
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ticketNumber: `LUCK-${randomTicket}`,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    countryCode: payload.countryCode || '+251',
    luckyNumbers: Array.from(new Set(payload.luckyNumbers)),
    refCode: payload.refCode || 'direct',
    refName: payload.refName || 'Direct Registration',
    registeredAt: new Date().toISOString(),
    customNote: payload.customNote?.trim(),
    paymentMethod: payload.paymentMethod || 'telebirr',
    paymentAmount: payload.paymentAmount || 50,
    paymentStatus: payload.telebirrTxCode || payload.screenshotUrl ? 'pending_verification' : 'unpaid',
    telebirrTxCode: payload.telebirrTxCode?.trim(),
    screenshotUrl: payload.screenshotUrl
  };

  const current = getLocalRegistrations();
  saveLocalRegistrations([fallback, ...current]);
  return fallback;
}

export interface VerifyOptions {
  adminNote?: string;
  rejectionReason?: string;
  verifiedBy?: string;
}

export async function verifyPayment(
  id: string,
  status: PaymentStatus,
  options?: VerifyOptions
): Promise<Registration | null> {
  try {
    const res = await fetch(`/api/registrations/${id}/verify-payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        adminNote: options?.adminNote,
        rejectionReason: options?.rejectionReason,
        verifiedBy: options?.verifiedBy
      })
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalRegistrations();
      saveLocalRegistrations(current.map((c) => (c.id === id ? updated : c)));
      return updated;
    }
  } catch (err) {
    // Fallback
  }

  const current = getLocalRegistrations();
  const target = current.find((c) => c.id === id);
  if (target) {
    target.paymentStatus = status;
    if (status === 'verified') {
      target.verifiedAt = new Date().toISOString();
      target.verifiedBy = options?.verifiedBy || 'Admin';
      delete target.rejectionReason;
    } else if (status === 'rejected') {
      delete target.verifiedAt;
      target.rejectionReason = options?.rejectionReason || 'Payment rejected by admin';
    } else {
      delete target.verifiedAt;
      delete target.rejectionReason;
    }
    if (options?.adminNote !== undefined) {
      target.adminNote = options.adminNote;
    }
    saveLocalRegistrations([...current]);
    return target;
  }
  return null;
}

export async function batchVerifyPayments(
  ids: string[],
  status: PaymentStatus,
  options?: VerifyOptions
): Promise<Registration[]> {
  try {
    const res = await fetch('/api/registrations/batch-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids,
        status,
        verifiedBy: options?.verifiedBy,
        adminNote: options?.adminNote,
        rejectionReason: options?.rejectionReason
      })
    });
    if (res.ok) {
      const data = await res.json();
      const current = getLocalRegistrations();
      const updatedMap = new Map<string, Registration>(data.updated.map((u: Registration) => [u.id, u]));
      const nextList = current.map((c) => (updatedMap.has(c.id) ? updatedMap.get(c.id)! : c));
      saveLocalRegistrations(nextList);
      return data.updated;
    }
  } catch (err) {
    // Fallback
  }

  const current = getLocalRegistrations();
  const updatedList: Registration[] = [];
  const nextList = current.map((item) => {
    if (ids.includes(item.id)) {
      item.paymentStatus = status;
      if (status === 'verified') {
        item.verifiedAt = new Date().toISOString();
        item.verifiedBy = options?.verifiedBy || 'Admin';
        delete item.rejectionReason;
      } else if (status === 'rejected') {
        delete item.verifiedAt;
        item.rejectionReason = options?.rejectionReason || 'Batch rejected by admin';
      } else {
        delete item.verifiedAt;
        delete item.rejectionReason;
      }
      if (options?.adminNote) item.adminNote = options.adminNote;
      updatedList.push(item);
    }
    return item;
  });

  saveLocalRegistrations(nextList);
  return updatedList;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalRegistrations();
      saveLocalRegistrations(current.filter((c) => c.id !== id));
      return true;
    }
  } catch (err) {
    // Fallback
  }

  const current = getLocalRegistrations();
  saveLocalRegistrations(current.filter((c) => c.id !== id));
  return true;
}

export async function fetchReferralLinks(): Promise<ReferralLink[]> {
  try {
    const res = await fetch('/api/links');
    if (res.ok) {
      const data = await res.json();
      saveLocalLinks(data);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  return getLocalLinks();
}

export async function createReferralLink(
  title: string,
  code: string,
  creatorName: string
): Promise<ReferralLink> {
  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, code, creatorName })
    });
    if (res.ok) {
      const created = await res.json();
      const current = getLocalLinks();
      saveLocalLinks([created, ...current]);
      return created;
    }
  } catch (err) {
    // Fallback
  }

  const cleanCode = (code || title)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || `link-${Date.now().toString(36)}`;

  const fallback: ReferralLink = {
    id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    code: cleanCode,
    title: title.trim(),
    creatorName: (creatorName || 'Anonymous Host').trim(),
    createdAt: new Date().toISOString(),
    clicksCount: 0
  };

  const current = getLocalLinks();
  saveLocalLinks([fallback, ...current]);
  return fallback;
}

export async function trackLinkClick(code: string): Promise<void> {
  try {
    await fetch(`/api/links/${encodeURIComponent(code)}/click`, { method: 'POST' });
  } catch (e) {
    // ignore
  }
}
