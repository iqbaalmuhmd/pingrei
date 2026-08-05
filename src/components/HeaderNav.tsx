import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Lock, Heart, Palette, Gift, Calendar } from 'lucide-react';
import { BirthdayConfig, ThemeColor } from '../types';
import { soundFX } from '../utils/soundEffects';

interface HeaderNavProps {
  config: BirthdayConfig;
  isCreator?: boolean;
  onLock: () => void;
  onOpenCreator: () => void;
  onOpenCake: () => void;
  onThemeChange: (theme: ThemeColor) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  config,
  isCreator,
  onLock,
  onOpenCreator,
  onOpenCake,
  onThemeChange,
}) => {
  const [isMuted, setIsMuted] = useState(soundFX.getMutedState());
  const [daysTogether, setDaysTogether] = useState<number>(0);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    if (config.relationshipStartDate) {
      const start = new Date(config.relationshipStartDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays > 0 ? diffDays : 365);
    }
  }, [config.relationshipStartDate]);

  const handleAudioToggle = () => {
    const nextMute = soundFX.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundFX.playChime();
    }
  };

  const isNatural = config.theme === 'natural';
  const isMidnight = config.theme === 'midnight';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-xs transition-all ${
      isMidnight
        ? 'bg-slate-950/90 border-amber-300/20 text-amber-50'
        : isNatural 
          ? 'bg-[#f9f7f2]/90 border-[#d6cebd] text-[#2B2A27]' 
          : 'bg-white/80 border-rose-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCake}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group ${
              isMidnight
                ? 'bg-gradient-to-tr from-amber-400 to-indigo-600 text-slate-950 shadow-amber-500/20'
                : isNatural 
                  ? 'bg-[#5d5b4a] text-[#f9f7f2] shadow-[#5d5b4a]/20' 
                  : 'bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-rose-200'
            }`}
            title="Blow 8 Birthday Candles 🎂"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight font-serif-display">
                {config.herName}'s Birthday Vault
              </span>
              <span className="text-sm animate-pulse">🌙</span>
            </div>
            <div className={`flex items-center gap-2 text-xs font-medium ${
              isMidnight ? 'text-amber-300' : isNatural ? 'text-[#5d5b4a]' : 'text-rose-600'
            }`}>
              <span className="flex items-center gap-1">
                <Calendar className={`w-3 h-3 ${isMidnight ? 'text-amber-300' : isNatural ? 'text-[#a38f78]' : 'text-rose-400'}`} />
                {daysTogether} days of love (since Jan 10)
              </span>
              <span className="opacity-40">•</span>
              <span className="hidden sm:inline opacity-80">Mascot: Moon 🌙 • Ingbal & Pingrei</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => {
                soundFX.playPop();
                setShowThemeMenu((prev) => !prev);
              }}
              className={`p-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                isMidnight
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-300/30'
                  : isNatural
                    ? 'bg-[#e6e2d3] text-[#5d5b4a]'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
              }`}
              title="Change Theme Palette"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-bold capitalize">{config.theme}</span>
            </button>

            {showThemeMenu && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-2xl p-2 shadow-xl border z-50 transition-all ${
                  isMidnight
                    ? 'bg-slate-900 border-amber-300/30 text-amber-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="text-[10px] font-extrabold uppercase px-2 py-1 opacity-60">
                  Select Theme
                </div>
                {[
                  { id: 'natural', label: '🌿 Natural Cream', color: 'bg-[#efece4] text-[#2B2A27]' },
                  { id: 'rose', label: '💖 Soft Rose', color: 'bg-rose-100 text-rose-800' },
                  { id: 'lavender', label: '🪻 Lavender', color: 'bg-purple-100 text-purple-800' },
                  { id: 'sunset', label: '🌅 Sunset Amber', color: 'bg-amber-100 text-amber-800' },
                  { id: 'midnight', label: '🌙 Midnight Dark', color: 'bg-slate-800 text-amber-200' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundFX.playChime();
                      onThemeChange(t.id as ThemeColor);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer my-0.5 ${
                      config.theme === t.id
                        ? 'ring-2 ring-rose-500 font-extrabold'
                        : 'hover:opacity-80'
                    } ${t.color}`}
                  >
                    <span>{t.label}</span>
                    {config.theme === t.id && <Sparkles className="w-3 h-3 text-rose-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              !isMuted
                ? isMidnight 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-300/30' 
                  : isNatural 
                    ? 'bg-[#e6e2d3] text-[#5d5b4a]' 
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : isMidnight
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-black/5 text-slate-400 hover:text-slate-600'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Customize Button - ONLY visible when unlocked with Iqbal Sz */}
          {isCreator && (
            <button
              onClick={() => {
                soundFX.playPop();
                onOpenCreator();
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                isMidnight
                  ? 'bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-extrabold shadow-amber-500/20'
                  : isNatural
                    ? 'bg-[#5d5b4a] text-[#f9f7f2] hover:bg-[#484739]'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
              }`}
              title="Customize passcode, letters, inside jokes, and memories"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Customize</span>
            </button>
          )}

          {/* Re-Lock Vault */}
          <button
            onClick={() => {
              soundFX.playPop();
              onLock();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isMidnight
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-300/30'
                : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
            }`}
            title="Lock Vault & Test Passcode"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
