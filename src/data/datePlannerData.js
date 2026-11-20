/**
 * You Are Mine — Centralized Date Planner Configuration
 * Fully reactive and editable via Customization Studio or query parameters
 */
export const datePlannerData = {
  recipientName: "Riya",
  senderName: "Aarav",
  eyebrow: "LET'S PLAN",
  heading: "Our Perfect Date ♡",
  description: "Tell me what you'd love most, and I'll plan every detail for an unforgettable time together.",

  timePeriods: [
    {
      id: "morning",
      title: "Morning",
      subtitle: "Coffee, warm croissants & morning sunshine",
      icon: "Sun",
      slots: ["8:00 AM – 10:00 AM", "9:30 AM – 11:30 AM", "10:30 AM – 12:30 PM"],
    },
    {
      id: "afternoon",
      title: "Afternoon",
      subtitle: "Breezy lunch, sweet gelato & exploring",
      icon: "SunMedium",
      slots: ["12:30 PM – 2:30 PM", "1:30 PM – 3:30 PM", "2:30 PM – 4:30 PM"],
    },
    {
      id: "evening",
      title: "Evening",
      subtitle: "Golden hour skies, sunset walk & cozy vibes",
      icon: "Sunset",
      slots: ["4:30 PM – 6:30 PM", "5:30 PM – 7:30 PM", "6:30 PM – 8:30 PM"],
    },
    {
      id: "night",
      title: "Night",
      subtitle: "Candlelit dinner, city lights & starry romance",
      icon: "Moon",
      slots: ["7:30 PM – 9:30 PM", "8:30 PM – 10:30 PM", "9:30 PM – 11:30 PM"],
    },
  ],

  activities: [
    {
      id: "movie",
      title: "Watch a Movie",
      desc: "Cozy theater recliner or open-air rooftop cinema with popcorn",
      icon: "Film",
      tag: "Cozy & Fun",
    },
    {
      id: "dinner",
      title: "Dine Out",
      desc: "Delightful gourmet dishes with candlelight and soft music",
      icon: "Utensils",
      tag: "Romantic Favorite",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      id: "cafe",
      title: "Cafe Date",
      desc: "Artisanal coffee, decadent pastries, and endless conversations",
      icon: "Coffee",
      tag: "Intimate & Sweet",
    },
    {
      id: "walk",
      title: "A Walk Together",
      desc: "Strolling through botanical gardens, riverside or sunset promenade",
      icon: "Footprints",
      tag: "Peaceful & Scenic",
    },
    {
      id: "games",
      title: "Games & Fun",
      desc: "Bowling, arcade games, mini golf, or lively board games",
      icon: "Gamepad2",
      tag: "Playful Energy",
    },
    {
      id: "surprise",
      title: "Surprise Me ♡",
      desc: "Leave it entirely in my hands — I'll plan something magical",
      icon: "Sparkles",
      tag: "Pure Mystery",
    },
  ],

  cuisines: [
    { id: "italian", name: "Italian", desc: "Fresh handmade pasta, woodfired pizza & tiramisu", emoji: "🍝" },
    { id: "indian", name: "Indian Cuisine", desc: "Aromatic curries, butter naans & royal biryani", emoji: "🍛" },
    { id: "japanese", name: "Japanese & Sushi", desc: "Delicate sushi rolls, ramen & gyoza", emoji: "🍣" },
    { id: "chinese", name: "Pan-Asian & Dim Sum", desc: "Steaming dumplings, noodles & stir-fries", emoji: "🥢" },
    { id: "mexican", name: "Mexican", desc: "Crispy tacos, loaded nachos, guacamole & churros", emoji: "🌮" },
    { id: "continental", name: "Continental & Grills", desc: "Sizzlers, artisan sandwiches & salads", emoji: "🥗" },
    { id: "desserts", name: "Dessert Parlor", desc: "Warm waffles, chocolate fondues & gelato", emoji: "🍰" },
    { id: "streetfood", name: "Street Food Delights", desc: "Chaat, momos, rolls & vibrant evening snacks", emoji: "🥟" },
    { id: "anything", name: "Anything You Like ♡", desc: "Whatever you're craving most on our special day", emoji: "✨" },
  ],

  dietaryOptions: [
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Jain",
    "No Restrictions",
  ],

  movieGenres: [
    { id: "romantic", title: "Romantic & Heartfelt", emoji: "💌" },
    { id: "comedy", title: "Laugh-Out-Loud Comedy", emoji: "😂" },
    { id: "thriller", title: "Gripping Mystery / Thriller", emoji: "🔍" },
    { id: "action", title: "Action & Adventure", emoji: "⚡" },
    { id: "horror", title: "Spooky Horror (Hold my hand!)", emoji: "👻" },
    { id: "drama", title: "Cinematic Emotional Drama", emoji: "🎭" },
    { id: "animation", title: "Whimsical Animated Classic", emoji: "🎈" },
  ],

  movieVenues: [
    { id: "cinema", title: "Luxury Cinema (Director's Cut / IMAX)" },
    { id: "home", title: "Cozy Blanket & Fairy-Light Home Theater" },
    { id: "openair", title: "Rooftop Under The Stars Cinema" },
  ],

  environments: [
    { id: "indoor", title: "Indoor & Cozy", desc: "Air-conditioned comfort, candlelight, relaxed atmosphere" },
    { id: "outdoor", title: "Open-Air & Scenic", desc: "Terrace, garden dining, breeze & natural light" },
    { id: "both", title: "A Mix of Both", desc: "Outdoor stroll followed by cozy indoor meal" },
  ],

  budgets: [
    { id: "budget", title: "Cute & Casual", icon: "🌱" },
    { id: "moderate", title: "Chic & Delightful", icon: "✨" },
    { id: "premium", title: "Grand & Luxe", icon: "👑" },
    { id: "none", title: "Doesn't Matter, Just You ♡", icon: "❤️" },
  ],

  locations: [
    { id: "nearme", title: "Nearby & Convenient" },
    { id: "citycenter", title: "Vibrant City Center" },
    { id: "nature", title: "Scenic / Nature Retreat" },
    { id: "rooftop", title: "Skyline Rooftop" },
    { id: "restaurant", title: "Fine Dining Ambience" },
    { id: "home", title: "Private & Relaxed Home" },
    { id: "surprise", title: "Surprise Secret Spot ♡" },
  ],

  music: {
    enabled: true,
    title: "Until I Found You — Stephen Sanchez",
    source: "/audio/valentine-theme.mp3",
    startTime: 0,
  },
};
