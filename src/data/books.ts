export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  highlights: string[];
  praise: string[];
  prices: { label: string; amount: string }[];
  featured?: boolean;
};

export const booksHeroImage = "/brand/books-hero.png";

/** Page copy from https://alhadid.org/books */
export const booksPage = {
  title: "Books and publications",
  description:
    "Essential texts and resources for the journey of holistic human development, bridging traditional wisdom with contemporary science.",
  metaDescription:
    "Explore our collection of published works and resources on holistic human development, including the premium Foundations of Integrative Medicine.",
  featuredLabel: "Featured Publication",
  highlightsLabel: "Key Highlights",
  praiseLabel: "Praise & Authority",
  otherLabel: "Other Publications",
  emptyOther: "More publications will be added soon.",
  limitedNote: "Limited copies available. Contact to reserve your copy.",
  orderLabel: "Order via WhatsApp",
  outlineLabel: "Get Book Outline",
  orderUrl:
    "https://wa.me/923124193119?text=I%20want%20to%20order%20the%20book%20Foundations%20of%20Integrative%20Medicine",
  sourceUrl: "https://alhadid.org/books",
} as const;

/** Featured title hardcoded on live alhadid.org/books (PocketBase books API is empty). */
export const books: Book[] = [
  {
    slug: "foundations-of-integrative-medicine",
    title: "Foundations of Integrative Medicine",
    subtitle: "Bridging Traditional Wisdom and Modern Science",
    author: "Dr. Muzammil Ramzan",
    description:
      "A comprehensive masterwork exploring the synthesis of ancient healing practices with contemporary medical science. This essential text offers a holistic framework for human wellness, vitality, and the practical application of integrative therapies in modern contexts.",
    highlights: [
      "Comprehensive analysis of Unani and Traditional Chinese Medicine.",
      "Evidence-based approaches to herbal remedies and nutrition.",
      "Practical frameworks for holistic patient care and diagnosis.",
    ],
    praise: [
      "A groundbreaking synthesis of historical medical wisdom and modern clinical practice.",
      "Essential reading for practitioners seeking a truly holistic approach to healing.",
      "Masterfully bridges the gap between empirical science and traditional healing arts.",
    ],
    prices: [
      { label: "International", amount: "PKR 8000" },
      { label: "Local Edition", amount: "PKR 4000" },
    ],
    featured: true,
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export function getFeaturedBook(): Book | undefined {
  return books.find((book) => book.featured) ?? books[0];
}
