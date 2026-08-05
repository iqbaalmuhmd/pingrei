import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Sparkles, Lock, Smile, Mail, Camera, HelpCircle, Plus, Trash2, RotateCcw, Check, Image as ImageIcon, MapPin, Edit3, Mic, Square, Play, Volume2, Award, Tag, Upload } from 'lucide-react';
import { BirthdayConfig, InsideJoke, Memory, QuizQuestion, QuizResultTier, SecretLetter } from '../types';
import { soundFX } from '../utils/soundEffects';

interface CreatorModalProps {
  config: BirthdayConfig;
  onSave: (updatedConfig: BirthdayConfig) => void;
  onReset: () => void;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({
  config,
  onSave,
  onReset,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'jokes' | 'letter' | 'memories' | 'quiz'>('general');
  const [formData, setFormData] = useState<BirthdayConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Joke state
  const [newJokeTitle, setNewJokeTitle] = useState('');
  const [newJokeStory, setNewJokeStory] = useState('');
  const [newJokePunchline, setNewJokePunchline] = useState('');
  const [newJokeCategory, setNewJokeCategory] = useState<InsideJoke['category']>('silly');
  const [newJokeEmoji, setNewJokeEmoji] = useState('🤪');
  const [newJokeImageUrl, setNewJokeImageUrl] = useState('');
  const [newJokeLocation, setNewJokeLocation] = useState('');

  // Editing Joke state
  const [editingJokeId, setEditingJokeId] = useState<string | null>(null);

  // New Quiz Question state
  const [newQText, setNewQText] = useState('');
  const [newQImage, setNewQImage] = useState('');
  const [newQAudio, setNewQAudio] = useState('');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState('');

  // Mic recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Editing Quiz state
  const [editingQId, setEditingQId] = useState<string | null>(null);

  // Quiz Result Tiers state
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [newTierMin, setNewTierMin] = useState<number>(8);
  const [newTierMax, setNewTierMax] = useState<number>(8);
  const [newTierTitle, setNewTierTitle] = useState<string>('');
  const [newTierSubtitle, setNewTierSubtitle] = useState<string>('');
  const [newTierMessage, setNewTierMessage] = useState<string>('');
  const [newTierImage, setNewTierImage] = useState<string>('');
  const [newTierEmoji, setNewTierEmoji] = useState<string>('🏆');

  // Secret Letters Collection state
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [newLetterTitle, setNewLetterTitle] = useState('');
  const [newLetterDate, setNewLetterDate] = useState('August 28, 2026');
  const [newLetterBody, setNewLetterBody] = useState('');
  const [newLetterPS, setNewLetterPS] = useState('');
  const [newLetterImage, setNewLetterImage] = useState('');
  const [newLetterAudio, setNewLetterAudio] = useState('');

  // New Memory Lane state
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDate, setNewMemDate] = useState('August 2026');
  const [newMemTag, setNewMemTag] = useState('First Date');
  const [newMemDesc, setNewMemDesc] = useState('');
  const [newMemImage, setNewMemImage] = useState('');

  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        soundFX.playPop();
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const presetJokeImages = [
    { label: 'Moon 🌙', url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Love 💖', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cake 🎂', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80' },
    { label: 'Night 🌌', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80' },
    { label: 'Food 🍜', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
    { label: 'Flowers 💐', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleSave = () => {
    soundFX.playChime();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleAddJoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJokeTitle.trim() || !newJokeStory.trim()) return;

    soundFX.playPop();
    const initialTags = newJokeLocation.trim()
      ? [newJokeCategory.replace('-', ' '), newJokeLocation.trim()]
      : [newJokeCategory.replace('-', ' ')];

    const createdJoke: InsideJoke = {
      id: 'joke-' + Date.now(),
      title: newJokeTitle,
      story: newJokeStory,
      punchline: newJokePunchline,
      category: newJokeCategory,
      tags: initialTags,
      emoji: newJokeEmoji || '🤪',
      imageUrl: newJokeImageUrl.trim() || undefined,
      dateOrLocation: newJokeLocation.trim() || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      insideJokes: [createdJoke, ...prev.insideJokes],
    }));

    setNewJokeTitle('');
    setNewJokeStory('');
    setNewJokePunchline('');
    setNewJokeImageUrl('');
    setNewJokeLocation('');
  };

  const handleDeleteJoke = (id: string) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      insideJokes: prev.insideJokes.filter((j) => j.id !== id),
    }));
  };

  const handleUpdateJoke = (jokeId: string, updatedFields: Partial<InsideJoke>) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      insideJokes: prev.insideJokes.map((joke) =>
        joke.id === jokeId ? { ...joke, ...updatedFields } : joke
      ),
    }));
  };

  const startRecordingVoiceNote = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setNewQAudio(reader.result as string);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      soundFX.playPop();
    } catch (err) {
      alert('Microphone access unavailable or denied. You can also paste an audio link or type a voice prompt!');
    }
  };

  const stopRecordingVoiceNote = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      soundFX.playChime();
    }
  };

  const handleAddQuizQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    soundFX.playChime();
    const newQuestion: QuizQuestion = {
      id: 'quiz-' + Date.now(),
      question: newQText.trim(),
      options: newQOptions.map((opt, idx) => opt.trim() || `Option ${idx + 1}`),
      correctIndex: newQCorrect,
      explanation: newQExplanation.trim() || 'A sweet memory we share together!',
      imageUrl: newQImage.trim() || undefined,
      audioUrl: newQAudio.trim() || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      quizQuestions: [...prev.quizQuestions, newQuestion],
    }));

    setNewQText('');
    setNewQImage('');
    setNewQAudio('');
    setNewQOptions(['', '', '', '']);
    setNewQCorrect(0);
    setNewQExplanation('');
  };

  const handleDeleteQuizQuestion = (id: string) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      quizQuestions: prev.quizQuestions.filter((q) => q.id !== id),
    }));
  };

  const handleUpdateQuizQuestion = (qId: string, updatedFields: Partial<QuizQuestion>) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      quizQuestions: prev.quizQuestions.map((q) =>
        q.id === qId ? { ...q, ...updatedFields } : q
      ),
    }));
  };

  const handleAddResultTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierTitle.trim() || !newTierMessage.trim()) return;

    soundFX.playChime();
    const newTier: QuizResultTier = {
      id: 'tier-' + Date.now(),
      minScore: Number(newTierMin),
      maxScore: Number(newTierMax),
      title: newTierTitle.trim(),
      subtitle: newTierSubtitle.trim() || undefined,
      message: newTierMessage.trim(),
      imageUrl: newTierImage.trim() || undefined,
      badgeEmoji: newTierEmoji.trim() || '🏆',
    };

    setFormData((prev) => ({
      ...prev,
      quizResultTiers: [...(prev.quizResultTiers || []), newTier],
    }));

    setNewTierTitle('');
    setNewTierSubtitle('');
    setNewTierMessage('');
    setNewTierImage('');
    setNewTierEmoji('🏆');
  };

  const handleDeleteResultTier = (id: string) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      quizResultTiers: (prev.quizResultTiers || []).filter((t) => t.id !== id),
    }));
  };

  const handleUpdateResultTier = (tierId: string, updatedFields: Partial<QuizResultTier>) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      quizResultTiers: (prev.quizResultTiers || []).map((t) =>
        t.id === tierId ? { ...t, ...updatedFields } : t
      ),
    }));
  };

  const handleAddSecretLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetterTitle.trim() || !newLetterBody.trim()) return;

    soundFX.playChime();
    const newLetter: SecretLetter = {
      id: 'letter-' + Date.now(),
      title: newLetterTitle.trim(),
      date: newLetterDate.trim() || undefined,
      body: newLetterBody.trim(),
      ps: newLetterPS.trim() || undefined,
      imageUrl: newLetterImage.trim() || undefined,
      audioUrl: newLetterAudio.trim() || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      secretLetters: [...(prev.secretLetters || []), newLetter],
    }));

    setNewLetterTitle('');
    setNewLetterDate('August 28, 2026');
    setNewLetterBody('');
    setNewLetterPS('');
    setNewLetterImage('');
    setNewLetterAudio('');
  };

  const handleDeleteSecretLetter = (id: string) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      secretLetters: (prev.secretLetters || []).filter((l) => l.id !== id),
    }));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemTitle.trim() || !newMemImage.trim()) return;

    soundFX.playPop();
    const newMem: Memory = {
      id: 'mem-' + Date.now(),
      title: newMemTitle.trim(),
      date: newMemDate.trim() || 'August 2026',
      tag: newMemTag.trim() || 'Memories',
      description: newMemDesc.trim() || 'A sweet memory together ❤️',
      imageUrl: newMemImage.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
    }));

    setNewMemTitle('');
    setNewMemDesc('');
    setNewMemImage('');
  };

  const handleDeleteMemory = (id: string) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateSecretLetter = (letterId: string, updatedFields: Partial<SecretLetter>) => {
    soundFX.playPop();
    setFormData((prev) => ({
      ...prev,
      secretLetters: (prev.secretLetters || []).map((letItem) =>
        letItem.id === letterId ? { ...letItem, ...updatedFields } : letItem
      ),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">
                Customize Birthday Site ✏️
              </h3>
              <p className="text-xs text-rose-100">
                Personalize passcode, inside jokes, letter & memories for your girlfriend!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto shrink-0 text-xs font-bold text-slate-600">
          {[
            { id: 'general', label: 'Passcode & Names 🔒', icon: Lock },
            { id: 'jokes', label: 'Inside Jokes 🤫', icon: Smile },
            { id: 'quiz', label: 'Quiz 🎯', icon: HelpCircle },
            { id: 'letter', label: 'Secret Letters 💌', icon: Mail },
            { id: 'memories', label: 'Photo Gallery 📸', icon: Camera },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playPop();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-rose-600 border-t-2 border-rose-500 shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Girlfriend's Name
                  </label>
                  <input
                    type="text"
                    value={formData.herName}
                    onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Boyfriend)
                  </label>
                  <input
                    type="text"
                    value={formData.boyfriendName}
                    onChange={(e) => setFormData({ ...formData, boyfriendName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>Vault Passcode & Security Settings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secret Passcode
                    </label>
                    <input
                      type="text"
                      value={formData.passcode}
                      onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                      placeholder="e.g. 0514 or pizza"
                      className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl font-mono font-bold text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Relationship Start Date (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={formData.relationshipStartDate}
                      onChange={(e) => setFormData({ ...formData, relationshipStartDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passcode Hint (Shown when she clicks "Need a hint?")
                  </label>
                  <input
                    type="text"
                    value={formData.passcodeHint}
                    onChange={(e) => setFormData({ ...formData, passcodeHint: e.target.value })}
                    placeholder="e.g. The month and day we met!"
                    className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alternative Security Question
                    </label>
                    <input
                      type="text"
                      value={formData.securityQuestion || ''}
                      onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                      placeholder="e.g. What is our favorite takeout food?"
                      className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Security Answer (Case-insensitive)
                    </label>
                    <input
                      type="text"
                      value={formData.securityAnswer || ''}
                      onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                      placeholder="e.g. pizza"
                      className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jokes' && (
            <div className="space-y-6">
              {/* Form to add new inside joke */}
              <form onSubmit={handleAddJoke} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-rose-500" />
                  <span>Add New Inside Joke</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newJokeTitle}
                      onChange={(e) => setNewJokeTitle(e.target.value)}
                      placeholder="Joke Title (e.g. The 2 AM Noodle Incident)"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <select
                      value={newJokeCategory}
                      onChange={(e) => setNewJokeCategory(e.target.value as InsideJoke['category'])}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <option value="silly">Silly Moment 🤪</option>
                      <option value="secret-code">Secret Code 🥔</option>
                      <option value="epic-fail">Epic Fail 🙈</option>
                      <option value="food">Food & Snacks 🍜</option>
                      <option value="travel">Roadtrip 🚗</option>
                      <option value="cute">Cute 🥺</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={newJokeStory}
                  onChange={(e) => setNewJokeStory(e.target.value)}
                  placeholder="The story behind this inside joke..."
                  rows={2}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newJokePunchline}
                    onChange={(e) => setNewJokePunchline(e.target.value)}
                    placeholder="Punchline or funny takeaway..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newJokeLocation}
                      onChange={(e) => setNewJokeLocation(e.target.value)}
                      placeholder="Location/Tag (e.g. Late Night Date)"
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <input
                      type="text"
                      value={newJokeEmoji}
                      onChange={(e) => setNewJokeEmoji(e.target.value)}
                      placeholder="Emoji"
                      className="w-16 px-2 py-2 bg-white border border-slate-200 rounded-xl text-center text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                {/* Picture URL Section */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                      <span>Picture URL (Optional)</span>
                    </label>
                    {newJokeImageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewJokeImageUrl('')}
                        className="text-[10px] text-rose-600 hover:underline font-bold"
                      >
                        Clear URL
                      </button>
                    )}
                  </div>

                  <input
                    type="url"
                    value={newJokeImageUrl}
                    onChange={(e) => setNewJokeImageUrl(e.target.value)}
                    placeholder="Paste image web link (e.g. https://images.unsplash.com/...)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />

                  {/* Preset quick image choices */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Photos:</span>
                    {presetJokeImages.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewJokeImageUrl(p.url)}
                        className="px-2 py-0.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {newJokeImageUrl && (
                    <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border-2 border-rose-200 bg-slate-100 shadow-xs">
                      <img
                        src={newJokeImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold py-0.5">
                        Image Preview
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Inside Joke to Vault</span>
                </button>
              </form>

              {/* Current List of Inside Jokes with Edit & Picture URL controls */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Inside Jokes ({formData.insideJokes.length})
                </p>
                {formData.insideJokes.map((joke) => {
                  const isEditing = editingJokeId === joke.id;

                  if (isEditing) {
                    return (
                      <div key={joke.id} className="p-4 bg-rose-50/80 border-2 border-rose-300 rounded-2xl space-y-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-rose-500" /> Editing Joke: {joke.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingJokeId(null)}
                            className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={joke.title}
                            onChange={(e) => handleUpdateJoke(joke.id, { title: e.target.value })}
                            placeholder="Title"
                            className="sm:col-span-2 px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={joke.emoji}
                            onChange={(e) => handleUpdateJoke(joke.id, { emoji: e.target.value })}
                            placeholder="Emoji"
                            className="px-2 py-1.5 bg-white border border-rose-200 rounded-xl text-xs text-center font-bold"
                          />
                        </div>

                        <textarea
                          value={joke.story}
                          onChange={(e) => handleUpdateJoke(joke.id, { story: e.target.value })}
                          placeholder="Story"
                          rows={2}
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                        />

                        <input
                          type="text"
                          value={joke.punchline || ''}
                          onChange={(e) => handleUpdateJoke(joke.id, { punchline: e.target.value })}
                          placeholder="Punchline"
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                        />

                        {/* Image URL input for this joke */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-rose-500" />
                            Picture URL
                          </label>
                          <input
                            type="url"
                            value={joke.imageUrl || ''}
                            onChange={(e) => handleUpdateJoke(joke.id, { imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            Location or Date Tag
                          </label>
                          <input
                            type="text"
                            value={joke.dateOrLocation || ''}
                            onChange={(e) => handleUpdateJoke(joke.id, { dateOrLocation: e.target.value })}
                            placeholder="e.g. Under the Starlit Sky"
                            className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-rose-500" />
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            value={(joke.tags && joke.tags.length > 0 ? joke.tags : [joke.category ? joke.category.replace('-', ' ') : 'silly']).join(', ')}
                            onChange={(e) => {
                              const tagList = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              handleUpdateJoke(joke.id, { tags: tagList });
                            }}
                            placeholder="e.g. Silly, Late Night, Moon"
                            className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-medium"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingJokeId(null)}
                          className="w-full py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors cursor-pointer"
                        >
                          Done Editing
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={joke.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-rose-200 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {joke.imageUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <img src={joke.imageUrl} alt={joke.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 text-xl">
                            {joke.emoji}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-slate-800 text-sm truncate">{joke.title}</h5>
                            {joke.imageUrl && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold shrink-0">
                                🖼️ Photo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{joke.story}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingJokeId(joke.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Picture & Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJoke(joke.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Joke"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {/* Form to Add New Quiz Question */}
              <form onSubmit={handleAddQuizQuestion} className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-rose-500" />
                    <span>Add New Quiz Question</span>
                  </h4>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    Supports Pictures & Voice Notes
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Prompt
                  </label>
                  <input
                    type="text"
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="e.g., Where was our very first date?"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                {/* Picture URL Section */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                      <span>Quiz Picture / Photo Hint (Optional)</span>
                    </label>
                    <label className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], setNewQImage);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="url"
                    value={newQImage}
                    onChange={(e) => setNewQImage(e.target.value)}
                    placeholder="Paste image URL or click Upload Image File above"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />

                  {/* Quick Photo Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Photos:</span>
                    {presetJokeImages.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewQImage(p.url)}
                        className="px-2 py-0.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {newQImage && (
                    <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border-2 border-rose-200 bg-slate-100 shadow-xs">
                      <img
                        src={newQImage}
                        alt="Quiz preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-bold py-0.5">
                        Photo Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Voice Note / Audio Question Section */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Mic className="w-3.5 h-3.5 text-rose-500" />
                    <span>Voice Note Question / Audio (Optional)</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Live Recorder Button */}
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecordingVoiceNote}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Record Mic Voice Note</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecordingVoiceNote}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 animate-pulse transition-all shadow-md cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Recording (Recording...)</span>
                      </button>
                    )}

                    {/* File Upload Button */}
                    <label className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-indigo-200 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Voice Note File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], setNewQAudio);
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Or paste audio URL */}
                    <input
                      type="text"
                      value={newQAudio}
                      onChange={(e) => setNewQAudio(e.target.value)}
                      placeholder="Or paste audio URL / voice text"
                      className="flex-1 min-w-[180px] px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />

                    {newQAudio && (
                      <button
                        type="button"
                        onClick={() => {
                          const a = new Audio(newQAudio);
                          a.play().catch(() => alert('Testing audio...'));
                        }}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-all cursor-pointer"
                        title="Test Play Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {newQAudio && (
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Voice note audio attached!
                    </p>
                  )}
                </div>

                {/* 4 Answer Options */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Answer Options (Click button to choose correct answer)</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newQOptions.map((opt, idx) => {
                      const isCorrect = newQCorrect === idx;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              soundFX.playPop();
                              setNewQCorrect(idx);
                            }}
                            className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                            }`}
                            title="Set as correct answer"
                          >
                            <input
                              type="radio"
                              name="newCorrectAnswer"
                              checked={isCorrect}
                              onChange={() => setNewQCorrect(idx)}
                              className="hidden"
                            />
                            <span>{isCorrect ? '✓ Correct Answer' : `Option ${idx + 1}`}</span>
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...newQOptions];
                              updated[idx] = e.target.value;
                              setNewQOptions(updated);
                            }}
                            placeholder={`Type option ${idx + 1} text...`}
                            className="flex-1 bg-transparent border-none text-xs focus:outline-none font-medium"
                            required
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Memory Note / Explanation
                  </label>
                  <input
                    type="text"
                    value={newQExplanation}
                    onChange={(e) => setNewQExplanation(e.target.value)}
                    placeholder="e.g., We ordered warm ramen and stayed till closing!"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question to Quiz</span>
                </button>
              </form>

              {/* Existing Quiz Questions List */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Quiz Questions ({formData.quizQuestions.length})
                </p>

                {formData.quizQuestions.map((q, qIndex) => {
                  const isEditingThis = editingQId === q.id;

                  if (isEditingThis) {
                    return (
                      <div key={q.id} className="p-4 bg-rose-50/80 border-2 border-rose-300 rounded-2xl space-y-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5 text-rose-500" /> Editing Question #{qIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingQId(null)}
                            className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateQuizQuestion(q.id, { question: e.target.value })}
                          placeholder="Question Text"
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-bold"
                        />

                        {/* Image URL input */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Picture URL</label>
                          <input
                            type="url"
                            value={q.imageUrl || ''}
                            onChange={(e) => handleUpdateQuizQuestion(q.id, { imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-1 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                          />
                        </div>

                        {/* Audio URL input */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Voice Note Audio URL / Data</label>
                          <input
                            type="text"
                            value={q.audioUrl || ''}
                            onChange={(e) => handleUpdateQuizQuestion(q.id, { audioUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-1 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                          />
                        </div>

                        {/* Options */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                            Options (Click button to choose correct answer)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = q.correctIndex === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-center gap-1.5 p-1.5 border rounded-xl text-xs transition-all ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold'
                                      : 'bg-white border-slate-200'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      soundFX.playPop();
                                      handleUpdateQuizQuestion(q.id, { correctIndex: optIdx });
                                    }}
                                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                                    }`}
                                    title="Set as correct answer"
                                  >
                                    {isCorrect ? '✓ Correct' : `Option ${optIdx + 1}`}
                                  </button>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const opts = [...q.options];
                                      opts[optIdx] = e.target.value;
                                      handleUpdateQuizQuestion(q.id, { options: opts });
                                    }}
                                    className="w-full bg-transparent border-none text-xs focus:outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => handleUpdateQuizQuestion(q.id, { explanation: e.target.value })}
                          placeholder="Explanation"
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                        />

                        <button
                          type="button"
                          onClick={() => setEditingQId(null)}
                          className="w-full py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors cursor-pointer"
                        >
                          Done Editing
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-rose-200 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {q.imageUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <img src={q.imageUrl} alt="Quiz" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 font-extrabold text-rose-600 text-sm">
                            #{qIndex + 1}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{q.question}</h5>
                            {q.imageUrl && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold shrink-0">
                                🖼️ Photo
                              </span>
                            )}
                            {q.audioUrl && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold shrink-0">
                                🎙️ Voice
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            Correct Answer: <strong className="text-emerald-700 font-bold">{q.options[q.correctIndex]}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingQId(q.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Question & Picture/Voice"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuizQuestion(q.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SECTION: Custom Result Popup Messages & Pictures Per Score */}
              <div className="pt-6 border-t-2 border-slate-100 space-y-4">
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 border border-amber-200/80 rounded-2xl">
                  <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Custom Quiz Result Messages & Pictures (Based on Score)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Set customized popup titles, messages, and celebration pictures based on how many questions she gets right (e.g. 8 out of 8, 5–7, etc.)! You can use <code className="bg-white/80 px-1 rounded text-rose-700 font-mono font-bold">{"{score}"}</code> and <code className="bg-white/80 px-1 rounded text-rose-700 font-mono font-bold">{"{total}"}</code> in your message text.
                  </p>
                </div>

                {/* Form to Add New Score Message Rule */}
                <form onSubmit={handleAddResultTier} className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-amber-600" /> Add Custom Score Result Rule
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Min Correct</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newTierMin}
                        onChange={(e) => setNewTierMin(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Max Correct</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newTierMax}
                        onChange={(e) => setNewTierMax(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Badge / Emoji</label>
                      <input
                        type="text"
                        value={newTierEmoji}
                        onChange={(e) => setNewTierEmoji(e.target.value)}
                        placeholder="🏆"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Score Title</label>
                      <input
                        type="text"
                        value={newTierTitle}
                        onChange={(e) => setNewTierTitle(e.target.value)}
                        placeholder="Soulmate Champion! 🏆"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Subtitle (Optional)</label>
                    <input
                      type="text"
                      value={newTierSubtitle}
                      onChange={(e) => setNewTierSubtitle(e.target.value)}
                      placeholder="e.g., Flawless Victory!"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  {/* Picture URL for Result */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1 uppercase tracking-wider">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Result Celebration Picture (Optional)</span>
                      </label>
                      {newTierImage && (
                        <button
                          type="button"
                          onClick={() => setNewTierImage('')}
                          className="text-[10px] text-rose-600 hover:underline font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={newTierImage}
                      onChange={(e) => setNewTierImage(e.target.value)}
                      placeholder="Paste picture URL (e.g., https://images.unsplash.com/...)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />

                    {/* Quick presets */}
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Photos:</span>
                      {presetJokeImages.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewTierImage(p.url)}
                          className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {newTierImage && (
                      <div className="mt-1 relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-300 shadow-xs">
                        <img src={newTierImage} alt="Tier preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Popup Result Message</label>
                    <textarea
                      value={newTierMessage}
                      onChange={(e) => setNewTierMessage(e.target.value)}
                      placeholder="e.g. You scored {score}/{total}! You officially hold the title of Best Girlfriend Ever! ❤️"
                      rows={2}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    + Add Result Popup Rule
                  </button>
                </form>

                {/* List of Current Score Result Rules */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Configured Score Rules ({(formData.quizResultTiers || []).length})
                  </p>

                  {(formData.quizResultTiers || []).map((tier) => {
                    const isEditingThisTier = editingTierId === tier.id;

                    if (isEditingThisTier) {
                      return (
                        <div key={tier.id} className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                              <Edit3 className="w-3.5 h-3.5" /> Editing Score Rule ({tier.minScore} - {tier.maxScore})
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingTierId(null)}
                              className="text-xs text-slate-500 font-bold hover:underline"
                            >
                              Done
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">Min Score</label>
                              <input
                                type="number"
                                value={tier.minScore}
                                onChange={(e) => handleUpdateResultTier(tier.id, { minScore: Number(e.target.value) })}
                                className="w-full px-2 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">Max Score</label>
                              <input
                                type="number"
                                value={tier.maxScore}
                                onChange={(e) => handleUpdateResultTier(tier.id, { maxScore: Number(e.target.value) })}
                                className="w-full px-2 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">Emoji</label>
                              <input
                                type="text"
                                value={tier.badgeEmoji || ''}
                                onChange={(e) => handleUpdateResultTier(tier.id, { badgeEmoji: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-amber-200 rounded-lg text-xs text-center font-bold"
                              />
                            </div>
                          </div>

                          <input
                            type="text"
                            value={tier.title}
                            onChange={(e) => handleUpdateResultTier(tier.id, { title: e.target.value })}
                            placeholder="Title"
                            className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold"
                          />

                          <input
                            type="text"
                            value={tier.subtitle || ''}
                            onChange={(e) => handleUpdateResultTier(tier.id, { subtitle: e.target.value })}
                            placeholder="Subtitle"
                            className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs"
                          />

                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Picture URL</label>
                            <input
                              type="url"
                              value={tier.imageUrl || ''}
                              onChange={(e) => handleUpdateResultTier(tier.id, { imageUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-mono"
                            />
                          </div>

                          <textarea
                            value={tier.message}
                            onChange={(e) => handleUpdateResultTier(tier.id, { message: e.target.value })}
                            placeholder="Popup Message"
                            rows={2}
                            className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs"
                          />

                          <button
                            type="button"
                            onClick={() => setEditingTierId(null)}
                            className="w-full py-1.5 bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                          >
                            Save Rule Changes
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={tier.id}
                        className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-amber-300 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {tier.imageUrl ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <img src={tier.imageUrl} alt="Result picture" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-extrabold text-lg">
                              {tier.badgeEmoji || '🏆'}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-full shrink-0">
                                {tier.minScore === tier.maxScore
                                  ? `Score: ${tier.minScore}`
                                  : `Score: ${tier.minScore}–${tier.maxScore}`}
                              </span>
                              <h5 className="font-bold text-slate-800 text-xs truncate">{tier.title}</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{tier.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingTierId(tier.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Result Message & Picture"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResultTier(tier.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Score Rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 border border-rose-200 rounded-2xl">
                <h4 className="font-extrabold text-rose-950 text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span>Secret Love Letter Collection 💌</span>
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Add multiple secret letters! This collection is unlocked when she keeps the 6th and 7th candles lit on her birthday cake.
                </p>
              </div>

              {/* FORM TO ADD NEW SECRET LETTER */}
              <form onSubmit={handleAddSecretLetter} className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-rose-600" /> Add A New Secret Letter
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Letter Title</label>
                    <input
                      type="text"
                      value={newLetterTitle}
                      onChange={(e) => setNewLetterTitle(e.target.value)}
                      placeholder="e.g., Why You Are My Moon 🌙"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Letter Date (Optional)</label>
                    <input
                      type="text"
                      value={newLetterDate}
                      onChange={(e) => setNewLetterDate(e.target.value)}
                      placeholder="e.g., August 28, 2026"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Letter Picture Input & File Upload */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-bold text-slate-700">Letter Picture URL / Upload (Optional)</label>
                    <label className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], setNewLetterImage);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={newLetterImage}
                    onChange={(e) => setNewLetterImage(e.target.value)}
                    placeholder="Paste photo URL or click Upload Photo File above"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* Voice Note Audio Attachment */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                      Voice Note Audio Attachment (Optional)
                    </label>
                    <label className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Voice Note File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], setNewLetterAudio);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newLetterAudio}
                    onChange={(e) => setNewLetterAudio(e.target.value)}
                    placeholder="Voice audio URL or click Upload Voice Note File"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  {newLetterAudio && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Voice note audio attached!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Letter Message / Body</label>
                  <textarea
                    value={newLetterBody}
                    onChange={(e) => setNewLetterBody(e.target.value)}
                    placeholder="Write your sweet love letter here..."
                    rows={5}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">P.S. Note (Optional)</label>
                  <input
                    type="text"
                    value={newLetterPS}
                    onChange={(e) => setNewLetterPS(e.target.value)}
                    placeholder="P.S. I love you to the moon and back!"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Letter to Vault 💌</span>
                </button>
              </form>

              {/* LIST OF CONFIGURED SECRET LETTERS */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Configured Letters in Vault ({(formData.secretLetters || []).length})
                </p>

                {(formData.secretLetters || []).map((letItem, idx) => {
                  const isEditingThisLetter = editingLetterId === letItem.id;

                  if (isEditingThisLetter) {
                    return (
                      <div key={letItem.id} className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5" /> Editing Letter #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingLetterId(null)}
                            className="text-xs text-slate-500 font-bold hover:underline"
                          >
                            Done
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={letItem.title}
                            onChange={(e) => handleUpdateSecretLetter(letItem.id, { title: e.target.value })}
                            placeholder="Title"
                            className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={letItem.date || ''}
                            onChange={(e) => handleUpdateSecretLetter(letItem.id, { date: e.target.value })}
                            placeholder="Date"
                            className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                          />
                        </div>

                        <input
                          type="url"
                          value={letItem.imageUrl || ''}
                          onChange={(e) => handleUpdateSecretLetter(letItem.id, { imageUrl: e.target.value })}
                          placeholder="Image URL"
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                        />

                        <textarea
                          value={letItem.body}
                          onChange={(e) => handleUpdateSecretLetter(letItem.id, { body: e.target.value })}
                          rows={6}
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-serif leading-relaxed"
                        />

                        <input
                          type="text"
                          value={letItem.ps || ''}
                          onChange={(e) => handleUpdateSecretLetter(letItem.id, { ps: e.target.value })}
                          placeholder="P.S."
                          className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                        />

                        <button
                          type="button"
                          onClick={() => setEditingLetterId(null)}
                          className="w-full py-2 bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Save Letter Changes
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={letItem.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-rose-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-extrabold text-sm">
                          💌
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded-full shrink-0">
                              Letter #{idx + 1}
                            </span>
                            <h5 className="font-bold text-slate-800 text-xs truncate">{letItem.title}</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate font-serif">{letItem.body}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingLetterId(letItem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Letter"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSecretLetter(letItem.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Letter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-6">
              {/* Add New Photo Memory Form */}
              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs sm:text-sm">
                  <Camera className="w-4 h-4 text-rose-500" />
                  <span>Add New Photo Memory Lane 📸</span>
                </div>

                <form onSubmit={handleAddMemory} className="space-y-3">
                  {/* Image Upload / URL Box */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Photo Picture / Upload File</label>
                      <label className="text-xs text-rose-600 font-extrabold hover:underline cursor-pointer flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Picture File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], setNewMemImage);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={newMemImage}
                      onChange={(e) => setNewMemImage(e.target.value)}
                      placeholder="Paste Image URL or click Upload Picture File above"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                    />

                    {newMemImage && (
                      <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-rose-200 shadow-2xs">
                        <img src={newMemImage} alt="Memory Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Preview
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Title</label>
                      <input
                        type="text"
                        value={newMemTitle}
                        onChange={(e) => setNewMemTitle(e.target.value)}
                        placeholder="e.g. Sunset Picnic"
                        className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Date</label>
                      <input
                        type="text"
                        value={newMemDate}
                        onChange={(e) => setNewMemDate(e.target.value)}
                        placeholder="e.g. August 2026"
                        className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Tag</label>
                      <input
                        type="text"
                        value={newMemTag}
                        onChange={(e) => setNewMemTag(e.target.value)}
                        placeholder="e.g. Vacation"
                        className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Story / Description</label>
                    <textarea
                      value={newMemDesc}
                      onChange={(e) => setNewMemDesc(e.target.value)}
                      placeholder="Write a sweet story about this memory..."
                      rows={2}
                      className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newMemTitle.trim() || !newMemImage.trim()}
                    className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      newMemTitle.trim() && newMemImage.trim()
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo Memory Card 📸</span>
                  </button>
                </form>
              </div>

              {/* Existing Photo Memories List */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-700">
                  Existing Photo Memories ({formData.memories.length}):
                </p>

                {formData.memories.map((mem, i) => (
                  <div key={mem.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
                      <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                        📸 Memory #{i + 1}: {mem.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Memory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        value={mem.title}
                        onChange={(e) => {
                          const updated = [...formData.memories];
                          updated[i].title = e.target.value;
                          setFormData({ ...formData, memories: updated });
                        }}
                        placeholder="Memory Title"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={mem.date}
                        onChange={(e) => {
                          const updated = [...formData.memories];
                          updated[i].date = e.target.value;
                          setFormData({ ...formData, memories: updated });
                        }}
                        placeholder="Date"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={mem.tag}
                        onChange={(e) => {
                          const updated = [...formData.memories];
                          updated[i].tag = e.target.value;
                          setFormData({ ...formData, memories: updated });
                        }}
                        placeholder="Tag"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={mem.imageUrl}
                        onChange={(e) => {
                          const updated = [...formData.memories];
                          updated[i].imageUrl = e.target.value;
                          setFormData({ ...formData, memories: updated });
                        }}
                        placeholder="Image URL or upload picture file"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                      />
                      <label className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer border border-rose-200 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], (url) => {
                                const updated = [...formData.memories];
                                updated[i].imageUrl = url;
                                setFormData({ ...formData, memories: updated });
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <textarea
                      value={mem.description}
                      onChange={(e) => {
                        const updated = [...formData.memories];
                        updated[i].description = e.target.value;
                        setFormData({ ...formData, memories: updated });
                      }}
                      rows={2}
                      placeholder="Description"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm('Reset everything back to romantic sample templates?')) {
                onReset();
                onClose();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Birthday Site</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
