import { BirthdayConfig } from '../types';

export const defaultBirthdayConfig: BirthdayConfig = {
  herName: 'Pingrei',
  boyfriendName: 'Ingbal',
  birthDate: '2026-08-28',
  relationshipStartDate: '2026-01-10',
  
  passcode: '0110',
  passcodeHint: 'Hint: The day we started dating (0110), or type "moon" 🌙!',
  securityQuestion: 'Who is our beloved mascot watching over us from the night sky?',
  securityAnswer: 'moon',
  
  mainTitle: 'Happy Birthday, My Moon Pingrei! 🌙✨',
  subtitle: 'Welcome to your secret birthday vault built with endless love by Ingbal, under the light of our mascot Moon 🌕',
  
  loveLetterTitle: 'To my dearest Pingrei, my favorite person in the whole universe...',
  loveLetterBody: `My Dearest Pingrei,

Happy Birthday! 🎂🌙

Ever since January 10, 2026, when our story officially began, every single day with you has been filled with warmth, laughter, and magic. When we chose Moon as our mascot, it wasn't just a silly cute symbol—it was a reminder that no matter where we are or how dark the night gets, our love shines bright and stays constant.

You have the sweetest smile, the kindest heart, and a way of making every moment feel cozy and special. Sharing late-night talks, silly jokes, and quiet moments with you is my absolute favorite thing in the world.

I created this secret birthday vault just for you, Pingrei. A safe, magical place to hold our memories, our inside jokes, and 8 glowing candles representing your special birth month of August.

Thank you for being my moon, my light, my best friend, and my whole world. I love you to the moon and back!`,
  loveLetterPS: 'P.S. Ingbal promises to always look up at the moon with you whenever you miss me. 🌙❤️',
  
  insideJokes: [
    {
      id: 'joke-1',
      title: 'Moon Mascot Midnight Pact 🌙',
      category: 'secret-code',
      tags: ['Secret Code', 'Moon Mascot', 'Mascot'],
      story: 'The moment we decided Moon was our official mascot and guardian spirit of our relationship.',
      punchline: 'Now whenever we see a full moon, we have to send a heart emoji within 60 seconds!',
      dateOrLocation: 'Under the Starlit Sky',
      emoji: '🌙',
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'joke-2',
      title: 'January 10 Magic Day ✨',
      category: 'cute',
      tags: ['Cute', 'First Date', 'Anniversary'],
      story: '10th of January 2026—the exact day Ingbal and Pingrei officially became a couple.',
      punchline: 'Best decision of our lives, certified 100% by the Moon!',
      dateOrLocation: 'Special First Date',
      emoji: '💖',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'joke-3',
      title: 'The August 8th Candle Mystery 🕯️',
      category: 'silly',
      tags: ['Silly', 'Birthday', 'Candles'],
      story: 'Why 8 candles on the cake? Because August is the 8th month, the luckiest month for Pingrei\'s birthday!',
      punchline: 'One big wish for each candle, plus a bonus wish for Moon!',
      dateOrLocation: 'Birthday Cake Table',
      emoji: '🎂',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'joke-4',
      title: 'Late Night Moon Whispers 🌌',
      category: 'travel',
      tags: ['Roadtrips', 'Late Night', 'Secrets'],
      story: 'Staying up way past our bedtime talking about our dreams, future trips, and silly secrets.',
      punchline: 'Who needs sleep when staying awake with Pingrei is a dream come true?',
      dateOrLocation: 'Cozy Late Night Calls',
      emoji: '🌕',
      imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'joke-5',
      title: 'The "Who Loves Who More" Debate 🏆',
      category: 'silly',
      tags: ['Silly', 'Debate', 'Moon Love'],
      story: 'Ingbal says "I love you more", Pingrei says "No, I love you to the moon and back!"',
      punchline: 'Spoiler: The Moon ruled it a perfect tie!',
      dateOrLocation: 'Every Single Day',
      emoji: '🚀',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    },
  ],
  
  memories: [
    {
      id: 'mem-1',
      title: 'The Day We Started Dating 💑',
      date: 'January 10, 2026',
      description: 'The beginning of Ingbal & Pingrei! The day two hearts aligned under the winter moon.',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
      tag: 'Anniversary',
    },
    {
      id: 'mem-2',
      title: 'Adopted Moon as Our Mascot 🌙',
      date: '2026',
      description: 'We chose the gentle glowing Moon to represent our everlasting love and night-time cuddles.',
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
      tag: 'Mascot',
    },
    {
      id: 'mem-3',
      title: 'Counting Down to August 28th 🎂',
      date: 'August 28, 2026',
      description: 'Pingrei\'s special day! 8 glowing candles on the cake to celebrate 8 months of sheer happiness.',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      tag: 'Birthday',
    },
  ],
  
  quizQuestions: [
    {
      id: 'q1',
      question: 'When did Ingbal and Pingrei officially start dating?',
      options: ['January 10, 2026', 'February 14, 2026', 'August 28, 2026', 'At the dawn of time'],
      correctIndex: 0,
      explanation: 'Correct! January 10, 2026 was the magic day our journey began!',
    },
    {
      id: 'q2',
      question: 'What is our official mascot chosen to guard our relationship?',
      options: ['A golden retriever', 'The Moon 🌙', 'A fluffy panda', 'A giant coffee cup'],
      correctIndex: 1,
      explanation: 'Yes! Moon 🌙 is our mascot, keeping us cozy and connected!',
    },
    {
      id: 'q3',
      question: 'Why are there 8 candles on Pingrei\'s birthday cake?',
      options: ['She turned 8 years old', 'August is the 8th month of the year!', '8 is the infinity sign standing up', 'Because 8 candles look extra romantic'],
      correctIndex: 1,
      explanation: 'August is month #8! 8 candles for 8 months of sweet love and her August birthday!',
    },
    {
      id: 'q4',
      question: 'How much does Ingbal love Pingrei?',
      options: ['To the moon and back 🌙', 'More than all stars in the galaxy ✨', 'Infinite & beyond 🚀', 'All of the above! ❤️'],
      correctIndex: 3,
      explanation: 'All of the above! Ingbal loves Pingrei beyond measure!',
    },
  ],
  
  quizResultTiers: [
    {
      id: 'tier-perfect',
      minScore: 8,
      maxScore: 8,
      title: 'Official Soulmate Certificate! 🏆',
      subtitle: 'Flawless 100% Victory! 👑',
      message: 'You scored {score} out of {total}! You know every single secret memory, inside joke, and special detail of our love story! You officially hold the title of Best Girlfriend Ever! ❤️',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      badgeEmoji: '🏆',
    },
    {
      id: 'tier-high',
      minScore: 5,
      maxScore: 7,
      title: 'Almost Perfect Soulmate! 💖',
      subtitle: 'Incredible Memory! ✨',
      message: 'You scored {score} out of {total}! You know our relationship so well! Just a tiny silly mistake, but you still win my whole heart!',
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
      badgeEmoji: '✨',
    },
    {
      id: 'tier-medium',
      minScore: 1,
      maxScore: 4,
      title: 'A For Effort, My Love! 😂',
      subtitle: 'We Need More Date Nights! 🍜',
      message: 'You scored {score} out of {total}! Looks like somebody needs a cozy date night refresher course with Ingbal! I still love you endlessly!',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      badgeEmoji: '🥰',
    },
    {
      id: 'tier-zero',
      minScore: 0,
      maxScore: 0,
      title: 'Did You Guess Blindfolded? 🤪',
      subtitle: 'Zero Correct, But Infinite Love! 💖',
      message: 'You scored {score} out of {total}! Haha, did you close your eyes? Don\'t worry, your prize is still endless kisses and hugs!',
      imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
      badgeEmoji: '🤪',
    },
  ],

  secretLetters: [
    {
      id: 'letter-1',
      title: 'To My Favorite Human On Her Birthday 💌',
      date: 'August 28, 2026',
      body: `Dearest Pingrei,\n\nHappy Birthday, my love! Words could never truly express how deeply blessed I am to have you in my life.\n\nFrom the moment January 10th rolled around, my world changed in the sweetest ways possible. You bring so much light, warmth, and laughter into my days.\n\nThank you for every smile, every quiet moment, and every sweet memory we share. You are my greatest joy, my calm in every storm, and my absolute favorite person in the entire universe.`,
      ps: 'P.S. You unlocked this secret letter collection by keeping the 6th and 7th candles glowing! I love you! ❤️',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'letter-2',
      title: 'Why You Are My Moon 🌙',
      date: 'August 2026',
      body: `My Dearest Pingrei,\n\nWhenever I look up at the night sky and see Moon glowing softly, I am immediately reminded of you.\n\nNo matter how dark or tough a day can be, your presence is a gentle, soothing light. You make everything feel calm, beautiful, and safe.\n\nThank you for being my anchor and my inspiration. I promise to cherish, protect, and love you endlessly through every phase of life.`,
      ps: 'P.S. Looking forward to thousands more moonlit nights with you! ✨',
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'letter-3',
      title: 'Promises For Our Next Chapter ✨',
      date: 'August 2026',
      body: `Pingrei,\n\nHere are 3 birthday promises from me to you:\n\n1. I promise to always listen to you and hold your hand whenever you need comfort.\n2. I promise to always make you laugh, even with my silliest inside jokes.\n3. I promise to love you more and more with every single passing day.\n\nForever & Always Yours,\nIngbal ❤️`,
      ps: 'P.S. Happy Birthday, my soulmate!',
    },
  ],
  
  reasonsToLove: [
    'Your sweet gentle laugh that lightens up any room.',
    'How Moon became our mascot and brought us even closer together.',
    'The way your eyes twinkle when you are genuinely happy.',
    'How you make Ingbal feel like the luckiest person on earth every day since January 10.',
    'Your warmth, patience, and tender care.',
    'Looking at the moon at night and knowing we share the same sky.',
    'Your adorable expressions and cute jokes.',
    'How 8 candles on August 28th represent our brightest wishes for you.',
    'Your gentle hugs that melt away any stress.',
    'Being my forever moonlit partner in crime.',
    'Every single second spent with you, Pingrei.',
    'Just being YOU—my favorite person in the whole wide universe!'
  ],
  
  theme: 'natural',
  bgMusicEnabled: true,
};

