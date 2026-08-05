import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Calendar, Heart, X, ZoomIn } from 'lucide-react';
import { Memory } from '../types';
import { soundFX } from '../utils/soundEffects';

interface MemoryTimelineProps {
  memories: Memory[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Camera className="w-3.5 h-3.5 text-rose-500" />
          Our Memory Lane
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Snapshots of Us 📸
        </h2>
        <p className="text-sm text-slate-600">
          From the early dates to today—every moment with you is my favorite.
        </p>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {memories.map((mem, idx) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -6, rotate: idx % 2 === 0 ? -1.5 : 1.5 }}
            onClick={() => {
              soundFX.playPop();
              setSelectedMemory(mem);
            }}
            className="bg-white rounded-2xl p-3 pb-5 border border-slate-200/80 shadow-lg shadow-rose-100/40 cursor-pointer group transition-all relative overflow-hidden"
          >
            {/* Washi Tape Accent */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-200/60 rotate-1 rounded-xs shadow-xs z-10 pointer-events-none" />

            {/* Photo Frame */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn className="w-8 h-8" />
              </div>
            </div>

            {/* Caption */}
            <div className="px-1">
              <div className="flex items-center justify-between text-[11px] text-rose-600 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-400" />
                  {mem.date}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px]">
                  {mem.tag}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 line-clamp-1">
                {mem.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-normal font-sans">
                {mem.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 mb-4 shadow-md">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-600 font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedMemory.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {selectedMemory.tag}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-800">
                  {selectedMemory.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {selectedMemory.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  Precious Memory
                </span>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Close Photo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
