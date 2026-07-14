export const site = {
  name: "Al Hadid",
  networkName: "Muslims Network",
  networkTagline: "Al Hadid Muslims Network",
  fullName: "Al Hadid — Muslims Network · Institute for Human Development",
  tagline: "Institute for Human Development and Transformation",
  description:
    "Al Hadid integrates ancient wisdom with contemporary knowledge to cultivate holistic human development across mind, body, and spirit.",
  heroHeadline:
    "The transformation of the human being is the foundation of all meaningful change",
  heroImage:
    "https://images.unsplash.com/photo-1481627834876-b7833e1b5bf8?auto=format&fit=crop&w=2400&q=80",
  logoSrc: "/brand/al-hadid-logo.png",
  stats: [
    { value: "5,000+", label: "Students Trained" },
    { value: "500+", label: "Active Students" },
  ],
  facultiesIntro:
    "Four distinct divisions dedicated to the comprehensive development of human potential, bridging timeless traditions with modern science.",
  faculties: [
    {
      slug: "complementary-medicine",
      title: "Complementary Medicine",
      description:
        "Integrating traditional and modern healing practices including acupuncture, Unani medicine, herbal remedies, nutrition science, and cupping therapy for holistic wellness.",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80",
    },
    {
      slug: "mind-sciences",
      title: "Mind Sciences",
      description:
        "Exploring cognitive science, neuro-linguistic programming, applied psychology, and the Silva Method to unlock human potential and psychological transformation.",
      image: "/brand/mind-sciences.jpg",
    },
    {
      slug: "islamic-studies",
      title: "Islamic Studies",
      description:
        "Studying Quranic thought, Seerah, spiritual psychology, and Islamic ethics to integrate faith-based wisdom with contemporary human development.",
      image:
        "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80",
    },
    {
      slug: "leadership-strategy",
      title: "Leadership and Strategy",
      description:
        "Mastering decision-making frameworks, influence dynamics, systems thinking, and historical leadership models for organizational and personal excellence.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  philosophyTitle:
    "Integrating wisdom traditions with contemporary knowledge",
  philosophy: [
    "Al Hadid recognizes that true human development requires the harmonious integration of multiple dimensions: physical health, mental clarity, spiritual depth, and practical wisdom.",
    "Our approach draws from the rich heritage of traditional healing arts, contemplative sciences, sacred texts, and strategic thinking, while remaining grounded in rigorous scholarship and empirical understanding.",
  ],
  pillars: [
    {
      title: "Holistic development",
      description:
        "Addressing the complete spectrum of human potential across physical, mental, emotional, and spiritual dimensions.",
    },
    {
      title: "Traditional wisdom",
      description:
        "Drawing from time-tested practices and philosophical frameworks that have guided human flourishing for centuries.",
    },
    {
      title: "Contemporary application",
      description:
        "Adapting ancient insights to address the unique challenges and opportunities of modern life.",
    },
  ],
  ctaTitle: "Begin your journey of transformation",
  ctaBody:
    "Explore our comprehensive programs designed to cultivate wisdom, health, and purposeful action.",
  contactEmail: "mailto:founder@alhadid.org",
  contact: {
    title: "Contact us",
    intro:
      "We welcome inquiries about our programs, philosophy, and approach to holistic human development.",
    email: "founder@alhadid.org",
    emailHref: "mailto:founder@alhadid.org",
    phone: "+92 3124193119",
    phoneHref: "tel:+923124193119",
    phoneDisplay: "+92 312 4193119",
    addressLines: ["Al Hadid Centre", "Sahiwal, Pakistan"],
    hours: [
      { days: "Monday – Friday", time: "9:00 AM – 5:00 PM" },
      { days: "Saturday", time: "10:00 AM – 2:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },
} as const;
