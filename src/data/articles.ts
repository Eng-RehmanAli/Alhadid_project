export type Article = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  publishedDate: string;
  facultySlug?: string;
  body: string[];
};

export const articlesHeroImage =
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=2400&q=80";

/** Page copy from https://alhadid.org/articles */
export const articlesPage = {
  title: "Articles and research",
  description:
    "Scholarly explorations at the intersection of traditional wisdom and contemporary inquiry.",
  metaDescription:
    "Explore scholarly articles and research on complementary medicine, mind sciences, Islamic studies, and leadership.",
  emptyMessage: "No articles available at this time.",
  archiveLabel: "Research archive",
  archiveIntro:
    "Essays and notes drawn from Al Hadid's faculties—bridging traditional wisdom with contemporary inquiry.",
  themesLabel: "Areas of inquiry",
  themesIntro:
    "Published work deepens understanding across the same pathways taught in our faculties and courses.",
  sourceUrl: "https://alhadid.org/articles",
} as const;

/**
 * Research notes compiled from live faculty content on alhadid.org
 * (philosophies and descriptions), presented as the institute archive.
 */
export const articles: Article[] = [
  {
    slug: "whole-person-healing",
    title: "Whole-person healing in complementary medicine",
    author: "Al Hadid Institute",
    excerpt:
      "True healing requires addressing the whole person—body, mind, and spirit—bridging ancient healing traditions with modern scientific understanding.",
    publishedDate: "2026-02-01",
    facultySlug: "complementary-medicine",
    body: [
      "Our approach to complementary medicine is rooted in the understanding that true healing requires addressing the whole person—body, mind, and spirit. We bridge the gap between ancient healing traditions and modern scientific understanding, providing a comprehensive framework for health and wellness that empowers individuals to take charge of their own vitality.",
      "Integrating traditional and modern healing practices including acupuncture, Unani medicine, herbal remedies, nutrition science, and cupping therapy forms the foundation of holistic wellness at Al Hadid.",
      "Key areas of practice include acupuncture and traditional Chinese medicine, Unani medicine, herbal medicine and nutrition, cupping therapy, and holistic wellness practices.",
    ],
  },
  {
    slug: "mind-as-frontier",
    title: "The mind as the frontier of human development",
    author: "Al Hadid Institute",
    excerpt:
      "By understanding and reprogramming our mental frameworks, we can achieve profound personal and professional transformation through NLP, psychology, and the Silva Method.",
    publishedDate: "2026-03-01",
    facultySlug: "mind-sciences",
    body: [
      "The mind is the ultimate frontier of human development. Our Mind Sciences faculty is dedicated to providing practical, evidence-based tools for cognitive enhancement, emotional regulation, and psychological mastery. We believe that by understanding and reprogramming our mental frameworks, we can achieve profound personal and professional transformation.",
      "This inquiry explores cognitive science, neuro-linguistic programming, applied psychology, and the Silva Method to unlock human potential and psychological transformation.",
      "Key areas include Neuro-Linguistic Programming (NLP), the Silva Method, applied psychology, cognitive science, and hypnotherapy and mind development.",
    ],
  },
  {
    slug: "spiritual-grounding-for-empowerment",
    title: "Spiritual grounding for modern empowerment",
    author: "Al Hadid Institute",
    excerpt:
      "True empowerment is incomplete without moral and spiritual grounding—applying Quranic thought, Seerah, and Islamic ethics to contemporary human development.",
    publishedDate: "2026-03-15",
    facultySlug: "islamic-studies",
    body: [
      "True empowerment is incomplete without moral and spiritual grounding. Our Islamic Studies faculty provides a deep, contextual understanding of Islamic principles, focusing on how timeless spiritual wisdom can be applied to navigate the complexities of the modern world. We emphasize the development of character (Akhlaq) alongside intellectual rigor.",
      "This work studies Quranic thought, Seerah, spiritual psychology, and Islamic ethics to integrate faith-based wisdom with contemporary human development.",
      "Key areas include Quranic thought and interpretation, Seerah, spiritual psychology, Islamic ethics and values, and faith-based human development.",
    ],
  },
  {
    slug: "leadership-with-integrity",
    title: "Leadership with integrity and strategic vision",
    author: "Al Hadid Institute",
    excerpt:
      "Effective leadership demands strategic vision, emotional intelligence, and the ability to navigate complex power structures while creating lasting positive change.",
    publishedDate: "2026-04-01",
    facultySlug: "leadership-strategy",
    body: [
      "Effective leadership requires more than just management skills; it demands strategic vision, emotional intelligence, and the ability to navigate complex power structures. Our faculty equips individuals with the tools to lead with integrity, communicate with impact, and design strategies that create lasting, positive change in their communities and organizations.",
      "This inquiry focuses on decision-making frameworks, influence dynamics, systems thinking, and historical leadership models for organizational and personal excellence.",
      "Key areas include leadership dynamics and power structures, decision-making frameworks, influence and communication, systems thinking, and historical leadership models.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
