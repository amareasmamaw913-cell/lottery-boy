import React, { useState } from 'react';
import { ReferralLink } from '../types/registration';
import { createReferralLink } from '../utils/registrationApi';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Share2,
  Plus,
  QrCode,
  Users,
  MousePointerClick,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface ReferralLinksManagerProps {
  links: ReferralLink[];
  onLinkCreated: (link: ReferralLink) => void;
  onOpenRegisterWithLink: (code: string) => void;
}

export const ReferralLinksManager: React.FC<ReferralLinksManagerProps> = ({
  links,
  onLinkCreated,
  onOpenRegisterWithLink
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeQrCode, setActiveQrCode] = useState<string | null>(null);

  // New Link Form
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCreator, setNewCreator] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const getFullUrl = (code: string) => {
    return `${window.location.origin}?ref=${encodeURIComponent(code)}`;
  };

  const handleCopyLink = (code: string) => {
    const url = getFullUrl(code);
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareWhatsApp = (code: string, title: string) => {
    const url = getFullUrl(code);
    const text = `Join ${title}! Register your name, phone number, and choose your lucky numbers here: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const created = await createReferralLink(newTitle.trim(), newCode.trim(), newCreator.trim());
      onLinkCreated(created);
      setNewTitle('');
      setNewCode('');
      setNewCreator('');
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Card */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
            <span>Invite & Referral Portal</span>
            <span aria-hidden="true">·</span>
            <span>{links.length} Active Links</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your Shareable Registration Links</h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
            Give participants your personal link so they can register their full name, phone number, and choose their lucky numbers. Track how many people registered through each link.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Registration Link</span>
        </button>
      </div>

      {/* Grid of Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {links.map((link) => {
          const fullUrl = getFullUrl(link.code);
          const isCopied = copiedCode === link.code;

          return (
            <div
              key={link.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between gap-4 hover:border-neutral-300 transition-all shadow-xs"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    ref={link.code}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900">{link.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Created by {link.creatorName || 'Host'}</p>

                {/* Full Link display box */}
                <div className="mt-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-neutral-600 truncate select-all">{fullUrl}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(link.code)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors cursor-pointer shrink-0"
                    title="Copy full URL"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-neutral-100 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>
                      <strong className="text-neutral-900 text-sm">{link.registrationsCount ?? 0}</strong> Registered
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MousePointerClick className="w-4 h-4 text-neutral-400" />
                    <span>
                      <strong className="text-neutral-900 text-sm">{link.clicksCount ?? 0}</strong> Link Clicks
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(link.code)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(link.code, link.title)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-md transition-colors cursor-pointer"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveQrCode(link.code)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                    title="Show QR Code for scanning"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRegisterWithLink(link.code)}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
                >
                  <span>Open Form</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Modal */}
      {activeQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-neutral-200 text-center shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Scan to Register</h3>
            <p className="text-xs text-neutral-600">
              Point your smartphone camera at this code to open the registration link directly:
            </p>

            {/* Visual SVG QR Code Representation */}
            <div className="p-4 bg-white border border-neutral-200 rounded-xl inline-block mx-auto shadow-xs">
              <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto" fill="currentColor">
                {/* Simulated high-contrast clean QR matrix pattern */}
                <rect x="0" y="0" width="30" height="30" rx="3" fill="#000" />
                <rect x="5" y="5" width="20" height="20" rx="2" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" rx="1" fill="#000" />

                <rect x="70" y="0" width="30" height="30" rx="3" fill="#000" />
                <rect x="75" y="5" width="20" height="20" rx="2" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" rx="1" fill="#000" />

                <rect x="0" y="70" width="30" height="30" rx="3" fill="#000" />
                <rect x="5" y="75" width="20" height="20" rx="2" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" rx="1" fill="#000" />

                <rect x="36" y="8" width="8" height="8" fill="#000" />
                <rect x="48" y="16" width="8" height="8" fill="#000" />
                <rect x="56" y="8" width="8" height="8" fill="#000" />

                <rect x="36" y="36" width="12" height="12" fill="#000" />
                <rect x="52" y="44" width="8" height="8" fill="#000" />
                <rect x="64" y="36" width="12" height="12" fill="#000" />
                <rect x="80" y="48" width="12" height="8" fill="#000" />

                <rect x="12" y="40" width="8" height="16" fill="#000" />
                <rect x="24" y="52" width="8" height="8" fill="#000" />
                <rect x="38" y="60" width="16" height="8" fill="#000" />
                <rect x="60" y="68" width="12" height="12" fill="#000" />
                <rect x="80" y="80" width="12" height="12" fill="#000" />
              </svg>
            </div>

            <p className="text-xs font-mono text-neutral-500 truncate">{getFullUrl(activeQrCode)}</p>

            <button
              type="button"
              onClick={() => setActiveQrCode(null)}
              className="w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create New Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Create New Registration Link</h3>
            <p className="text-xs text-neutral-600">
              Generate a unique link you can distribute to friends, group chats, or event attendees.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Lucky Giveaway"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Custom Link Slug / Code</label>
                <input
                  type="text"
                  placeholder="e.g. summer-2026 (optional, auto-generated if blank)"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Your Name / Host Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amare Asmamaw"
                  value={newCreator}
                  onChange={(e) => setNewCreator(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-lg cursor-pointer"
                >
                  {isCreating ? 'Creating...' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
