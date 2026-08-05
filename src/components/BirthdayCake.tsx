import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Heart, RefreshCw, Gift, Trophy, Lock, Mail, Trash2 } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface BirthdayCakeProps {
  herName: string;
  reasonsToLove: string[];
  candlesLit: boolean[];
  onCandlesChange: (newCandles: boolean[]) => void;
  onOpenLetterTab?: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  herName,
  reasonsToLove,
  candlesLit,
  onCandlesChange,
  onOpenLetterTab,
}) => {
  const [wishText, setWishText] = useState('');
  const [isWishSaved, setIsWishSaved] = useState(false);
  const [savedWishes, setSavedWishes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pingrei_birthday_wishes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [currentReasonIdx, setCurrentReasonIdx] = useState<number>(0);
  const [pulledReason, setPulledReason] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('pingrei_birthday_wishes', JSON.stringify(savedWishes));
    } catch (e) {
      console.error(e);
    }
  }, [savedWishes]);

  const handleDeleteWish = (indexToDelete: number) => {
    soundFX.playPop();
    setSavedWishes((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const allCandlesBlown = candlesLit.every((lit) => !lit);
  const secretLetterUnlocked = candlesLit[5] && candlesLit[6];

  const handleBlowCandle = (index?: number) => {
    soundFX.playCandleBlow();

    if (index !== undefined) {
      const next = [...candlesLit];
      next[index] = false;
      onCandlesChange(next);
      if (next.every((l) => !l)) {
        celebrateAllBlown();
      }
    } else {
      // Blow out all 8 candles
      onCandlesChange(Array(8).fill(false));
      celebrateAllBlown();
    }
  };

  const celebrateAllBlown = () => {
    soundFX.playChime();
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FB7185', '#FECDD3', '#FDE68A', '#A7F3D0', '#FEF08A'],
    });
  };

  const handleRelight = () => {
    soundFX.playPop();
    onCandlesChange(Array(8).fill(true));
  };

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    soundFX.playChime();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    setSavedWishes((prev) => [wishText, ...prev]);
    setIsWishSaved(true);
    setWishText('');
    setTimeout(() => setIsWishSaved(false), 3000);
  };

  const handlePullLoveReason = () => {
    soundFX.playHeartSound();
    const nextIdx = (currentReasonIdx + 1) % reasonsToLove.length;
    setCurrentReasonIdx(nextIdx);
    setPulledReason(reasonsToLove[nextIdx]);
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Interactive Cake & Candles */}
        <div className="bg-white/90 border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-100/60 flex flex-col items-center text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5 text-rose-500" />
            Interactive Cake
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Make a Wish, {herName}! 🎂
          </h3>
          <p className="text-xs sm:text-sm opacity-80 mt-1 mb-3">
            Tap the 8 flickering candles to blow them out!
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
            <span>🌙 Moon Mascot Cake • 8 August Candles 🕯️</span>
          </div>

          {/* Cake Display */}
          <div className="relative my-4 py-2 flex flex-col items-center">
            {/* Candles Row (8 Candles) */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-1 z-10">
              {candlesLit.map((isLit, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => handleBlowCandle(idx)}
                    className="flex flex-col items-center cursor-pointer group relative"
                    title={`Candle #${idx + 1} - Click to blow out`}
                  >
                    {/* Flame */}
                    <div className="h-6 flex items-center justify-center">
                      {isLit ? (
                        <motion.div
                          animate={{ scale: [1, 1.25, 0.9, 1.1, 1], y: [0, -2, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 + (idx % 3) * 0.1 }}
                          className="text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                        >
                          <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-300 text-amber-500" />
                        </motion.div>
                      ) : (
                        <span className="text-[10px] opacity-60 animate-pulse font-mono">💨</span>
                      )}
                    </div>
                    {/* Candle Stick */}
                    <div className="w-2.5 sm:w-3 h-10 sm:h-12 rounded-t-sm shadow-xs border-x bg-gradient-to-b from-amber-200 via-rose-300 to-amber-300 border-amber-200/80" />
                  </div>
                );
              })}
            </div>

            {/* Cake Layers */}
            <div className="w-[80vw] max-w-[260px] sm:w-72 h-12 bg-gradient-to-r from-amber-200 via-indigo-200 to-amber-200 rounded-t-3xl border-t-4 border-amber-300 shadow-md relative overflow-hidden flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1 sm:gap-1.5 px-2 truncate">
                <span>🌙</span> Happy Birthday Pingrei <span>🌙</span>
              </span>
            </div>
            <div className="w-[88vw] max-w-[290px] sm:w-80 h-16 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 rounded-b-3xl border-t-4 border-amber-300/80 shadow-xl flex items-center justify-center relative">
              <div className="flex gap-1.5 sm:gap-2">
                {['✨', '🌙', '💖', '🌕', '💖', '🌙', '✨'].map((e, i) => (
                  <span key={i} className="text-sm sm:text-lg">{e}</span>
                ))}
              </div>
            </div>
            {/* Cake Plate */}
            <div className="w-[94vw] max-w-[310px] sm:w-88 h-4 bg-slate-300/80 rounded-full shadow-lg border-t border-amber-200" />
          </div>

          {/* Blow Controls */}
          <div className="flex items-center gap-3 mt-4">
            {!allCandlesBlown ? (
              <button
                onClick={() => handleBlowCandle()}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Blow Out All Candles 💨</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm rounded-xl animate-bounce flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span>Wish Granted! All Candles Out! 🎉</span>
                </div>
                <button
                  onClick={handleRelight}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Relight Candles</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: "Reasons Why I Love You" Jar & Wish Input */}
        <div className="space-y-6">
          {/* Reasons Jar */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50/80 border border-rose-100 rounded-3xl p-6 shadow-lg shadow-rose-100/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🫙</span>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800">
                    Reasons Why I Love You Jar
                  </h4>
                  <p className="text-xs text-slate-500">Pull a love note from the jar!</p>
                </div>
              </div>
              <button
                onClick={handlePullLoveReason}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Pull a Note 💌</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {pulledReason ? (
                <motion.div
                  key={pulledReason}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-white border border-rose-200/80 rounded-2xl shadow-sm text-sm text-slate-800 leading-relaxed font-serif relative"
                >
                  <span className="text-xs font-bold text-rose-600 font-sans block mb-1">
                    Reason #{currentReasonIdx + 1} of {reasonsToLove.length}:
                  </span>
                  "{pulledReason}"
                </motion.div>
              ) : (
                <div className="p-4 bg-white/60 border border-dashed border-rose-200 rounded-2xl text-center text-xs text-slate-500">
                  Click "Pull a Note" to see a sweet reason why you are adored! 💕
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Birthday Wish Form */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-lg shadow-rose-100/50">
            <h4 className="text-base font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Seal Your Birthday Wish</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Type a secret birthday wish to save it in your private memory vault:
            </p>

            <form onSubmit={handleSaveWish} className="space-y-3">
              <input
                type="text"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="I wish for..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Save Birthday Wish 🌟
              </button>
            </form>

            {isWishSaved && (
              <p className="text-xs font-bold text-emerald-600 text-center mt-2 animate-pulse">
                ✨ Your wish has been safely saved!
              </p>
            )}

            {savedWishes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Your Saved Wishes (Saved Permanently):
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {savedWishes.map((w, idx) => (
                    <div key={idx} className="p-2 bg-rose-50/80 rounded-lg text-xs text-rose-900 font-medium flex items-center justify-between gap-2 border border-rose-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0">✨</span>
                        <span className="truncate">{w}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteWish(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-rose-100 rounded-md transition-colors shrink-0 cursor-pointer"
                        title="Delete wish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
