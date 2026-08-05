export type ThemeColor = 'natural' | 'rose' | 'lavender' | 'sunset' | 'midnight';

export interface InsideJoke {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  story: string;
  punchline?: string;
  dateOrLocation?: string;
  jokeMeter?: number;
  emoji: string;
  imageUrl?: string;
  soundType?: 'laugh' | 'ta-da' | 'pop' | 'gasp' | 'squeak' | 'applause';
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  tag: string;
  insideJokeRef?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
  audioUrl?: string; // Voice note audio URL or base64 recording
}

export interface QuizResultTier {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  subtitle?: string;
  message: string;
  imageUrl?: string;
  badgeEmoji?: string;
}

export interface SecretLetter {
  id: string;
  title: string;
  date?: string;
  body: string;
  ps?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface BirthdayConfig {
  herName: string;
  boyfriendName: string;
  birthDate: string; // YYYY-MM-DD
  relationshipStartDate: string; // YYYY-MM-DD
  
  // Passcode Settings
  passcode: string;
  passcodeHint: string;
  securityQuestion?: string;
  securityAnswer?: string;
  
  // Custom Content
  mainTitle: string;
  subtitle: string;
  loveLetterTitle: string;
  loveLetterBody: string;
  loveLetterPS: string;
  
  insideJokes: InsideJoke[];
  memories: Memory[];
  quizQuestions: QuizQuestion[];
  quizResultTiers?: QuizResultTier[];
  secretLetters?: SecretLetter[];
  reasonsToLove: string[];
  
  theme: ThemeColor;
  bgMusicEnabled: boolean;
}
