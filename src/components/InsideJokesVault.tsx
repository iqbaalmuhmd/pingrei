import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Sparkles, Plus, MapPin, Tag, RefreshCw, X, Check } from 'lucide-react';
import { InsideJoke } from '../types';
import { soundFX } from '../utils/soundEffects';

interface InsideJokesVaultProps {
  jokes: InsideJoke[];
  onAddJokeClick: () => void;
  onUpdateJokes?: (updatedJokes: InsideJoke[]) => void;
}

export const InsideJokesVault: React.FC<InsideJokesVaultProps> = ({
  jokes,
  onAddJokeClick,
  onUpdateJokes,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [addingTagForJokeId, setAddingTagForJokeId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');

  // Collect all unique tags dynamically from jokes
  const allUniqueTags = Array.from(
    new Set(
      jokes.flatMap((j) =>
        j.tags && j.tags.length > 0
          ? j.tags
          : [j.category ? j.category.replace('-', ' ') : 'silly']
      )
    )
  );

  const filteredJokes =
    selectedCategory === 'all'
      ? jokes
      : jokes.filter((j) => {
          const jokeTags =
            j.tags && j.tags.length > 0
              ? j.tags
              : [j.category ? j.category.replace('-', ' ') : 'silly'];
          return (
            j.category === selectedCategory ||
            j.category.replace('-', ' ') === selectedCategory ||
            jokeTags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())
          );
        });

  const toggleFlip = (id: string) => {
    soundFX.playPop();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addReaction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playHeartSound();
    setReactions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddTagSubmit = (jokeId: string) => {
    const trimmed = newTagInput.trim();
    if (!trimmed) {
      setAddingTagForJokeId(null);
      return;
    }

    soundFX.playChime();
    const updated = jokes.map((j) => {
      if (j.id === jokeId) {
        const existingTags = j.tags && j.tags.length > 0 ? j.tags : [j.category ? j.category.replace('-', ' ') : 'silly'];
        if (existingTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
          return j;
        }
        return {
          ...j,
          tags: [...existingTags, trimmed],
        };
      }
      return j;
    });

    if (onUpdateJokes) {
      onUpdateJokes(updated);
    }
    setAddingTagForJokeId(null);
    setNewTagInput('');
  };

  const handleRemoveTag = (jokeId: string, tagToRemove: string) => {
    soundFX.playPop();
    const updated = jokes.map((j) => {
      if (j.id === jokeId) {
        const existingTags = j.tags && j.tags.length > 0 ? j.tags : [j.category ? j.category.replace('-', ' ') : 'silly'];
        return {
          ...j,
          tags: existingTags.filter((t) => t !== tagToRemove),
        };
      }
      return j;
    });

    if (onUpdateJokes) {
      onUpdateJokes(updated);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
          <Smile className="w-3.5 h-3.5 text-rose-500" />
          The Secret Vault of
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Our Favorite Inside Jokes 🤫
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Tap any memory card to reveal the story & punchline! Add or remove custom tags on any joke.
        </p>

        {/* Dynamic Category/Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            onClick={() => {
              soundFX.playPop();
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 shadow-xs'
            }`}
          >
            All Jokes 🌟 ({jokes.length})
          </button>

          {allUniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                soundFX.playPop();
                setSelectedCategory(tag);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer capitalize ${
                selectedCategory === tag
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                  : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 shadow-xs'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Inside Joke Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredJokes.map((joke) => {
            const isFlipped = !!flippedCards[joke.id];
            const reactionCount = reactions[joke.id] || 0;
            const jokeTags =
              joke.tags && joke.tags.length > 0
                ? joke.tags
                : [joke.category ? joke.category.replace('-', ' ') : 'silly'];

            return (
              <motion.div
                key={joke.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="perspective-1000"
              >
                <div
                  onClick={() => toggleFlip(joke.id)}
                  className="w-full min-h-[300px] bg-white rounded-3xl border border-rose-100/90 shadow-lg shadow-rose-100/50 hover:shadow-xl transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1"
                >
                  {/* Subtle card top gradient */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300" />

                  {/* FRONT or REVEALED View */}
                  <div>
                    {/* Top Row: Tags list & Add Tag input */}
                    <div
                      className="flex flex-wrap items-center gap-1.5 mb-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {jokeTags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs"
                        >
                          <Tag className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                          <span className="capitalize">{t}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(joke.id, t);
                            }}
                            className="ml-0.5 p-0.5 text-rose-400 hover:text-red-600 rounded-full hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Remove tag"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}

                      {addingTagForJokeId === joke.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTagSubmit(joke.id);
                          }}
                          className="inline-flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="New tag..."
                            autoFocus
                            className="w-20 px-2 py-0.5 text-[11px] bg-white border border-rose-300 rounded-full font-medium focus:outline-none focus:ring-1 focus:ring-rose-400"
                          />
                          <button
                            type="submit"
                            className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-[10px] font-bold cursor-pointer"
                            title="Add tag"
                          >
                            <Check className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddingTagForJokeId(null);
                              setNewTagInput('');
                            }}
                            className="p-1 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full text-[10px] font-bold cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddingTagForJokeId(joke.id);
                            setNewTagInput('');
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Add new tag to this joke"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Add Tag</span>
                        </button>
                      )}
                    </div>

                    {/* Image / Banner (if available) */}
                    {joke.imageUrl && (
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-inner">
                        <img
                          src={joke.imageUrl}
                          alt={joke.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-medium flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{joke.dateOrLocation || 'Our Memory'}</span>
                        </div>
                      </div>
                    )}

                    {/* Emoji + Title */}
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-2xl">{joke.emoji || '🤪'}</span>
                      <h3 className="text-lg font-bold text-slate-800 leading-snug">
                        {joke.title}
                      </h3>
                    </div>

                    {/* Story / Description */}
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {joke.story}
                    </p>

                    {/* Punchline (Revealed on flip / toggle) */}
                    <AnimatePresence>
                      {isFlipped && joke.punchline && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: 5 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-3 bg-rose-50/90 border border-rose-200 rounded-2xl text-xs font-medium text-rose-900 leading-relaxed"
                        >
                          <span className="font-bold text-rose-700 block mb-0.5">
                            💥 Punchline / Takeaway:
                          </span>
                          {joke.punchline}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Bottom: Simple status & Reaction Button */}
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-400" />
                      Tap card to flip
                    </span>

                    {/* Interactive Laugh Reaction Counter */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => addReaction(joke.id, e)}
                        className="px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center gap-1 transition-transform active:scale-125 cursor-pointer"
                        title="React to this memory"
                      >
                        <span>😂</span>
                        {reactionCount > 0 && <span>+{reactionCount}</span>}
                      </button>

                      <button
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        title="Flip card for punchline"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
