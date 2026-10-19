import React, { useState, useEffect } from 'react';
import { Scene, RenderStyleConfig, StoryPack } from './types/storyboard';
import { STORY_PACKS } from './data/storyPacks';
import { Registration, ReferralLink, TelebirrConfig } from './types/registration';
import {
  fetchRegistrations,
  fetchReferralLinks,
  fetchTelebirrConfig,
  deleteRegistration,
  trackLinkClick
} from './utils/registrationApi';
import { exportAllScenesZip } from './utils/zipExporter';
import { Header, AppTab } from './components/Header';
import { ThemeBar } from './components/ThemeBar';
import { StoryboardGrid } from './components/StoryboardGrid';
import { FlipbookPlayer } from './components/FlipbookPlayer';
import { PythonScriptModal } from './components/PythonScriptModal';
import { StoryPacksView } from './components/StoryPacksView';
import { SceneEditorModal } from './components/SceneEditorModal';
import { BulkPromptModal } from './components/BulkPromptModal';
import { RegistrationForm } from './components/RegistrationForm';
import { ReferralLinksManager } from './components/ReferralLinksManager';
import { RegistrationsList } from './components/RegistrationsList';
import { LuckyDrawModal } from './components/LuckyDrawModal';
import { TelebirrSettingsModal } from './components/TelebirrSettingsModal';
import { TermsAndLegalModal } from './components/TermsAndLegalModal';
import { LotterySettingsModal } from './components/LotterySettingsModal';
import { TicketLookup } from './components/TicketLookup';
import { LotterySettings, DEFAULT_LOTTERY_SETTINGS } from './types/lotteryRules';
import {
  Film,
  Play,
  Terminal,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Link as LinkIcon,
  Users
} from 'lucide-react';

function createInitialScenes(pack: StoryPack): Scene[] {
  return pack.scenes.map((s, idx) => ({
    ...s,
    id: `scene_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
    sceneNumber: idx + 1
  }));
}

export default function App() {
  // Navigation & URL detection
  const [activeTab, setActiveTab] = useState<AppTab>('register');
  const [initialRefCode, setInitialRefCode] = useState<string>('amare-vip');

  // Registrations & Referral Links State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [isTelebirrSettingsOpen, setIsTelebirrSettingsOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLotterySettingsOpen, setIsLotterySettingsOpen] = useState(false);
  const [lotterySettings, setLotterySettings] = useState<LotterySettings>(DEFAULT_LOTTERY_SETTINGS);
  const [telebirrConfig, setTelebirrConfig] = useState<TelebirrConfig>({
    accountNumber: '0911234567',
    accountName: 'Amare Asmamaw',
    feePerTicket: 50,
    instructions: '1. Transfer 50 ETB via Telebirr to 0911234567\n2. Enter code or upload screenshot.',
    isActive: true
  });

  // Storyboard Studio State
  const [currentPackId, setCurrentPackId] = useState<string>('morning_commute');
  const [scenes, setScenes] = useState<Scene[]>(() => createInitialScenes(STORY_PACKS[0]));
  const [storyboardSubTab, setStoryboardSubTab] = useState<'grid' | 'flipbook' | 'packs'>('grid');

  const [config, setConfig] = useState<RenderStyleConfig>({
    theme: 'lineart',
    bgColor: '#ffffff',
    strokeColor: '#111111',
    accentColor: '#000000',
    lineWidth: 5,
    aspectRatio: '16:9',
    showSceneWatermark: true,
    showBorder: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 30 });
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // On mount: check URL search params for ?ref=... or ?tab=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const tabParam = params.get('tab') as AppTab;

    if (refParam) {
      setInitialRefCode(refParam);
      setActiveTab('register');
      trackLinkClick(refParam);
    } else if (tabParam && ['register', 'links', 'roster', 'storyboard', 'python'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Load initial data
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [regs, lks, tbConfig] = await Promise.all([
        fetchRegistrations(),
        fetchReferralLinks(),
        fetchTelebirrConfig()
      ]);
      setRegistrations(regs);
      setLinks(lks);
      setTelebirrConfig(tbConfig);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePaymentStatusChanged = (updated: Registration) => {
    setRegistrations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    showToast(`Payment status updated to ${updated.paymentStatus}`);
  };

  // Registration Handlers
  const handleRegistrationSuccess = (reg: Registration) => {
    setRegistrations((prev) => [reg, ...prev.filter((r) => r.id !== reg.id)]);
    // update link count
    setLinks((prev) =>
      prev.map((l) =>
        l.code.toLowerCase() === reg.refCode.toLowerCase()
          ? { ...l, registrationsCount: (l.registrationsCount || 0) + 1 }
          : l
      )
    );
    showToast(`Registered successfully with ticket ${reg.ticketNumber}!`);
  };

  const handleDeleteRegistration = async (id: string) => {
    await deleteRegistration(id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    showToast('Registration removed');
  };

  const handleLinkCreated = (link: ReferralLink) => {
    setLinks((prev) => [link, ...prev.filter((l) => l.id !== link.id)]);
    showToast(`Created link: ${link.code}`);
  };

  const handleOpenRegisterWithLink = (code: string) => {
    setInitialRefCode(code);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Storyboard Handlers
  const handleExportZip = async () => {
    if (isExporting || scenes.length === 0) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: scenes.length });
    try {
      await exportAllScenesZip(scenes, config, (cur, tot) => {
        setExportProgress({ current: cur, total: tot });
      });
      showToast(`Exported ${scenes.length} scenes to stickman_storyboard_30_scenes.zip`);
    } catch (err) {
      console.error(err);
      showToast('Error exporting zip file');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdatePrompt = (sceneId: string, newPrompt: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, prompt: newPrompt } : s))
    );
    showToast('Prompt saved');
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;

    setScenes((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((item, idx) => ({ ...item, sceneNumber: idx + 1 }));
    });
  };

  const handleDuplicateScene = (scene: Scene) => {
    setScenes((prev) => {
      const index = prev.findIndex((s) => s.id === scene.id);
      const duplicate: Scene = {
        ...scene,
        id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: `${scene.title} (Copy)`,
        sceneNumber: scene.sceneNumber + 1
      };
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicate);
      return copy.map((item, idx) => ({ ...item, sceneNumber: idx + 1 }));
    });
    showToast('Scene duplicated');
  };

  const handleDeleteScene = (sceneId: string) => {
    if (scenes.length <= 1) {
      showToast('Storyboard must have at least 1 scene');
      return;
    }
    setScenes((prev) =>
      prev
        .filter((s) => s.id !== sceneId)
        .map((item, idx) => ({ ...item, sceneNumber: idx + 1 }))
    );
    showToast('Scene deleted');
  };

  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const newScene: Scene = {
      id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sceneNumber: newSceneNumber,
      title: `Scene ${newSceneNumber}`,
      prompt: `Minimalist stickman scene ${newSceneNumber}, line art, white background`,
      actionType: 'generic',
      customDetails: { expression: 'neutral', hasSpeedLines: false }
    };
    setScenes((prev) => [...prev, newScene]);
    showToast(`Added Scene ${newSceneNumber}`);
  };

  const handleResetScenes = () => {
    const defaultPack = STORY_PACKS[0];
    setCurrentPackId(defaultPack.id);
    setScenes(createInitialScenes(defaultPack));
    showToast('Reset to original 30 scenes');
  };

  const handleSelectPack = (pack: StoryPack) => {
    setCurrentPackId(pack.id);
    setScenes(createInitialScenes(pack));
    setStoryboardSubTab('grid');
    showToast(`Loaded "${pack.title}"`);
  };

  const handleImportPrompts = (newPrompts: string[]) => {
    const newScenes: Scene[] = newPrompts.map((p, idx) => ({
      id: `scene_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      sceneNumber: idx + 1,
      title: `Scene ${idx + 1}`,
      prompt: p,
      actionType: 'generic',
      customDetails: { expression: 'neutral', hasSpeedLines: true }
    }));
    setScenes(newScenes);
    setCurrentPackId('custom');
    showToast(`Imported ${newScenes.length} scenes`);
  };

  const handleBatchAppendSuffix = (suffix: string) => {
    setScenes((prev) =>
      prev.map((s) => {
        let p = s.prompt.trim();
        if (!p.endsWith(suffix.trim())) p = `${p}${suffix}`;
        return { ...s, prompt: p };
      })
    );
    showToast(`Appended suffix to all ${scenes.length} prompts`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Zone Clean Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportZip={handleExportZip}
        isExporting={isExporting}
        exportProgress={exportProgress}
        totalRegistrations={registrations.length}
      />

      {/* Sub-bar for Storyboard only */}
      {activeTab === 'storyboard' && (
        <ThemeBar
          config={config}
          onChangeConfig={setConfig}
          onOpenBulkModal={() => setIsBulkModalOpen(true)}
          onAddScene={handleAddScene}
          onResetScenes={handleResetScenes}
          sceneCount={scenes.length}
        />
      )}

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: REGISTER WITH LINK */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-2">
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                Public Registration Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
                Register Your Lucky Numbers
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5">
                Enter your name, phone number, and choose your favorite lucky numbers. Your registration will be securely linked to the host link.
              </p>
            </div>

            <RegistrationForm
              initialRefCode={initialRefCode}
              links={links}
              settings={lotterySettings}
              registrations={registrations}
              onRegistrationSuccess={handleRegistrationSuccess}
              onGoToLinks={() => setActiveTab('links')}
              onOpenTerms={() => setIsTermsOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: SHAREABLE LINKS HUB */}
        {activeTab === 'links' && (
          <ReferralLinksManager
            links={links}
            onLinkCreated={handleLinkCreated}
            onOpenRegisterWithLink={handleOpenRegisterWithLink}
          />
        )}

        {/* TAB 3: REGISTRATIONS ROSTER & DRAW */}
        {activeTab === 'roster' && (
          <RegistrationsList
            registrations={registrations}
            links={links}
            telebirrConfig={telebirrConfig}
            onDeleteRegistration={handleDeleteRegistration}
            onOpenLuckyDraw={() => setIsLuckyDrawOpen(true)}
            onOpenTelebirrSettings={() => setIsTelebirrSettingsOpen(true)}
            onOpenLotteryRules={() => setIsLotterySettingsOpen(true)}
            onPaymentStatusChanged={handlePaymentStatusChanged}
          />
        )}

        {/* TAB 4: TICKET LOOKUP & CONFIRMATION STATUS */}
        {activeTab === 'lookup' && (
          <TicketLookup
            registrations={registrations}
            settings={lotterySettings}
            auditHistory={[]}
            onGoToRegister={() => setActiveTab('register')}
          />
        )}

        {/* TAB 5: 30-SCENE STORYBOARD STUDIO */}
        {activeTab === 'storyboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1 font-mono">
                  <span>30-Scene Generator</span>
                  <span aria-hidden="true">·</span>
                  <span>16:9 Minimalist Stickman</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                  Minimalist Stickman Storyboard
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStoryboardSubTab('grid')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    storyboardSubTab === 'grid'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Grid View
                </button>
                <button
                  type="button"
                  onClick={() => setStoryboardSubTab('flipbook')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    storyboardSubTab === 'flipbook'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Flipbook Player</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStoryboardSubTab('packs')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    storyboardSubTab === 'packs'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Story Packs
                </button>
              </div>
            </div>

            {storyboardSubTab === 'grid' && (
              <StoryboardGrid
                scenes={scenes}
                config={config}
                onEditScene={(s) => setEditingScene(s)}
                onUpdatePrompt={handleUpdatePrompt}
                onMoveScene={handleMoveScene}
                onDuplicateScene={handleDuplicateScene}
                onDeleteScene={handleDeleteScene}
                onBatchAppendSuffix={handleBatchAppendSuffix}
              />
            )}

            {storyboardSubTab === 'flipbook' && (
              <FlipbookPlayer
                scenes={scenes}
                config={config}
                onEditScene={(s) => setEditingScene(s)}
              />
            )}

            {storyboardSubTab === 'packs' && (
              <StoryPacksView
                currentPackId={currentPackId}
                onSelectPack={handleSelectPack}
              />
            )}
          </div>
        )}

        {/* TAB 5: PYTHON SCRIPT GENERATOR */}
        {activeTab === 'python' && (
          <PythonScriptModal
            scenes={scenes}
            config={config}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span>StickScene Studio</span>
            <span aria-hidden="true">·</span>
            <span>Link Registration & Lucky Numbers</span>
            <span aria-hidden="true">·</span>
            <span>30-Scene Batch Pipeline</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-600">
            <span>{registrations.length} Registrations Stored</span>
            <span aria-hidden="true">·</span>
            <span>{links.length} Active Share Links</span>
          </div>
        </div>
      </footer>

      {/* Lucky Draw Modal */}
      <LuckyDrawModal
        isOpen={isLuckyDrawOpen}
        onClose={() => setIsLuckyDrawOpen(false)}
        registrations={registrations}
      />

      {/* Telebirr Settings Modal */}
      <TelebirrSettingsModal
        config={telebirrConfig}
        isOpen={isTelebirrSettingsOpen}
        onClose={() => setIsTelebirrSettingsOpen(false)}
        onSaved={(newCfg) => {
          setTelebirrConfig(newCfg);
          showToast('Telebirr settings updated');
        }}
      />

      {/* Terms & Legal Compliance Modal */}
      <TermsAndLegalModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        settings={lotterySettings}
      />

      {/* Lottery Settings & Prize Tiers Modal */}
      <LotterySettingsModal
        isOpen={isLotterySettingsOpen}
        onClose={() => setIsLotterySettingsOpen(false)}
        settings={lotterySettings}
        onSave={(newSettings) => {
          setLotterySettings(newSettings);
          showToast('Lottery rules & prizes updated');
        }}
      />

      {/* Scene Editor Modal */}
      <SceneEditorModal
        scene={editingScene}
        config={config}
        isOpen={Boolean(editingScene)}
        onClose={() => setEditingScene(null)}
        onSave={(updated) => {
          setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          showToast(`Updated Scene ${updated.sceneNumber}`);
        }}
      />

      {/* Bulk Prompt Modal */}
      <BulkPromptModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImportPrompts={handleImportPrompts}
        currentCount={scenes.length}
      />
    </div>
  );
}
