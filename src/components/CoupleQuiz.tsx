import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Award, CheckCircle2, XCircle, RefreshCw, Volume2, VolumeX, Play, Pause, Mic, Image as ImageIcon, Shuffle } from 'lucide-react';
import { QuizQuestion, QuizResultTier } from '../types';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface CoupleQuizProps {
  questions: QuizQuestion[];
  herName?: string;
  resultTiers?: QuizResultTier[];
}

export const CoupleQuiz: React.FC<CoupleQuizProps> = ({ questions, resultTiers }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(true);
  const [shuffledOrders, setShuffledOrders] = useState<Record<number, number[]>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate randomized option positions for each question
  useEffect(() => {
    const newOrders: Record<number, number[]> = {};
    questions.forEach((q, qIdx) => {
      const indices = q.options.map((_, i) => i);
      if (shuffleEnabled) {
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
      }
      newOrders[qIdx] = indices;
    });
    setShuffledOrders(newOrders);
  }, [questions, shuffleEnabled]);

  const currentQ = questions[currentIdx];
  const isAnswered = selectedAnswers[currentIdx] !== undefined;

  const handleToggleAudio = () => {
    if (!currentQ.audioUrl) return;

    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      if (currentQ.audioUrl.startsWith('data:audio') || currentQ.audioUrl.startsWith('http') || currentQ.audioUrl.startsWith('blob:')) {
        if (!audioRef.current) {
          audioRef.current = new Audio(currentQ.audioUrl);
          audioRef.current.onended = () => setIsPlayingAudio(false);
        } else {
          audioRef.current.src = currentQ.audioUrl;
        }
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
      } else {
        // Fallback Web Speech Synthesis if text prompt
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentQ.audioUrl);
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          setIsPlayingAudio(true);
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;

    const isCorrect = optIdx === currentQ.correctIndex;
    if (isCorrect) {
      soundFX.playChime();
    } else {
      soundFX.playPop();
    }

    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleNext = () => {
    soundFX.playPop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResult(true);
      soundFX.playChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    soundFX.playPop();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResult(false);

    // Re-shuffle option positions
    const newOrders: Record<number, number[]> = {};
    questions.forEach((q, qIdx) => {
      const indices = q.options.map((_, i) => i);
      if (shuffleEnabled) {
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
      }
      newOrders[qIdx] = indices;
    });
    setShuffledOrders(newOrders);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
    return questions[Number(qIdx)]?.correctIndex === ansIdx ? acc + 1 : acc;
  }, 0);

  return (
    <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
          Quiz!
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          One of our favorite activity 🎯
        </h2>
        <p className="text-sm text-slate-600 mt-2 font-medium">
          Ga boleh bohong dan cari Google!
        </p>
      </div>

      {!showResult ? (
        <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-100/50 relative overflow-hidden">
          {/* Progress Bar & Shuffle Control */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setShuffleEnabled((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                shuffleEnabled
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle option order randomization"
            >
              <Shuffle className="w-3 h-3 text-rose-500" />
              <span>{shuffleEnabled ? '🔀 Random Options: On' : 'Original Order'}</span>
            </button>
            <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Optional Voice Note Question Player */}
          {currentQ.audioUrl && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-amber-300/40 shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0 font-bold"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                    <span>Voice Note Question 🎙️</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isPlayingAudio ? 'Playing voice question...' : 'Click play to listen!'}
                  </p>
                </div>
              </div>

              {/* Animated Waveform */}
              {isPlayingAudio && (
                <div className="flex items-end gap-1 h-6 pr-2">
                  <span className="w-1 bg-amber-300 rounded-full h-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-amber-300 rounded-full h-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 bg-amber-300 rounded-full h-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-4 leading-snug">
            {currentQ.question}
          </h3>

          {/* Optional Question Image */}
          {currentQ.imageUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden border-2 border-rose-100 max-h-72 bg-slate-100 shadow-md">
              <img
                src={currentQ.imageUrl}
                alt="Quiz hint picture"
                className="w-full h-full object-cover max-h-72 hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {((shuffledOrders[currentIdx] && shuffledOrders[currentIdx].length === currentQ.options.length)
              ? shuffledOrders[currentIdx]
              : currentQ.options.map((_, i) => i)
            ).map((originalOptIdx) => {
              const opt = currentQ.options[originalOptIdx];
              const selectedOpt = selectedAnswers[currentIdx];
              const isSelected = selectedOpt === originalOptIdx;
              const isCorrectOpt = currentQ.correctIndex === originalOptIdx;

              let btnStyle = 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-700';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  btnStyle = 'bg-red-50 border-red-300 text-red-900';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={originalOptIdx}
                  onClick={() => handleSelectOption(originalOptIdx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 leading-relaxed font-medium"
              >
                <span className="font-bold text-rose-700 block mb-0.5">
                  💡 Memory Note:
                </span>
                {currentQ.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-sm"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'See Results 🏆'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (() => {
        const matchingTier = resultTiers?.find(
          (t) => score >= t.minScore && score <= t.maxScore
        );

        const isPerfect = questions.length > 0 && score === questions.length;
        const defaultTitle = isPerfect ? 'Official Soulmate Certificate! 🏆' : 'Quiz Completed! ❤️';
        const defaultSubtitle = isPerfect ? 'Passed with Flying Colors!' : `You got ${score} out of ${questions.length} correct!`;
        const defaultMessage = `You scored {score} / {total}! You officially hold the title of Inside Joke Champion & Best Girlfriend Ever! ❤️`;

        const title = matchingTier?.title || defaultTitle;
        const subtitle = matchingTier?.subtitle || defaultSubtitle;
        const rawMessage = matchingTier?.message || defaultMessage;
        const message = rawMessage
          .replace(/\{score\}/g, String(score))
          .replace(/\{total\}/g, String(questions.length));
        const imageUrl = matchingTier?.imageUrl;
        const badgeEmoji = matchingTier?.badgeEmoji || (isPerfect ? '🏆' : '❤️');

        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 text-center shadow-xl shadow-rose-100/60 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-amber-200 text-white text-3xl mb-4">
              {badgeEmoji && badgeEmoji.trim().length <= 4 ? badgeEmoji : <Award className="w-10 h-10" />}
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-4">
                {subtitle}
              </p>
            )}

            {/* Optional Result Picture */}
            {imageUrl && (
              <div className="my-5 rounded-2xl overflow-hidden border-2 border-rose-200 max-h-64 shadow-md bg-slate-100">
                <img
                  src={imageUrl}
                  alt="Result picture"
                  className="w-full h-full object-cover max-h-64 hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            )}

            <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium whitespace-pre-line">
              {message}
            </p>

            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 mx-auto text-xs shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </motion.div>
        );
      })()}
    </section>
  );
};
