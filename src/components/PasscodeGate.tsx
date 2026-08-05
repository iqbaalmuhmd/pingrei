import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Heart, Key, HelpCircle, Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, Moon } from 'lucide-react';
import { BirthdayConfig } from '../types';
import { soundFX } from '../utils/soundEffects';
import { CountdownTimer } from './CountdownTimer';
import confetti from 'canvas-confetti';

interface PasscodeGateProps {
  config: BirthdayConfig;
  onUnlock: (isCreator?: boolean) => void;
  onOpenCreator: () => void;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ config, onUnlock, onOpenCreator }) => {
  const [passcode, setPasscode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showQuestionMode, setShowQuestionMode] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isNatural = config.theme === 'natural';
  const isMidnight = config.theme === 'midnight';

  const handleUnlockSuccess = (isCreatorMode: boolean = false) => {
    soundFX.playChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FB7185', '#FECDD3', '#FDE68A'],
    });
    onUnlock(isCreatorMode);
  };

  const handlePasscodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) return;

    if (passcode === 'Iqbal Sz') {
      handleUnlockSuccess(true);
      return;
    }

    if (passcode.trim().toLowerCase() === config.passcode.trim().toLowerCase() || passcode.trim().toLowerCase() === 'pizza') {
      handleUnlockSuccess(false);
    } else {
      soundFX.playBuzz();
      setIsError(true);
      setErrorMessage('Oops! Incorrect passcode. Try again or check the hint! 💔');
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionAnswer) return;

    // Check Case-Sensitive "Iqbal Sz" for Creator Customize Mode
    if (questionAnswer === 'Iqbal Sz') {
      handleUnlockSuccess(true);
      return;
    }

    const targetAnswer = config.securityAnswer?.trim().toLowerCase() || 'pizza';
    if (questionAnswer.trim().toLowerCase() === targetAnswer) {
      handleUnlockSuccess(false);
    } else {
      soundFX.playBuzz();
      setIsError(true);
      setErrorMessage('Not quite! Think of our favorite memories together 💕');
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleKeypadPress = (num: string) => {
    soundFX.playPop();
    if (passcode.length < 8) {
      setPasscode((prev) => prev + num);
    }
  };

  const handleKeypadDelete = () => {
    soundFX.playPop();
    setPasscode((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-screen flex items-center justify-center p-4 relative z-10 my-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full max-w-md backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all ${
          isMidnight
            ? 'bg-slate-900/90 border border-amber-300/30 text-amber-50 shadow-indigo-950/80'
            : isNatural 
              ? 'bg-[#ffffff]/95 border border-[#e6e2d3] text-[#2B2A27]' 
              : 'bg-white/85 border border-rose-100'
        } ${
          isError ? 'animate-shake border-red-300' : ''
        }`}
      >
        {/* Glowing background aura */}
        <div className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isMidnight ? 'bg-indigo-600/20' : isNatural ? 'bg-[#c2beaf]/20' : 'bg-rose-300/30'}`} />
        <div className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isMidnight ? 'bg-amber-400/15' : isNatural ? 'bg-[#a38f78]/20' : 'bg-pink-300/30'}`} />

        {/* Header Badge */}
        <div className="text-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white mb-3 ${
              isMidnight 
                ? 'bg-gradient-to-tr from-amber-400 to-indigo-600 shadow-amber-500/20' 
                : isNatural 
                  ? 'bg-[#5d5b4a] shadow-[#5d5b4a]/20' 
                  : 'bg-gradient-to-tr from-rose-500 to-pink-400 shadow-rose-200'
            }`}
          >
            {isMidnight ? <Moon className="w-8 h-8 text-amber-200 fill-amber-200/30" /> : <Lock className="w-8 h-8" />}
          </motion.div>
          
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-2 ${
            isMidnight
              ? 'bg-slate-800 border border-amber-300/30 text-amber-300'
              : isNatural 
                ? 'bg-[#efece4] text-[#5d5b4a] border border-[#d6cebd]' 
                : 'bg-rose-100/80 text-rose-700'
          }`}>
            <Moon className={`w-3.5 h-3.5 fill-current ${isMidnight ? 'text-amber-300' : isNatural ? 'text-[#8c5349]' : 'text-rose-500'}`} />
            Top Secret Birthday Vault
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-display">
            Hey {config.herName}! ❤️ 🌙
          </h1>
          <p className="text-sm opacity-80 mt-1.5 leading-relaxed">
            Enter your secret birthday passcode to unlock your special surprise.
          </p>
        </div>

        {/* Live Countdown Timer to August 28 */}
        <CountdownTimer
          targetDateStr={config.birthDate || '2026-08-28'}
          herName={config.herName}
          theme={config.theme}
        />

        {/* Input Toggle: Code vs Security Question */}
        <div className={`flex p-1 rounded-xl mb-5 text-xs font-medium ${
          isMidnight 
            ? 'bg-slate-950/80 text-slate-300 border border-amber-300/20' 
            : isNatural 
              ? 'bg-[#efece4] text-[#2B2A27]' 
              : 'bg-rose-50/80 text-slate-600'
        }`}>
          <button
            type="button"
            onClick={() => {
              setShowQuestionMode(false);
              soundFX.playPop();
            }}
            className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer font-bold ${
              !showQuestionMode
                ? isMidnight
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-300/30'
                  : isNatural 
                    ? 'bg-[#ffffff] text-[#5d5b4a] shadow-xs' 
                    : 'bg-white text-rose-600 shadow-xs'
                : 'hover:opacity-100 opacity-70'
            }`}
          >
            Secret Passcode 🔢
          </button>
          <button
            type="button"
            onClick={() => {
              setShowQuestionMode(true);
              soundFX.playPop();
            }}
            className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer font-bold ${
              showQuestionMode
                ? isMidnight
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-300/30'
                  : isNatural 
                    ? 'bg-[#ffffff] text-[#5d5b4a] shadow-xs' 
                    : 'bg-white text-rose-600 shadow-xs'
                : 'hover:opacity-100 opacity-70'
            }`}
          >
            Secret Question ❓
          </button>
        </div>

        {!showQuestionMode ? (
          /* Passcode Input Mode */
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className={`w-full px-4 py-3.5 border rounded-2xl text-center text-xl font-bold tracking-widest transition-all shadow-inner focus:outline-none focus:ring-2 ${
                  isMidnight
                    ? 'bg-slate-950 border-amber-300/30 text-amber-200 placeholder:text-slate-500 focus:ring-amber-400 focus:bg-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 placeholder:text-base placeholder:tracking-normal focus:ring-rose-400 focus:bg-white'
                }`}
                maxLength={12}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-2 cursor-pointer ${
                  isMidnight ? 'text-amber-300/70 hover:text-amber-200' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Virtual On-Screen Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'C') {
                      soundFX.playPop();
                      setPasscode('');
                    } else if (item === '⌫') {
                      handleKeypadDelete();
                    } else {
                      handleKeypadPress(item);
                    }
                  }}
                  className={`py-3.5 font-extrabold text-lg rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer ${
                    isMidnight
                      ? 'bg-slate-800/90 hover:bg-slate-700 border border-amber-300/30 text-amber-200 active:bg-amber-400 active:text-slate-950'
                      : isNatural
                        ? 'bg-[#efece4] hover:bg-[#e6e2d3] border border-[#d6cebd] text-[#2B2A27]'
                        : 'bg-white hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 font-bold rounded-2xl shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 min-h-[48px] ${
                isMidnight
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 hover:from-amber-300 hover:to-indigo-400 text-slate-950 font-extrabold shadow-amber-500/20'
                  : isNatural 
                    ? 'bg-[#5d5b4a] hover:bg-[#484739] text-[#f9f7f2] shadow-[#5d5b4a]/20' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
              }`}
            >
              <span>Unlock Secret Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Security Question Mode */
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className={`border rounded-2xl p-4 text-center ${
              isMidnight 
                ? 'bg-slate-950 border-amber-300/30 text-amber-100' 
                : isNatural 
                  ? 'bg-[#efece4] border-[#d6cebd] text-[#2B2A27]' 
                  : 'bg-rose-50/90 border-rose-100'
            }`}>
              <ShieldCheck className={`w-6 h-6 mx-auto mb-1.5 ${
                isMidnight ? 'text-amber-300' : isNatural ? 'text-[#a38f78]' : 'text-rose-500'
              }`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                isMidnight ? 'text-amber-300' : isNatural ? 'text-[#5d5b4a]' : 'text-rose-600'
              }`}>
                Security Question
              </p>
              <p className="text-sm font-medium mt-1">
                "{config.securityQuestion || 'What is our favorite takeout food?'}"
              </p>
            </div>

            <input
              type="text"
              value={questionAnswer}
              onChange={(e) => setQuestionAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full px-4 py-3 border rounded-2xl text-center font-medium transition-all shadow-inner focus:outline-none focus:ring-2 ${
                isMidnight
                  ? 'bg-slate-950 border-amber-300/30 text-amber-200 placeholder:text-slate-500 focus:ring-amber-400'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-rose-400 focus:bg-white'
              }`}
            />

            <button
              type="submit"
              className={`w-full py-3.5 font-bold rounded-2xl shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                isMidnight
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-slate-950 font-extrabold shadow-amber-500/20'
                  : isNatural 
                    ? 'bg-[#5d5b4a] hover:bg-[#484739] text-[#f9f7f2] shadow-[#5d5b4a]/20' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
              }`}
            >
              <span>Submit Secret Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 text-center font-semibold mt-3"
          >
            {errorMessage}
          </motion.p>
        )}

        {/* Hint Trigger */}
        <div className="mt-5 text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setShowHint(!showHint);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a passcode hint?</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 text-left leading-relaxed shadow-xs"
              >
                <div className="font-bold flex items-center gap-1 text-amber-900 mb-0.5">
                  <span>💡 Secret Hint:</span>
                </div>
                <p>{config.passcodeHint}</p>
                <p className="mt-1 text-[11px] text-amber-700/80 italic">
                  (Default passcode is <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{config.passcode}</code> or type <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">pizza</code>)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
