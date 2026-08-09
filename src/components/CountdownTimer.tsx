import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDateStr: string; // YYYY-MM-DD
  herName: string;
  theme?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTodayOrPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDateStr, herName, theme }) => {
  const calculateTimeLeft = (): TimeLeft => {
    // Default to 2026-08-28 if empty
    const targetDate = new Date(`${targetDateStr || '2026-08-28'}T00:00:00`);
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isTodayOrPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isTodayOrPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const isMidnight = theme === 'midnight';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 sm:p-5 border transition-all my-4 text-center relative overflow-hidden ${
        isMidnight
          ? 'bg-slate-900/90 border-amber-300/30 text-amber-100 shadow-lg shadow-amber-500/10'
          : 'bg-white/90 border-amber-200/80 text-slate-800 shadow-md'
      }`}
    >
      {/* Decorative Moon Mascot Background Glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-center gap-2 mb-2">
        <Moon className="w-5 h-5 text-amber-300 animate-pulse fill-amber-300/30" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Pingrei's Birthday Countdown
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold font-serif-display mb-3">
        {timeLeft.isTodayOrPast ? (
          <span className="text-amber-300 text-base sm:text-lg animate-bounce inline-block">
            🎉 IT'S {herName.toUpperCase()}'S BIRTHDAY TODAY! 🎂
          </span>
        ) : (
          <span>Counting down every second until loml {herName}'s Birthday (Aug 28) 🌕</span>
        )}
      </h3>

      {!timeLeft.isTodayOrPast ? (
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2 flex flex-col items-center justify-center border transition-all ${
                isMidnight
                  ? 'bg-slate-950/80 border-amber-400/30 text-amber-200'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <span className="text-lg sm:text-xl font-extrabold tracking-tight font-mono">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold opacity-75 tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-90 text-amber-200 font-medium">
          The moon are shining bright for {herName} today! 🌟
        </p>
      )}

      <div className="mt-2 text-[11px] opacity-75 flex items-center justify-center gap-1">
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
        <span>Our Moon 🌕 is watching over us</span>
      </div>
    </motion.div>
  );
};
