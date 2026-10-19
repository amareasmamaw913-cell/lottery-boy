import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const registrationsFile = path.resolve(dataDir, 'registrations.json');
const linksFile = path.resolve(dataDir, 'links.json');
const telebirrConfigFile = path.resolve(dataDir, 'telebirr_config.json');

// Initial seed data if files do not exist
if (!fs.existsSync(telebirrConfigFile)) {
  const initialTelebirrConfig = {
    accountNumber: '0911234567',
    accountName: 'Amare Asmamaw',
    feePerTicket: 50,
    instructions: '1. Open Telebirr App or dial *127#\n2. Transfer 50 ETB to 0911234567 (Amare Asmamaw)\n3. Enter your Telebirr SMS transaction code or upload screenshot below to confirm your ticket.',
    isActive: true
  };
  fs.writeFileSync(telebirrConfigFile, JSON.stringify(initialTelebirrConfig, null, 2));
}

if (!fs.existsSync(registrationsFile)) {
  const initialRegistrations = [
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
  fs.writeFileSync(registrationsFile, JSON.stringify(initialRegistrations, null, 2));
}

if (!fs.existsSync(linksFile)) {
  const initialLinks = [
    {
      id: 'link_1',
      code: 'amare-vip',
      title: 'Amare VIP Registration Link',
      creatorName: 'Amare Asmamaw',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      clicksCount: 24
    },
    {
      id: 'link_2',
      code: 'lucky-raffle',
      title: 'Public Lucky Draw Link',
      creatorName: 'Event Team',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      clicksCount: 58
    }
  ];
  fs.writeFileSync(linksFile, JSON.stringify(initialLinks, null, 2));
}

function readRegistrations() {
  try {
    const raw = fs.readFileSync(registrationsFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeRegistrations(data: any[]) {
  fs.writeFileSync(registrationsFile, JSON.stringify(data, null, 2));
}

function readLinks() {
  try {
    const raw = fs.readFileSync(linksFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLinks(data: any[]) {
  fs.writeFileSync(linksFile, JSON.stringify(data, null, 2));
}

function readTelebirrConfig() {
  try {
    const raw = fs.readFileSync(telebirrConfigFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return {
      accountNumber: '0911234567',
      accountName: 'Amare Asmamaw',
      feePerTicket: 50,
      instructions: '1. Transfer 50 ETB via Telebirr to 0911234567\n2. Enter code or upload screenshot.',
      isActive: true
    };
  }
}

function writeTelebirrConfig(data: any) {
  fs.writeFileSync(telebirrConfigFile, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set body parser with generous limit for screenshot image upload (base64)
  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.get('/api/telebirr-config', (req, res) => {
    return res.json(readTelebirrConfig());
  });

  app.post('/api/telebirr-config', (req, res) => {
    const current = readTelebirrConfig();
    const updated = {
      ...current,
      ...req.body
    };
    writeTelebirrConfig(updated);
    return res.json(updated);
  });

  app.get('/api/registrations', (req, res) => {
    const registrations = readRegistrations();
    const ref = req.query.ref as string;
    if (ref) {
      const filtered = registrations.filter((r: any) => r.refCode?.toLowerCase() === ref.toLowerCase());
      return res.json(filtered);
    }
    return res.json(registrations);
  });

  app.post('/api/registrations', (req, res) => {
    const {
      name,
      phone,
      countryCode,
      luckyNumbers,
      refCode,
      refName,
      customNote,
      paymentMethod,
      paymentAmount,
      telebirrTxCode,
      screenshotUrl
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!Array.isArray(luckyNumbers) || luckyNumbers.length === 0) {
      return res.status(400).json({ error: 'Please choose at least 1 lucky number' });
    }

    // Filter valid positive integer numbers
    const validNumbers = luckyNumbers
      .map((n) => Number(n))
      .filter((n) => !isNaN(n) && n > 0 && n <= 9999);

    if (validNumbers.length === 0) {
      return res.status(400).json({ error: 'Invalid lucky numbers chosen' });
    }

    const uniqueNumbers = Array.from(new Set(validNumbers));

    // Determine payment status
    let status: 'verified' | 'pending_verification' | 'unpaid' = 'pending_verification';
    if (!telebirrTxCode && !screenshotUrl && paymentMethod === 'telebirr') {
      status = 'unpaid';
    } else if (telebirrTxCode || screenshotUrl) {
      status = 'pending_verification';
    }

    // Generate random 5-digit ticket number
    const randomTicket = Math.floor(10000 + Math.random() * 90000);
    const newRegistration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber: `LUCK-${randomTicket}`,
      name: name.trim(),
      phone: phone.trim(),
      countryCode: countryCode || '+1',
      luckyNumbers: uniqueNumbers,
      refCode: (refCode || 'default').trim(),
      refName: (refName || 'Direct Registration').trim(),
      registeredAt: new Date().toISOString(),
      customNote: (customNote || '').trim(),
      paymentMethod: paymentMethod || 'telebirr',
      paymentAmount: Number(paymentAmount) || 50,
      paymentStatus: status,
      telebirrTxCode: (telebirrTxCode || '').trim() || undefined,
      screenshotUrl: screenshotUrl || undefined
    };

    const registrations = readRegistrations();
    registrations.unshift(newRegistration);
    writeRegistrations(registrations);

    return res.status(201).json(newRegistration);
  });

  // Admin Verify Telebirr payment endpoint
  app.patch('/api/registrations/:id/verify-payment', (req, res) => {
    const { id } = req.params;
    const { status, adminNote, rejectionReason, verifiedBy } = req.body;
    const registrations = readRegistrations();
    const item = registrations.find((r: any) => r.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    item.paymentStatus = status || 'verified';
    if (status === 'verified') {
      item.verifiedAt = new Date().toISOString();
      item.verifiedBy = (verifiedBy || 'Admin').trim();
      delete item.rejectionReason;
    } else if (status === 'rejected') {
      delete item.verifiedAt;
      item.rejectionReason = (rejectionReason || 'Payment could not be confirmed').trim();
    } else {
      delete item.verifiedAt;
      delete item.rejectionReason;
    }

    if (adminNote !== undefined) {
      item.adminNote = (adminNote || '').trim() || undefined;
    }

    writeRegistrations(registrations);
    return res.json(item);
  });

  // Batch admin verification endpoint
  app.post('/api/registrations/batch-verify', (req, res) => {
    const { ids, status, verifiedBy, adminNote, rejectionReason } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array required' });
    }

    const registrations = readRegistrations();
    const updatedItems: any[] = [];

    registrations.forEach((item: any) => {
      if (ids.includes(item.id)) {
        item.paymentStatus = status || 'verified';
        if (status === 'verified') {
          item.verifiedAt = new Date().toISOString();
          item.verifiedBy = (verifiedBy || 'Admin').trim();
          delete item.rejectionReason;
        } else if (status === 'rejected') {
          delete item.verifiedAt;
          item.rejectionReason = (rejectionReason || 'Batch rejected by admin').trim();
        } else {
          delete item.verifiedAt;
          delete item.rejectionReason;
        }
        if (adminNote) item.adminNote = adminNote.trim();
        updatedItems.push(item);
      }
    });

    writeRegistrations(registrations);
    return res.json({ success: true, count: updatedItems.length, updated: updatedItems });
  });

  app.delete('/api/registrations/:id', (req, res) => {
    const { id } = req.params;
    let registrations = readRegistrations();
    const initialLen = registrations.length;
    registrations = registrations.filter((r: any) => r.id !== id);
    writeRegistrations(registrations);

    return res.json({ success: true, deleted: registrations.length < initialLen });
  });

  app.get('/api/links', (req, res) => {
    const links = readLinks();
    const registrations = readRegistrations();

    // Attach real-time count of registrations to each link
    const enriched = links.map((link: any) => {
      const regCount = registrations.filter((r: any) => r.refCode?.toLowerCase() === link.code.toLowerCase()).length;
      return {
        ...link,
        registrationsCount: regCount
      };
    });

    return res.json(enriched);
  });

  app.post('/api/links', (req, res) => {
    const { title, code, creatorName } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Link title is required' });
    }

    const cleanCode = (code || title)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `link-${Date.now().toString(36)}`;

    const links = readLinks();
    let finalCode = cleanCode;
    let counter = 1;
    while (links.some((l: any) => l.code === finalCode)) {
      finalCode = `${cleanCode}-${counter++}`;
    }

    const newLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code: finalCode,
      title: title.trim(),
      creatorName: (creatorName || 'Anonymous Host').trim(),
      createdAt: new Date().toISOString(),
      clicksCount: 0
    };

    links.unshift(newLink);
    writeLinks(links);

    return res.status(201).json({ ...newLink, registrationsCount: 0 });
  });

  app.post('/api/links/:code/click', (req, res) => {
    const { code } = req.params;
    const links = readLinks();
    const link = links.find((l: any) => l.code.toLowerCase() === code.toLowerCase());
    if (link) {
      link.clicksCount = (link.clicksCount || 0) + 1;
      writeLinks(links);
    }
    return res.json({ success: true });
  });

  // Mount Vite or serve static files
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
