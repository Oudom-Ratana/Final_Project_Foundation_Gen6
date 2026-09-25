export const FALLBACK_CONCESSIONS = [
  {
    uuid: "f1",
    name: "Classic Butter Popcorn",
    description: "Freshly popped, warm popcorn tossed in rich, melted butter.",
    category: "FOOD",
    price: 5.5,
    imageUrl:
      "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "f2",
    name: "Loaded Nachos",
    description:
      "Crispy tortilla chips smothered in hot jalapeño cheese sauce.",
    category: "FOOD",
    price: 6.5,
    imageUrl:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "d1",
    name: "Ice-Cold Soda",
    description: "Your choice of classic fountain drinks, served over ice.",
    category: "DRINK",
    price: 4.0,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "d2",
    name: "Slushie Freeze",
    description:
      "Sweet, icy refreshment available in cherry and blue raspberry.",
    category: "DRINK",
    price: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "c1",
    name: "Solo Combo",
    description: "One regular popcorn and one regular fountain drink.",
    category: "COMBO",
    price: 8.5,
    imageUrl:
      "https://images.unsplash.com/photo-1662664917631-f92cb71a33a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "c2",
    name: "Couple's Combo",
    description: "One large popcorn and two regular fountain drinks to share.",
    category: "COMBO",
    price: 12.0,
    imageUrl:
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "f3",
    name: "Hot Dog Combo",
    description: "A classic grilled hot dog wrapped in a soft, warm bun.",
    category: "FOOD",
    price: 5.0,
    imageUrl:
      "https://images.unsplash.com/photo-1541214113241-212e8d2dc6d6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    uuid: "c3",
    name: "Family Feast",
    description:
      "Two large popcorns, four fountain drinks, and two candies of choice.",
    category: "COMBO",
    price: 24.0,
    imageUrl:
      "https://images.unsplash.com/photo-1662664918731-0027f3d2f9dc?q=80&w=1200&auto=format&fit=crop",
  },
];

export const CONCESSION_TICKER_ITEMS = [
  "FRESH POPCORN",
  "ICE-COLD DRINKS",
  "COMBO DEALS",
  "CRISPY NACHOS",
  "SWEET TREATS",
  "HOT DEALS ONLY",
];

// Backward compatibility: BookingDetailsPage uses item.id and item.image
export const CONCESSIONS = FALLBACK_CONCESSIONS.map((item) => ({
  ...item,
  id: item.uuid,
  image: item.imageUrl,
}));
