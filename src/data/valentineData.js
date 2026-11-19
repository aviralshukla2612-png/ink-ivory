/**
 * INK & IVORY — INTERACTIVE VALENTINE PROPOSAL WEBSITE
 * Centralized Configuration Data
 * 
 * All fields are fully customizable by customers.
 */

export const valentineData = {
  senderName: "Aarav",
  recipientName: "Riya",
  brandName: "My Valentine",
  brandTagline: "An Ink & Ivory Romantic Experience",

  proposal: {
    eyebrow: "A SPECIAL QUESTION FOR YOU",
    heading: "Will You Be My Valentine?",
    subheading: "A little question from my heart to yours...",
    yesText: "Yes ♡",
    noText: "No ☹",
    successHeadline: "YOU JUST MADE ME THE HAPPIEST PERSON!",
    successSupporting: "I can't wait to make more beautiful memories with you. Every single second with you is my favourite chapter.",
    exploreButtonText: "Explore Our Love Story ↓",
    noResponses: [
      "Are you sure? 🥺",
      "Think again! 💭",
      "One more chance? 💕",
      "Pretty please? ♡",
      "Give YES a chance! ✨",
      "You know you want to say yes! 😉",
      "My heart can't take this! 💔",
      "Just click Yes already! 🌹"
    ]
  },

  story: [
    {
      title: "The Day We Met",
      date: "14 February 2024",
      milestone: "Chapter 01",
      description: "A quiet café, an accidental glance across the room, and a conversation that felt so effortlessly natural—like we had known each other forever.",
      image: "/04_welcome_intro.png",
      tag: "Serendipity"
    },
    {
      title: "Our First Conversation",
      date: "20 February 2024",
      milestone: "Chapter 02",
      description: "Three hours melted away in minutes as we shared our favorite songs, secret dreams, and laughed until the café turned off its lights.",
      image: "/05_couple_story.png",
      tag: "Magic"
    },
    {
      title: "Our First Road Trip",
      date: "18 June 2024",
      milestone: "Chapter 03",
      description: "Driving up the misty hill roads with the windows down, your hand in mine, and realizing that no matter the destination, you are my home.",
      image: "/08_haldi_ceremony.png",
      tag: "Adventure"
    },
    {
      title: "The Little Everyday Things",
      date: "12 November 2024",
      milestone: "Chapter 04",
      description: "Midnight ice cream runs, cooking dinners together that never quite went according to recipe, and finding magic in ordinary moments.",
      image: "/09_mehendi_ceremony.png",
      tag: "Everyday Love"
    },
    {
      title: "Today & All Our Tomorrows",
      date: "14 February 2026",
      milestone: "Chapter 05",
      description: "Standing right here, asking you the simplest and most profound question of my life with all the love my heart can hold.",
      image: "/02_grand_entrance_closed_gate.png",
      tag: "Forever"
    }
  ],

  letter: {
    eyebrow: "A Little Something For You",
    heading: "My Dearest Riya,",
    date: "Valentine's Day 2026",
    paragraphs: [
      "From the very first moment you smiled at me, you brought a warmth into my world that I never knew I was missing. You make the ordinary feel extraordinary, and every quiet moment with you is a sanctuary.",
      "You are in every song I listen to on quiet drives, in every gentle thought that begins my morning, and in the peace I feel at the end of every day. Thank you for loving me with so much kindness, patience, and grace.",
      "Whatever tomorrow brings, I promise to always hold your hand, make you laugh when the days feel heavy, and choose you—today, tomorrow, and for all the years to come."
    ],
    signOff: "Yours forever and always,",
    senderSignature: "Aarav ♡"
  },

  gallery: [
    {
      id: 1,
      image: "/04_welcome_intro.png",
      caption: "That unforgettable sunset in Jaipur",
      date: "Summer 2024",
      rotation: -2.5
    },
    {
      id: 2,
      image: "/05_couple_story.png",
      caption: "Laughing at our silly jokes",
      date: "Autumn 2024",
      rotation: 3.2
    },
    {
      id: 3,
      image: "/08_haldi_ceremony.png",
      caption: "Golden hour and your glowing smile",
      date: "Winter 2024",
      rotation: -1.8
    },
    {
      id: 4,
      image: "/09_mehendi_ceremony.png",
      caption: "Dancing under fairy lights",
      date: "Spring 2025",
      rotation: 2.8
    },
    {
      id: 5,
      image: "/10_sangeet_night.png",
      caption: "The night the stars seemed brighter",
      date: "Festival of Lights",
      rotation: -3.0
    },
    {
      id: 6,
      image: "/11_wedding_ceremony.png",
      caption: "Promises made quietly in our hearts",
      date: "New Year's Eve",
      rotation: 1.5
    }
  ],

  reasons: [
    {
      id: 1,
      title: "Your Gentle Smile",
      description: "The effortless way it lights up everything around you, making even the heaviest day feel light.",
      icon: "Sparkles"
    },
    {
      id: 2,
      title: "Your Infectious Laugh",
      description: "Without question, the most beautiful melody in the world. I could listen to it forever.",
      icon: "Smile"
    },
    {
      id: 3,
      title: "Your Endless Kindness",
      description: "The pure, selfless way you care for the people around you and see good in everyone.",
      icon: "Heart"
    },
    {
      id: 4,
      title: "The Way You Understand Me",
      description: "Even when words fail, you look at me and know exactly what my heart is feeling.",
      icon: "Compass"
    },
    {
      id: 5,
      title: "Our Little Silly Moments",
      description: "Dancing in the kitchen, shared memes, inside jokes, and doing absolutely nothing together.",
      icon: "Music"
    },
    {
      id: 6,
      title: "Simply Being You",
      description: "Because there is no one else in this entire universe like you, and I am so grateful you are mine.",
      icon: "Sun"
    }
  ],

  finalCelebration: {
    heading: "Here's To Us ♡",
    subheading: "More smiles, more adventures, and countless beautiful moments together.",
    badge: "TOGETHER FOREVER",
    replayButtonText: "Ask Me Again ↺"
  },

  music: {
    enabled: true,
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    source: "/audio/valentine-theme.mp3"
  }
};
