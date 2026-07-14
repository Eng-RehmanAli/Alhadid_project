export type Faculty = {
  slug: string;
  title: string;
  titleShort?: string;
  description: string;
  overview: string[];
  academy?: string;
  registration?: string;
  philosophy: string[];
  approach: string[];
  whoFor: string[];
  outcomes: string[];
  keyAreas: string[];
  keyAreasDetail: { title: string; detail: string }[];
  courses: string[];
  heroImage: string;
};

export const facultiesListingHero =
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2400&q=80";

export const facultiesPage = {
  title: "Our Faculties",
  eyebrow: "Academic divisions",
  description:
    "Al Hadid comprises four faculties — each focusing on a vital dimension of human growth, while remaining part of one integrated path of learning.",
  introEyebrow: "Our structure",
  introTitle: "One institute. Four dimensions of growth.",
  intro: [
    "Transformation does not happen in fragments. Physical vitality, mental clarity, spiritual depth, and practical leadership are interwoven — and our academic structure reflects that reality.",
    "Each faculty preserves a clear discipline of study, with its own philosophy, methods, and course pathways. Together they form a coherent institute for people who want grounded skills and lasting inner change.",
  ],
  integrationTitle: "How the faculties work together",
  integrationBody:
    "Students may begin in one faculty and later cross into another. Complementary Medicine cultivates bodily wisdom; Mind Sciences trains attention and emotional mastery; Islamic Studies anchors ethics and meaning; Leadership and Strategy turns growth into responsible action in the world.",
  enrollmentNote:
    "Course registration opens every 10–15 days. Check back regularly for new enrollment windows.",
} as const;

export const faculties: Faculty[] = [
  {
    slug: "complementary-medicine",
    title: "Complementary Medicine",
    description:
      "Integrating traditional and modern healing practices including acupuncture, Unani medicine, herbal remedies, nutrition science, and cupping therapy for holistic wellness.",
    overview: [
      "The Faculty of Complementary Medicine exists for those who refuse to treat the body as a machine and health as a checklist. We train practitioners and seekers in systems of care that honour balance, nature, and lived experience — without discarding what modern science has clarified.",
      "From Prophetic and Unani traditions to Chinese acupuncture, cupping (hijama), nutrition, and mindful movement arts, our curriculum links classical theory with supervised practice. Students learn not only techniques, but the ethics of healing: patience, observation, and respect for the whole person.",
    ],
    academy:
      "Complementary Medicine Academy — Registered with Government of Pakistan",
    registration: "Legally Registered — February 2026",
    philosophy: [
      "True healing asks for more than symptom management. It asks for attention to constitution, lifestyle, emotion, and spirit — the patterns that keep illness returning or allow recovery to deepen.",
      "We bridge ancient healing lineages with contemporary clinical language so graduates can practise with confidence, speak clearly to modern patients, and remain rooted in time-tested principles of vitality and balance.",
    ],
    approach: [
      "Learning is progressive: foundations in history and theory, then protocol-based skills, then clinical judgement under guidance.",
      "Practical modules emphasise hygiene, contraindications, case assessment, and client communication alongside hands-on technique.",
      "Where relevant, Islamic ethical frames inform how care is offered — with dignity, consent, and humility at the centre.",
    ],
    whoFor: [
      "Aspiring complementary therapists seeking structured, registered training",
      "Healthcare and wellness professionals expanding their toolkit",
      "Individuals committed to personal health literacy and holistic self-care",
      "Students who want science-informed traditional medicine without fad culture",
    ],
    outcomes: [
      "Competence in core complementary modalities taught in the faculty",
      "Ability to assess basic cases and recommend safe, staged interventions",
      "Clear understanding of scope of practice and referral boundaries",
      "A professional posture grounded in ethics and continuing education",
    ],
    keyAreas: [
      "Acupuncture & Traditional Chinese Medicine",
      "Unani Medicine",
      "Herbal Medicine & Nutrition",
      "Cupping Therapy",
      "Holistic Wellness Practices",
    ],
    keyAreasDetail: [
      {
        title: "Cupping Therapy (Hijama)",
        detail:
          "Classical and contemporary cupping methods for detoxification, pain relief, and circulatory support, taught with safety protocols and Prophetic practice context.",
      },
      {
        title: "Traditional Chinese Acupuncture",
        detail:
          "Meridian theory, point location, needling fundamentals, and treatment logic for common complaints — with emphasis on precise, ethical clinic habits.",
      },
      {
        title: "Modern Dry Needling",
        detail:
          "Targeted soft-tissue needling for muscular dysfunction, bridging sports and clinical settings with clear assessment and dosage principles.",
      },
      {
        title: "Diet and Nutrition Science",
        detail:
          "Food as medicine: digestive patterns, nutritional foundations, and practical dietary guidance aligned with both traditional wisdom and contemporary evidence.",
      },
      {
        title: "Energy Healing (Reiki, Qigong, Yoga)",
        detail:
          "Breath, posture, and subtle-energy practices that restore regulation of the nervous system and support body–mind integration.",
      },
    ],
    courses: [
      "Cupping Therapy Diploma",
      "Acupuncture",
      "Dry Needling",
      "Diet and Nutrition",
      "Reiki Qigong and Yoga",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2400&q=80",
  },
  {
    slug: "mind-sciences",
    title: "Mind Sciences",
    description:
      "Exploring cognitive science, neuro-linguistic programming, applied psychology, and the Silva Method to unlock human potential and psychological transformation.",
    overview: [
      "The Faculty of Mind Sciences treats the mind as trainable terrain — not a mystery reserved for specialists alone. We teach practical methods for attention, emotional regulation, belief change, and peak performance that students can apply in life, work, and service.",
      "Drawing on NLP, the Silva Method, applied psychology, and hypnotherapy pathways, the faculty balances experiential drills with conceptual clarity. The goal is mastery you can demonstrate: calmer states, cleaner communication, and deliberate mental architecture.",
    ],
    academy: "NLP & Silva School — Registered with Government of Pakistan",
    registration: "Legally Registered — March 18, 2026",
    philosophy: [
      "Mental frameworks shape what people notice, what they believe is possible, and how they respond under pressure. Without intentional training, those frameworks run on default — often inherited, unexamined, and limiting.",
      "We believe profound personal and professional change becomes available when learners can observe, interrupt, and redesign those patterns with skill. Mind Sciences is dedicated to that craft: disciplined, ethical, and relentlessly practical.",
    ],
    approach: [
      "Courses move from awareness tools to practitioner-level modelling and coaching conversations.",
      "Exercises are live and embodied — language, state control, visualisation, and structured change techniques practised in session.",
      "Ethics are non-negotiable: influence without manipulation, depth without coercion, and respect for each learner's autonomy.",
    ],
    whoFor: [
      "Coaches, educators, and consultants refining communication and change skills",
      "Professionals seeking emotional regulation and decision clarity under stress",
      "Students exploring NLP, hypnotherapy, or Silva Method certification pathways",
      "Anyone ready to take responsibility for inner narrative and cognitive habits",
    ],
    outcomes: [
      "Reliable tools for state management and focused attention",
      "Fluent use of NLP frameworks for communication and change work",
      "Foundations for hypnotherapy and Silva Method practice streams",
      "Greater self-awareness and capacity to guide others ethically",
    ],
    keyAreas: [
      "Neuro-Linguistic Programming (NLP)",
      "Silva Method",
      "Applied Psychology",
      "Cognitive Science",
      "Hypnotherapy & Mind Development",
    ],
    keyAreasDetail: [
      {
        title: "Neuro-Linguistic Programming (NLP)",
        detail:
          "From beginner grounding to practitioner and master pathways — language patterns, anchoring, reframing, and modelling excellence.",
      },
      {
        title: "The Silva Method & Mind Control",
        detail:
          "Systematic training in relaxed focus, visualisation, and problem-solving states used for creativity, healing intention, and clarity.",
      },
      {
        title: "Advanced Hypnotherapy",
        detail:
          "Induction skills, deepening, suggestion design, and session structure for ethical therapeutic and developmental work.",
      },
      {
        title: "Applied Psychology",
        detail:
          "Practical psychological models for motivation, habit, emotion, and interpersonal dynamics in everyday contexts.",
      },
      {
        title: "Intuitive Development & Telepathy",
        detail:
          "Attentional and perceptive exercises that sharpen intuition and non-ordinary sensing within a disciplined learning frame.",
      },
    ],
    courses: [
      "NLP Beginner",
      "NLP Practitioner",
      "NLP Master Practitioner",
      "Hypnotherapy (Advanced Level)",
      "Silva Beginner",
      "Silva Ultra Mind Training",
      "Telepathy",
    ],
    heroImage: "/brand/mind-sciences.jpg",
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    description:
      "Studying Quranic thought, Seerah, spiritual psychology, and Islamic ethics to integrate faith-based wisdom with contemporary human development.",
    overview: [
      "The Faculty of Islamic Studies is not a catalogue of rituals in isolation. It is a living inquiry into how revelation, prophetic example, and ethical cultivation shape a whole human being — intellectually awake, spiritually rooted, and socially responsible.",
      "Students engage Quranic thought, Seerah, spiritual psychology, and Akhlaq as resources for modern dilemmas: identity, vocation, family, leadership, and inner struggle. Scholarship here serves transformation, not display.",
    ],
    philosophy: [
      "Empowerment without moral and spiritual grounding is incomplete. Knowledge that sharpens the mind but neglects the heart leaves people capable and unsettled.",
      "This faculty cultivates both: contextual understanding of Islamic principles and the character (Akhlaq) required to live them with sincerity. Timeless wisdom is taught as something to practice under the pressures of contemporary life.",
    ],
    approach: [
      "Texts and themes are studied with historical context and contemporary relevance held together.",
      "Discussion-based learning connects doctrine to psychological insight and everyday decision-making.",
      "Character formation is treated as curriculum — not an optional afterthought to intellectual success.",
    ],
    whoFor: [
      "Muslims seeking deeper, applied understanding of faith beyond surface familiarity",
      "Educators and community leaders needing ethical and spiritual frameworks",
      "Students combining deen with self-development and vocational purpose",
      "Anyone exploring how Qur'anic and Prophetic wisdom illuminates human psychology",
    ],
    outcomes: [
      "Clearer grounding in foundations of Islamic thought and practice",
      "Ability to relate Seerah and Quranic themes to modern life questions",
      "Growth in ethical discernment and spiritual self-awareness",
      "A vocabulary of faith that supports leadership, counselling, and community service",
    ],
    keyAreas: [
      "Quranic Thought & Interpretation",
      "Seerah (Prophet's Life & Teachings)",
      "Spiritual Psychology",
      "Islamic Ethics & Values",
      "Faith-Based Human Development",
    ],
    keyAreasDetail: [
      {
        title: "Foundations of Islamic Thought",
        detail:
          "Core beliefs, worship, and worldview frameworks that orient learners in knowledge of Allah, prophecy, and accountable living.",
      },
      {
        title: "Quranic Psychology",
        detail:
          "How Quranic language addresses the nafs, heart, intention, trial, and healing — read for both meaning and inner application.",
      },
      {
        title: "Seerah and Leadership Models",
        detail:
          "The Prophet's life as a school of mercy, strategy, patience, and community-building under pressure.",
      },
      {
        title: "Islamic Ethics and Morality",
        detail:
          "Akhlaq as practiced virtue: sincerity, justice, restraint, and excellence in private and public conduct.",
      },
    ],
    courses: ["Foundations of Islam"],
    heroImage:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2400&q=80",
  },
  {
    slug: "leadership-strategy",
    title: "Leadership and Strategy",
    titleShort: "Leadership & Strategy",
    description:
      "Mastering decision-making frameworks, influence dynamics, systems thinking, and historical leadership models for organizational and personal excellence.",
    overview: [
      "The Faculty of Leadership and Strategy prepares people who must move others — teams, communities, organisations — without losing integrity. Leadership here is treated as craft: vision, communication, power literacy, and decision quality under uncertainty.",
      "Students study influence dynamics, systems thinking, public speaking, and historical leadership models so they can diagnose situations, speak with presence, and design strategies that outlast a single burst of motivation.",
    ],
    philosophy: [
      "Management skills alone do not make a leader. Strategic vision, emotional intelligence, and the ability to navigate power structures determine whether influence serves ego or benefit.",
      "We equip learners to lead with integrity, communicate with impact, and build strategies that create durable good — in families, institutions, and public life — rather than short-term compliance.",
    ],
    approach: [
      "Case-based analysis of power, persuasion, and organisational behaviour.",
      "Speaking and presence training that turns clarity into audience trust.",
      "Strategic exercises that train students to map systems, trade-offs, and second-order effects.",
    ],
    whoFor: [
      "Emerging and mid-level leaders responsible for teams or community initiatives",
      "Entrepreneurs and professionals who must influence without formal authority",
      "Educators and organisers seeking sharper communication and strategic planning",
      "Individuals who want ethical fluency with real-world power dynamics",
    ],
    outcomes: [
      "Stronger decision frameworks for complex, high-stakes choices",
      "Confident public speaking and persuasive communication",
      "Literacy in power structures and healthy influence practices",
      "Ability to design strategies that align vision, people, and constraints",
    ],
    keyAreas: [
      "Leadership Dynamics & Power Structures",
      "Decision-Making Frameworks",
      "Influence & Communication",
      "Systems Thinking",
      "Historical Leadership Models",
    ],
    keyAreasDetail: [
      {
        title: "Leadership and Power Structures",
        detail:
          "How authority, informal influence, and institutional systems shape what leaders can achieve — and how to act wisely inside them.",
      },
      {
        title: "Advanced Public Speaking",
        detail:
          "Voice, structure, presence, and audience psychology for talks that persuade without theatrics.",
      },
      {
        title: "Strategic Decision Making",
        detail:
          "Frameworks for clarifying goals, weighing risk, reading context, and choosing among imperfect options.",
      },
      {
        title: "Influence and Persuasion Dynamics",
        detail:
          "Ethical persuasion: reciprocity, framing, narrative, and stakeholder alignment without manipulation.",
      },
    ],
    courses: ["Leadership and Power Structures", "Public Speaking"],
    heroImage:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2400&q=80",
  },
];

export function getFaculty(slug: string): Faculty | undefined {
  return faculties.find((faculty) => faculty.slug === slug);
}

export const facultyStats = [
  { value: "5,000+", label: "Students Trained" },
  { value: "500+", label: "Active Students" },
] as const;
