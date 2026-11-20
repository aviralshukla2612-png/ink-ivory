/**
 * You Are Mine — Centralized Birthday Customization Configuration
 * Fully reactive and editable via Customization Studio or query parameters
 */
export const birthdayData = {
  recipientName: "Ananya",
  senderName: "Kabir",
  occasionDate: "14 November",
  
  hero: {
    prefix: "Happy",
    heading: "Birthday",
    message: "To the one who makes life more special, may your day be as beautiful, kind and happy as you are.",
    buttonText: "Open Your Surprise ♡",
    backgroundImage: "/images/birthday/birthday-hero-bg.png",
    profileImage: "/images/birthday/profile.jpg",
    cakeImage: "/images/birthday/cake.png",
    teddyImage: "/images/birthday/teddy.png",
  },

  highlights: [
    {
      id: "wish",
      title: "My Wish",
      desc: "A special message from my heart",
      icon: "Sparkles",
    },
    {
      id: "memories",
      title: "Our Memories",
      desc: "Some of our best moments together",
      icon: "Camera",
    },
    {
      id: "note",
      title: "A Little Note",
      desc: "A heartfelt wax-sealed letter",
      icon: "Mail",
    },
    {
      id: "surprise",
      title: "Birthday Surprise",
      desc: "Something special just for you",
      icon: "Gift",
    },
  ],

  wish: {
    heading: "A Wish From My Heart ♡",
    subtitle: "Because you deserve every ounce of joy in the universe",
    paragraphs: [
      "On your special day, I wish you endless happiness, beautiful opportunities, vibrant health, and countless reasons to smile.",
      "May every dream you carry come closer to reality, and may life surprise you with unforgettable adventures and quiet moments of contentment."
    ],
  },

  memories: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
      caption: "That spontaneous sunset walk where we couldn't stop laughing.",
      date: "Spring Evening",
      rotation: -3,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
      caption: "Coffee dates that turn into hours of heartfelt conversations.",
      date: "Autumn Days",
      rotation: 2,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
      caption: "Under fairy lights, celebrating how magical life can be with you.",
      date: "December Magic",
      rotation: -2,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
      caption: "Here's to another year of dreams, joy, and unforgettable stories.",
      date: "Golden Hour",
      rotation: 3,
    },
  ],

  letter: {
    heading: "A Little Note For You",
    prompt: "Open Your Letter ♡",
    paragraphs: [
      "Dear Ananya,",
      "Today is all about celebrating you.",
      "I hope your life is always filled with laughter, beautiful memories, exciting adventures, and people who make you feel as special as you truly are.",
      "Never stop dreaming, smiling, and being the wonderful person you are. The world is a gentler, brighter place with you in it.",
      "Happy Birthday!",
      "With all my love,\nKabir"
    ],
  },

  surprise: {
    heading: "Ready For Your Surprise?",
    subtext: "Tap the golden ribbon to unwrap your special gift",
    buttonText: "Open Gift ♡",
    surpriseHeading: "YOU DESERVE ALL THE HAPPINESS IN THE WORLD!",
    surpriseMessage: "May this year be your most beautiful, inspiring, and magical chapter yet. Keep shining bright!",
  },

  finalCelebration: {
    heading: "Happy Birthday, Ananya ♡",
    quote: "Keep smiling, keep shining and keep being you.",
    replayText: "Replay Birthday Surprise",
  },

  music: {
    enabled: true,
    title: "Happy Birthday to You (Music Box & Piano)",
    source: "/audio/happy-birthday.mp3",
    startTime: 0,
  },
};
