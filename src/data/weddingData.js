/**
 * INK & IVORY — TEMPLATE 01: CINEMATIC ROYAL WEDDING
 * Central Configurable Wedding Data Model
 * Reusable architecture for future marketplace customization.
 */

export const weddingData = {
  templateId: 'tpl-01-cinematic-royal',
  templateName: 'Cinematic Royal Wedding',
  version: '1.0.0',

  // Master Background Asset Mapping (15 Cinematic Scenes in 16:9 Widescreen)
  backgrounds: {
    preloader: '/01_preloader.png',
    entranceClosed: '/02_grand_entrance_closed_gate.png',
    entranceOpen: '/03_gate_opening_transition.png',
    welcome: '/04_welcome_intro.png',
    coupleStory: '/05_couple_story.png',
    saveTheDate: '/06_save_the_date.png',
    eventsOverview: '/07_wedding_events_overview.png',
    haldi: '/08_haldi_ceremony.png',
    mehendi: '/09_mehendi_ceremony.png',
    sangeet: '/10_sangeet_night.png',
    wedding: '/11_wedding_ceremony.png',
    reception: '/12_reception.png',
    familyBlessings: '/13_family_blessings.png',
    venue: '/14_venue_location.png',
    closing: '/15_closing_thank_you.png',
  },

  // Auspicious Invocation (Optional & Verified)
  shloka: {
    enabled: true,
    sanskrit: 'ॐ श्री गणेशाय नमः',
    subSanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    translation: 'May the Supreme Divine bless this auspicious union with boundless light, wisdom, and eternal joy.',
  },

  // Couple Details
  couple: {
    names: 'Aarav & Riya',
    namesShort: 'A & R',
    headline: 'Together with their families',
    subheading: 'Invite you to celebrate the beginning of their forever',
    weddingDateISO: '2026-12-18T17:00:00+05:30',
    dateDisplay: 'Friday, 18 December 2026',
    timeDisplay: '5:00 PM Onwards',
    cityDisplay: 'Jaipur, Rajasthan',
    heroImage: '/template-01/hero.jpg',
    palaceBackground: '/template-01/palace-courtyard.jpg',
    closingImage: '/template-01/closing.jpg',
  },

  groom: {
    name: 'Aarav Singhania',
    role: 'The Groom',
    title: 'Architect & Creative Director',
    parents: 'Son of Mrs. Sunita & Mr. Vikramaditya Singhania',
    bio: 'A passionate architect with an eye for classical heritage and soul in every detail. To Aarav, Riya is the serendipitous muse who brought color, warmth, and lifelong joy to his world.',
    image: '/template-01/groom.jpg',
    instagram: '@aarav.singhania',
  },

  bride: {
    name: 'Riya Kapoor',
    role: 'The Bride',
    title: 'Editorial Stylist & Curator',
    parents: 'Daughter of Mrs. Gayatri & Dr. Harshvardhan Kapoor',
    bio: 'A free-spirited storyteller with an affinity for literature and old-world grace. Riya found in Aarav the steady anchor, gentle humor, and unwavering love she always dreamed of.',
    image: '/template-01/bride.jpg',
    instagram: '@riya.kapoor',
  },

  // Editorial Story Timeline
  story: [
    {
      id: 'meeting',
      title: 'The First Meeting',
      date: 'October 2021',
      subtitle: 'A Serendipitous Afternoon in Mumbai',
      description:
        'A rainy afternoon at a quiet heritage library cafe. Aarav reached for the same vintage architecture volume Riya had just laid her hand on. A brief apologetic smile turned into an effortless two-hour conversation over warm masala chai.',
      image: '/template-01/gallery-1.jpg',
      tag: 'Where It All Began',
    },
    {
      id: 'conversation',
      title: 'The First Conversation',
      date: 'December 2021',
      subtitle: 'Miles Apart, Hearts Connected',
      description:
        'Late-night calls that stretched into dawn. From childhood memories and shared dreams to debating favorite songs and childhood wanderlust, silence between them never felt awkward; it felt like home.',
      image: '/template-01/gallery-2.jpg',
      tag: 'Growing Closer',
    },
    {
      id: 'beginning',
      title: 'The Unspoken Bond',
      date: 'July 2022',
      subtitle: 'A Monsoon Drive Along Marine Drive',
      description:
        'With rain lashing against the windshield and classical sitar music softly playing, Aarav turned to Riya and realized he never wanted to see another sunset without her beside him. It was simple, quiet, and undeniable.',
      image: '/template-01/gallery-3.jpg',
      tag: 'Soulmates',
    },
    {
      id: 'proposal',
      title: 'The Royal Proposal',
      date: 'November 2024',
      subtitle: 'Under Udaipur Stars',
      description:
        'On a private boat floating gently across Lake Pichola as the amber lanterns of the City Palace sparkled in the water, Aarav dropped to one knee with an heirloom diamond ring. Through tears of joy, Riya whispered the easiest yes of her life.',
      image: '/template-01/gallery-4.jpg',
      tag: 'She Said Yes',
    },
    {
      id: 'forever',
      title: 'Forever Begins',
      date: 'December 2026',
      subtitle: 'The Royal Celebration',
      description:
        'Surrounded by royal palace walls, sacred Vedic chants, family blessings, and lifelong friends, we take seven sacred vows under the Jaipur starlight to walk hand in hand for all eternity.',
      image: '/template-01/gallery-5.jpg',
      tag: 'The Royal Vows',
    },
  ],

  // Wedding Events
  events: [
    {
      id: 'haldi',
      name: 'The Haldi Ceremony',
      date: 'Wednesday, 16 December 2026',
      time: '10:30 AM – 1:30 PM',
      venue: 'Suraj Bagh Courtyard',
      dressCode: 'Sunshine Yellow & Floral Traditional',
      description:
        'A sacred turmeric ritual celebrating golden blessings, fragrant marigolds, playful laughter, and traditional folk rhythms.',
      image: '/template-01/event-haldi.jpg',
      mapQuery: 'The Heritage Palace Jaipur',
    },
    {
      id: 'mehendi',
      name: 'Mehendi Soirée',
      date: 'Wednesday, 16 December 2026',
      time: '4:30 PM – 8:30 PM',
      venue: 'Lotus Pavilion & Lakeside Lawn',
      dressCode: 'Pastel Florals & Royal Botanicals',
      description:
        'Intricate henna artistry adorned with heirloom motifs, fragrant jasmine garlands, cocktails, and joyful dhol beats.',
      image: '/template-01/event-mehendi.jpg',
      mapQuery: 'The Heritage Palace Jaipur',
    },
    {
      id: 'sangeet',
      name: 'Sangeet Extravaganza',
      date: 'Thursday, 17 December 2026',
      time: '7:30 PM Onwards',
      venue: 'Sheesh Mahal Grand Ballroom',
      dressCode: 'Indo-Western Glitz & Velvet Elegance',
      description:
        'An electric evening of heartfelt family performances, acoustic ghazals, high-energy Bollywood dance, and celebratory toasts.',
      image: '/template-01/event-sangeet.jpg',
      mapQuery: 'The Heritage Palace Jaipur',
    },
    {
      id: 'wedding',
      name: 'The Royal Wedding (Pheras)',
      date: 'Friday, 18 December 2026',
      time: '4:30 PM – 9:00 PM',
      venue: 'Palace Central Lakeside Mandap',
      dressCode: 'Regal Traditional Indian • Ivory, Navy & Gold',
      description:
        'The sacred Baraat procession followed by the eternal seven vows (Saat Phere) around the sacred agni as dusk sets over the palace hills.',
      image: '/template-01/event-wedding.jpg',
      mapQuery: 'The Heritage Palace Jaipur',
    },
    {
      id: 'reception',
      name: 'The Imperial Reception',
      date: 'Saturday, 19 December 2026',
      time: '7:30 PM Onwards',
      venue: 'Maharaja Royal Banquet Terraces',
      dressCode: 'Black Tie / Royal Formal Elegance',
      description:
        'A lavish celebratory dinner, live orchestral music, celebratory cake cutting, and dancing beneath the moonlit Rajasthan sky.',
      image: '/template-01/event-reception.jpg',
      mapQuery: 'The Heritage Palace Jaipur',
    },
  ],

  // Curated Gallery
  gallery: [
    {
      id: 1,
      src: '/template-01/gallery-1.jpg',
      caption: 'Quiet moments before the royal celebrations commence.',
      orientation: 'landscape',
    },
    {
      id: 2,
      src: '/template-01/gallery-2.jpg',
      caption: 'Handcrafted gold foil details and bespoke bridal ornaments.',
      orientation: 'portrait',
    },
    {
      id: 3,
      src: '/template-01/gallery-3.jpg',
      caption: 'The golden hour reflection across the palace courtyards.',
      orientation: 'portrait',
    },
    {
      id: 4,
      src: '/template-01/gallery-4.jpg',
      caption: 'Aarav and Riya during their engagement ceremony.',
      orientation: 'landscape',
    },
    {
      id: 5,
      src: '/template-01/gallery-5.jpg',
      caption: 'Intricate heritage architecture framing our sacred memories.',
      orientation: 'portrait',
    },
    {
      id: 6,
      src: '/template-01/gallery-6.jpg',
      caption: 'Laughter, joy, and the warmth of unconditional love.',
      orientation: 'landscape',
    },
  ],

  // Venue & Directions
  venue: {
    name: 'The Heritage Palace & Gardens',
    subName: 'A Legendary 18th Century Royal Fortress',
    address: 'Amber Fort Foothills, Amer Road',
    city: 'Jaipur, Rajasthan — 302028',
    country: 'India',
    image: '/template-01/venue.jpg',
    googleMapsUrl:
      'https://maps.google.com/?q=The+Heritage+Palace+Amber+Road+Jaipur+Rajasthan',
    airportInfo: 'Jaipur International Airport (JAI) — 28 km (Approx 45 mins drive)',
    railwayInfo: 'Jaipur Junction Railway Station — 16 km (Approx 30 mins drive)',
    valetNote: 'Complimentary valet parking and concierge available at the main palace portal.',
  },

  // Sample Digital Guestbook Wishes
  wishes: [
    {
      id: 1,
      name: 'Rohan & Meera Singhania',
      relationship: 'Brother & Sister-in-law',
      message:
        'Watching you two grow together has been the greatest joy. May your life together be as regal, warm, and breathtaking as this magnificent day!',
      date: '12 Nov 2026',
    },
    {
      id: 2,
      name: 'Ananya Deshmukh',
      relationship: 'Maid of Honor & Childhood Friend',
      message:
        'To my dearest Riya and Aarav: You two are the truest definition of finding home in another person. Can not wait to dance all night at the Sangeet!',
      date: '14 Nov 2026',
    },
    {
      id: 3,
      name: 'Vikram Malhotra',
      relationship: 'College Best Friend',
      message:
        'From library study dates to the royal mandap — you two wrote your own fairytale. Wishing you boundless adventure, happiness, and love always.',
      date: '16 Nov 2026',
    },
  ],

  // Family Blessings & Lineages (Configurable)
  families: {
    title: 'With Blessings From Our Families',
    subtitle: 'Under the grace and lifelong blessings of our beloved elders and families',
    brideSide: {
      title: "Bride's Family",
      parents: 'Mrs. Gayatri & Dr. Harshvardhan Kapoor',
      grandparents: 'Granddaughter of Late Smt. Kamala & Shri Ramnath Kapoor',
      greeting: 'Cordially invites you to bless our beloved daughter Riya as she embarks on this holy and joyous journey with Aarav.',
    },
    groomSide: {
      title: "Groom's Family",
      parents: 'Mrs. Sunita & Mr. Vikramaditya Singhania',
      grandparents: 'Grandson of Late Smt. Devika & Shri Jagannath Singhania',
      greeting: 'Warmly welcomes you to witness and celebrate the eternal bond uniting Aarav and Riya in royal matrimony.',
    },
  },

  // Audio Atmosphere: Aaj Sajeya (Alaya F & Goldie Sohel - Saregama Music)
  music: {
    enabled: true,
    title: 'Aaj Sajeya — Goldie Sohel (Saregama Music)',
    source: '/audio/aaj-sajeya.mp3',
    fallbackSource: '/audio/indian-wedding-shehnai.mp3',
  },

  // Theme Settings
  theme: {
    ivory: '#F7F3EB',
    warmWhite: '#FCFAF6',
    deepNavy: '#172039',
    navyBlack: '#101624',
    champagneGold: '#C5A46D',
    softGold: '#D8C39A',
    mutedGray: '#89857E',
  },
};
