export type Course = {
  slug: string;
  title: string;
  summary: string;
  price: string;
  compareAtPrice?: string;
  duration?: string;
  level?: string;
  badge?: "Popular" | "New" | "Limited";
  featured?: boolean;
  seatsLeft?: number;
  image?: string;
  modules?: string[];
  outcomes?: string[];
};

export type CourseGroup = {
  facultySlug: string;
  title: string;
  courses: Course[];
};

export const coursesHeroImage =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2400&q=80";

export const coursesPage = {
  title: "Our Courses",
  description:
    "Comprehensive programs designed to cultivate wisdom, health, and purposeful action across multiple dimensions of human development.",
  enrollmentNote:
    "Course registration opens every 10–15 days. Check back regularly for new enrollment windows.",
  seatsNote: "Limited seats available. Contact for admission.",
  applyLabel: "Apply via WhatsApp",
  priceRange: "PKR 5000–12000",
} as const;

const defaultModules = [
  "Foundations and core principles",
  "Guided practice and application",
  "Assessment and certification pathway",
];

const defaultOutcomes = [
  "A clear working model of the subject",
  "Practical skills you can apply immediately",
  "A certificate of completion from Al Hadid",
];

export const courseGroups: CourseGroup[] = [
  {
    facultySlug: "complementary-medicine",
    title: "Complementary Medicine",
    courses: [
      {
        slug: "cupping-therapy-diploma",
        title: "Cupping Therapy Diploma",
        summary: "Master the ancient art of cupping therapy",
        price: "PKR 5000–12000",
        featured: true,
        image:
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
        modules: [
          "History and theory of Hijama",
          "Safety, hygiene, and client care",
          "Practical cupping techniques",
          "Clinical practice hours",
        ],
        outcomes: defaultOutcomes,
      },
      {
        slug: "acupuncture",
        title: "Acupuncture",
        summary: "Traditional Chinese acupuncture techniques and applications",
        price: "PKR 5000–12000",
        featured: true,
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "dry-needling",
        title: "Dry Needling",
        summary: "Modern dry needling therapy for pain management",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "diet-and-nutrition",
        title: "Diet and Nutrition",
        summary: "Comprehensive nutrition science and dietary planning",
        price: "PKR 5000–12000",
        featured: true,
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "reiki-qigong-and-yoga",
        title: "Reiki, Qigong and Yoga",
        summary: "Energy healing and mindfulness practices",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
    ],
  },
  {
    facultySlug: "mind-sciences",
    title: "Mind Sciences",
    courses: [
      {
        slug: "nlp-beginner",
        title: "NLP Beginner",
        summary: "Introduction to Neuro-Linguistic Programming fundamentals",
        price: "PKR 5000–12000",
        featured: true,
        image:
          "/brand/mind-sciences.jpg",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "nlp-practitioner",
        title: "NLP Practitioner",
        summary: "Advanced NLP techniques and practical applications",
        price: "PKR 5000–12000",
        featured: true,
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "nlp-master-practitioner",
        title: "NLP Master Practitioner",
        summary: "Master-level NLP training and certification",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "hypnotherapy-advanced",
        title: "Hypnotherapy (Advanced Level)",
        summary:
          "Advanced hypnotherapy techniques and therapeutic applications",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "silva-beginner",
        title: "Silva Beginner",
        summary: "Introduction to Silva Method and mind development",
        price: "PKR 5000–12000",
        featured: true,
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "silva-ultra-mind-training",
        title: "Silva Ultra Mind Training",
        summary: "Advanced Silva Method for peak mental performance",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "telepathy",
        title: "Telepathy",
        summary: "Developing telepathic abilities and intuitive communication",
        price: "PKR 5000–12000",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
    ],
  },
  {
    facultySlug: "leadership-strategy",
    title: "Leadership & Communication",
    courses: [
      {
        slug: "leadership-and-power-structures",
        title: "Leadership and Power Structures",
        summary: "Understanding leadership dynamics and organizational power",
        price: "PKR 5000–12000",
        featured: true,
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
      {
        slug: "public-speaking",
        title: "Public Speaking",
        summary: "Master the art of effective public speaking and communication",
        price: "PKR 5000–12000",
        featured: true,
        modules: defaultModules,
        outcomes: defaultOutcomes,
      },
    ],
  },
  {
    facultySlug: "islamic-studies",
    title: "Islamic Studies",
    courses: [
      {
        slug: "foundations-of-islam",
        title: "Foundations of Islam",
        summary: "Comprehensive study of Islamic principles and teachings",
        price: "PKR 5000–12000",
        featured: true,
        image:
          "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
        modules: [
          "Aqidah and core beliefs",
          "Ibadah and daily practice",
          "Akhlaq and character",
          "Seerah as leadership model",
        ],
        outcomes: defaultOutcomes,
      },
    ],
  },
];

export const allCourses = courseGroups.flatMap((group) =>
  group.courses.map((course) => ({
    ...course,
    facultySlug: group.facultySlug,
    facultyTitle: group.title,
  })),
);

export type CourseWithFaculty = (typeof allCourses)[number];

export function getCourseGroup(facultySlug: string): CourseGroup | undefined {
  return courseGroups.find((group) => group.facultySlug === facultySlug);
}

export function getCourse(slug: string): CourseWithFaculty | undefined {
  return allCourses.find((course) => course.slug === slug);
}

export function getRelatedCourses(slug: string, limit = 3): CourseWithFaculty[] {
  const course = getCourse(slug);
  if (!course) return [];
  return allCourses
    .filter((c) => c.facultySlug === course.facultySlug && c.slug !== slug)
    .slice(0, limit);
}

export const featuredCourses = allCourses.filter((c) => c.featured);
