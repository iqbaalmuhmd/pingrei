import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, Volume2, RotateCcw, Printer, BookmarkCheck, ArrowLeft, ChevronRight, Image as ImageIcon, Calendar } from 'lucide-react';
import { BirthdayConfig, SecretLetter } from '../types';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface LoveLetterProps {
  config: BirthdayConfig;
  onOpenCreator?: () => void;
  isSecretVault?: boolean;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ config, onOpenCreator, isSecretVault = false }) => {
  // Normalize letters list based on mode
  const letters: SecretLetter[] = isSecretVault
    ? (config.secretLetters && config.secretLetters.length > 0)
      ? config.secretLetters
      : [
          {
            id: 'secret-1',
            title: 'Secret Note #1: To My Universe 🌌',
            date: 'August 28, 2026',
            body: 'You unlocked this secret letter by keeping our special candles burning on your cake! Thank you for being my light and my happiness every single day.',
            ps: 'P.S. You are my favorite mystery and my forever love.',
          },
        ]
    : [
        {
          id: 'primary-1',
          title: config.loveLetterTitle || 'To My Favorite Human On Her Birthday 💌',
          date: 'August 28, 2026',
          body: config.loveLetterBody || 'Happy Birthday, my love!',
          ps: config.loveLetterPS,
        },
      ];

  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const activeLetter = letters.find((l) => l.id === selectedLetterId) || letters[0];

  const handleSelectLetter = (letterId: string) => {
    soundFX.playPop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setSelectedLetterId(letterId);
    setIsOpen(false);
    setIsPlayingAudio(false);
  };

  const handleOpenEnvelope = () => {
    soundFX.playChime();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FB7185', '#FECDD3', '#FDE68A', '#38BDF8'],
    });
    setIsOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleAudioNote = () => {
    soundFX.playHeartSound();
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      if (activeLetter.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(activeLetter.audioUrl);
          audioRef.current.onended = () => setIsPlayingAudio(false);
        } else {
          audioRef.current.src = activeLetter.audioUrl;
        }
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
      } else {
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          {isSecretVault ? `Secret Letter Vault (${letters.length}) 💌` : `For My Favorite Human 💌`}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isSecretVault ? 'Secret Love Notes 💌' : 'Letter From My Heart 💌'}
        </h2>
        <p className="text-sm opacity-80 mt-2">
          {isSecretVault
            ? 'A secret collection of love letters unlocked by keeping candles #6 & #7 glowing on your birthday cake!'
            : 'Written with endless love for your special day...'}
        </p>
      </div>

      {/* Letters Selection Tabs / Cards (Shown only if multiple letters exist) */}
      {letters.length > 1 && (
        <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
          {letters.map((letItem, idx) => {
            const isSelected = activeLetter.id === letItem.id;
            return (
              <button
                key={letItem.id}
                onClick={() => handleSelectLetter(letItem.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-xs ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-600 border-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Letter #{idx + 1}: {letItem.title.length > 22 ? letItem.title.substring(0, 22) + '...' : letItem.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Envelope or Letter Content */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Wax Envelope View */
          <motion.div
            key={`sealed-${activeLetter.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleOpenEnvelope}
            className="w-full max-w-lg mx-auto bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100/90 border-2 border-rose-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-rose-200/50 cursor-pointer relative overflow-hidden group hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
          >
            {/* Envelope flap background design */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-rose-200/40 rounded-b-full border-b border-rose-300/40 pointer-events-none" />

            <div className="relative z-10 my-4">
              {/* Wax Seal Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-gradient-to-tr from-rose-600 to-red-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-rose-400 text-white border-4 border-rose-300 mb-4 cursor-pointer"
              >
                <Heart className="w-10 h-10 fill-white animate-pulse" />
              </motion.div>

              <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-rose-700 transition-colors">
                {activeLetter.title}
              </h3>
              
              {activeLetter.date && (
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800/80 bg-amber-100/80 px-2.5 py-0.5 rounded-full mt-2">
                  <Calendar className="w-3 h-3 text-amber-600" />
                  <span>{activeLetter.date}</span>
                </div>
              )}

              <p className="text-xs text-rose-600 font-bold tracking-wide uppercase mt-3">
                Click Wax Seal To Open 💌
              </p>

              <p className="text-xs text-slate-500 mt-4 italic">
                "Written with love for my dearest {config.herName}..."
              </p>
            </div>
          </motion.div>
        ) : (
          /* Unsealed Letter View */
          <motion.div
            key={`opened-${activeLetter.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-amber-50/95 border border-amber-200/90 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden font-serif"
          >
            {/* Paper texture overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full pointer-events-none" />

            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-amber-200/80 font-sans text-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <BookmarkCheck className="w-4 h-4 text-rose-500" />
                <span>Letter #{letters.findIndex((l) => l.id === activeLetter.id) + 1} of {letters.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAudioNote}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-200/80 hover:bg-amber-300 text-amber-900'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Voice Playing 🎵' : 'Play Voice Note 🎙️'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-1.5 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg transition-all cursor-pointer"
                  title="Print Letter Keepsake"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold text-xs"
                  title="Reseal Letter"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reseal</span>
                </button>
              </div>
            </div>

            {/* Simulated Voice Message Waveform Bar */}
            {isPlayingAudio && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3.5 bg-white/90 border border-amber-200 rounded-2xl flex items-center gap-3 font-sans text-xs text-amber-900 shadow-xs"
              >
                <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold shrink-0">
                  🎙️
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Voice Note from {config.boyfriendName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[30, 60, 40, 80, 50, 90, 70, 40, 80, 60, 90, 50, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-rose-400 rounded-full animate-bounce"
                        style={{
                          height: `${h / 4}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[11px] text-amber-700">0:45 / 0:45</span>
              </motion.div>
            )}

            {/* Optional Keepsake Picture */}
            {activeLetter.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border-2 border-amber-200/80 max-h-72 shadow-md">
                <img
                  src={activeLetter.imageUrl}
                  alt={activeLetter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Letter Content */}
            <div className="space-y-6 text-slate-800 leading-relaxed text-base sm:text-lg">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-amber-200/50 pb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-rose-800 font-serif">
                  {activeLetter.title}
                </h3>
                {activeLetter.date && (
                  <span className="font-sans text-xs text-amber-800/80 font-bold">
                    {activeLetter.date}
                  </span>
                )}
              </div>

              <div className="whitespace-pre-line text-slate-800 font-serif text-base sm:text-lg leading-loose">
                {activeLetter.body}
              </div>

              {activeLetter.ps && (
                <div className="pt-4 border-t border-amber-200/60 font-sans text-sm text-rose-700 font-medium italic bg-rose-50/50 p-3.5 rounded-2xl">
                  {activeLetter.ps}
                </div>
              )}
            </div>

            {/* Signature Stamp */}
            <div className="mt-8 pt-4 flex items-center justify-between font-sans text-xs text-amber-800/80">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Sealed with endless love</span>
              </div>
              <div className="font-bold text-rose-700 text-sm">
                Forever Yours, {config.boyfriendName} ❤️
              </div>
            </div>

            {/* Letter Navigation Bar */}
            <div className="mt-8 pt-4 border-t border-amber-200/80 font-sans flex items-center justify-between text-xs font-bold text-amber-900">
              <button
                onClick={() => {
                  const currentIdx = letters.findIndex((l) => l.id === activeLetter.id);
                  const prevIdx = (currentIdx - 1 + letters.length) % letters.length;
                  handleSelectLetter(letters[prevIdx].id);
                }}
                className="px-3 py-1.5 bg-amber-200/80 hover:bg-amber-300 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Letter</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-800 hover:underline"
              >
                Reseal Envelope
              </button>

              <button
                onClick={() => {
                  const currentIdx = letters.findIndex((l) => l.id === activeLetter.id);
                  const nextIdx = (currentIdx + 1) % letters.length;
                  handleSelectLetter(letters[nextIdx].id);
                }}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Next Letter</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
