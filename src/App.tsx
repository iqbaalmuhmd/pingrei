import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Mail, Gift, Camera, HelpCircle, Heart, Sparkles, Lock, Flame } from 'lucide-react';
import { BirthdayConfig, ThemeColor } from './types';
import { defaultBirthdayConfig } from './data/defaultData';
import { soundFX } from './utils/soundEffects';

import { BackgroundParticles } from './components/BackgroundParticles';
import { PasscodeGate } from './components/PasscodeGate';
import { HeaderNav } from './components/HeaderNav';
import { InsideJokesVault } from './components/InsideJokesVault';
import { LoveLetter } from './components/LoveLetter';
import { MemoryTimeline } from './components/MemoryTimeline';
import { BirthdayCake } from './components/BirthdayCake';
import { CoupleQuiz } from './components/CoupleQuiz';
import { CreatorModal } from './components/CreatorModal';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'girlfriend_birthday_vault_config';
const UNLOCKED_KEY = 'girlfriend_birthday_vault_unlocked';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return defaultBirthdayConfig;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(UNLOCKED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isCreator, setIsCreator] = useState<boolean>(() => {
    try {
      return localStorage.getItem('girlfriend_birthday_vault_is_creator') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'jokes' | 'letter' | 'secret-letter' | 'cake' | 'memories' | 'quiz'>('jokes');
  const [showCreator, setShowCreator] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>(Array(8).fill(true));

  // The Secret Letter tab unlocks ONLY when 6th (idx 5) & 7th (idx 6) candles remain UNBLOWN (lit)
  // WHILE all the other candles (0, 1, 2, 3, 4, 7) are BLOWN (unlit)
  const isSecretLetterUnlocked =
    candlesLit[5] &&
    candlesLit[6] &&
    !candlesLit[0] &&
    !candlesLit[1] &&
    !candlesLit[2] &&
    !candlesLit[3] &&
    !candlesLit[4] &&
    !candlesLit[7];

  useEffect(() => {
    if (!isSecretLetterUnlocked && activeTab === 'secret-letter') {
      setActiveTab('cake');
    }
  }, [isSecretLetterUnlocked, activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save birthday config:', e);
    }
  }, [config]);

  const handleUnlock = (isCreatorMode: boolean = false) => {
    setIsUnlocked(true);
    setIsCreator(isCreatorMode);
    try {
      localStorage.setItem(UNLOCKED_KEY, 'true');
      if (isCreatorMode) {
        localStorage.setItem('girlfriend_birthday_vault_is_creator', 'true');
      } else {
        localStorage.removeItem('girlfriend_birthday_vault_is_creator');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setIsCreator(false);
    try {
      localStorage.removeItem(UNLOCKED_KEY);
      localStorage.removeItem('girlfriend_birthday_vault_is_creator');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveConfig = (updated: BirthdayConfig) => {
    setConfig(updated);
  };

  const handleResetConfig = () => {
    setConfig(defaultBirthdayConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBirthdayConfig));
    } catch (e) {
      console.error(e);
    }
  };

  const handleThemeChange = (theme: ThemeColor) => {
    setConfig((prev) => ({ ...prev, theme }));
  };

  const triggerConfetti = () => {
    soundFX.playPartyHorn();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F472B6', '#FB7185', '#FECDD3', '#FDE68A', '#38BDF8'],
    });
  };

  // Theme styling background mappings
  const themeBgMap: Record<ThemeColor, string> = {
    natural: 'from-[#f9f7f2] via-[#efece4] to-[#e6e2d3] text-[#2B2A27]',
    rose: 'from-rose-100/70 via-pink-50 to-amber-50/60 text-slate-800',
    lavender: 'from-purple-100/70 via-pink-50 to-indigo-50/60 text-slate-800',
    sunset: 'from-amber-100/70 via-orange-50 to-rose-50/60 text-slate-800',
    midnight: 'from-slate-900 via-indigo-950 to-slate-900 text-slate-100',
  };

  const isMidnight = config.theme === 'midnight';
  const isNatural = config.theme === 'natural';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${themeBgMap[config.theme] || themeBgMap.natural} transition-colors duration-700 relative font-sans antialiased pb-16`}
    >
      {/* Background Floating Heart & Sparkle Canvas */}
      <BackgroundParticles theme={config.theme} />

      {!isUnlocked ? (
        /* PASSCODE GATE LOCK SCREEN */
        <PasscodeGate
          config={config}
          onUnlock={handleUnlock}
          onOpenCreator={() => setShowCreator(true)}
        />
      ) : (
        /* UNLOCKED MAIN BIRTHDAY HUB */
        <div className="relative z-10">
          <HeaderNav
            config={config}
            isCreator={isCreator}
            onLock={handleLock}
            onOpenCreator={() => setShowCreator(true)}
            onOpenCake={() => setActiveTab('cake')}
            onThemeChange={handleThemeChange}
          />

          {/* Romantic Hero Banner */}
          <section className="pt-8 pb-4 px-4 sm:px-6 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs ${
                isMidnight
                  ? 'bg-slate-800/90 border border-amber-300/40 text-amber-300 shadow-md shadow-amber-500/10'
                  : isNatural 
                    ? 'bg-[#ffffff]/90 border border-[#d6cebd] text-[#5d5b4a]' 
                    : 'bg-white/80 backdrop-blur-md border border-rose-200/80 text-rose-700'
              }`}>
                <Sparkles className={`w-4 h-4 animate-spin ${isMidnight ? 'text-amber-300' : isNatural ? 'text-[#a38f78]' : 'text-rose-500'}`} />
                <span>I Love YOU, {config.herName}! 🎂🌙</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif-display leading-tight">
                {config.mainTitle || `Happy Birthday, My Love, My Dearest, My Moon! ❤️`}
              </h1>

              <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto leading-relaxed">
                {config.subtitle}
              </p>

              {/* Celebration Quick Launcher */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={triggerConfetti}
                  className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-full shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer ${
                    isMidnight
                      ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-indigo-500 hover:from-amber-200 hover:to-indigo-400 text-slate-950 shadow-amber-500/20'
                      : isNatural
                        ? 'bg-[#5d5b4a] hover:bg-[#484739] text-[#f9f7f2] shadow-[#5d5b4a]/20'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  <span>Throw Birthday Confetti 🎉</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playPop();
                    setActiveTab('cake');
                  }}
                  className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-full border shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer ${
                    isMidnight
                      ? 'bg-slate-800/90 hover:bg-slate-700 text-amber-200 border-amber-300/40'
                      : isNatural
                        ? 'bg-[#efece4] hover:bg-[#e6e2d3] text-[#2B2A27] border-[#d6cebd]'
                        : 'bg-white/90 hover:bg-white text-rose-700 border-rose-200'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Blow 8 Candles 🎂</span>
                </button>
              </div>
            </motion.div>
          </section>

          {/* Interactive Navigation Tabs */}
          <nav className={`sticky top-16 z-30 py-3 my-4 backdrop-blur-md border-y ${
            isMidnight
              ? 'bg-slate-950/80 border-amber-300/20'
              : isNatural 
                ? 'bg-[#f9f7f2]/80 border-[#d6cebd]' 
                : 'bg-white/40 border-rose-100/60'
          }`}>
            <div className="max-w-4xl mx-auto px-3 sm:px-4 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto text-xs font-bold no-scrollbar py-0.5">
              {[
                { id: 'jokes', label: 'Inside Jokes 🤫', icon: Smile },
                { id: 'letter', label: 'Birthday Letter 💌', icon: Mail },
                ...(isSecretLetterUnlocked
                  ? [{ id: 'secret-letter', label: 'Letters for Pingrei 💌', icon: Mail, isUnlockedBadge: true }]
                  : []),
                { id: 'cake', label: '8 Birthday Candles 🎂', icon: Gift },
                { id: 'memories', label: 'Memory Lane 📸', icon: Camera },
                { id: 'quiz', label: 'Quiz 🎯', icon: HelpCircle },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                let tabClasses = '';
                if (isActive) {
                  tabClasses = isMidnight
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/20 scale-105'
                    : isNatural
                      ? 'bg-[#5d5b4a] text-[#f9f7f2] shadow-md shadow-[#5d5b4a]/20 scale-105'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 scale-105';
                } else {
                  tabClasses = isMidnight
                    ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-100 border border-amber-300/20 shadow-xs'
                    : isNatural
                      ? 'bg-[#efece4]/90 hover:bg-[#e6e2d3] text-[#2B2A27] border border-[#d6cebd] shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 border border-slate-200/60 shadow-xs';
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundFX.playPop();
                      setActiveTab(tab.id as typeof activeTab);
                    }}
                    className={`px-3.5 sm:px-5 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 min-h-[44px] ${tabClasses}`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {'isUnlockedBadge' in tab && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-300 text-amber-950 animate-pulse">
                        ✨ Unlocked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Active Tab View */}
          <main className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'jokes' && (
                <motion.div
                  key="jokes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <InsideJokesVault
                    jokes={config.insideJokes}
                    onAddJokeClick={() => setShowCreator(true)}
                    onUpdateJokes={(updated) => setConfig((prev) => ({ ...prev, insideJokes: updated }))}
                  />
                </motion.div>
              )}

              {activeTab === 'letter' && (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoveLetter config={config} isSecretVault={false} />
                </motion.div>
              )}

              {activeTab === 'secret-letter' && (
                <motion.div
                  key="secret-letter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoveLetter config={config} isSecretVault={true} />
                </motion.div>
              )}

              {activeTab === 'cake' && (
                <motion.div
                  key="cake"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <BirthdayCake
                    herName={config.herName}
                    reasonsToLove={config.reasonsToLove}
                    candlesLit={candlesLit}
                    onCandlesChange={setCandlesLit}
                    onOpenLetterTab={() => setActiveTab('letter')}
                  />
                </motion.div>
              )}

              {activeTab === 'memories' && (
                <motion.div
                  key="memories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemoryTimeline
                    memories={config.memories}
                    onUpdateMemories={(updated) => setConfig((prev) => ({ ...prev, memories: updated }))}
                  />
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CoupleQuiz
                    questions={config.quizQuestions}
                    herName={config.herName}
                    resultTiers={config.quizResultTiers}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sweet Footer */}
          <footer className="mt-16 text-center text-xs text-slate-500 font-medium space-y-2">
            <p className="flex items-center justify-center gap-1">
              <span>Made with endless love by</span>
              <strong className="text-rose-600 font-bold">{config.boyfriendName}</strong>
              <span>for</span>
              <strong className="text-rose-600 font-bold">{config.herName}</strong>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handleLock}
                className="text-slate-400 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Re-lock Vault</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setShowCreator(true)}
                className="text-slate-400 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Customize Secrets ✏️</span>
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* CUSTOMIZER MODAL */}
      <AnimatePresence>
        {showCreator && (
          <CreatorModal
            config={config}
            onSave={handleSaveConfig}
            onReset={handleResetConfig}
            onClose={() => setShowCreator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
