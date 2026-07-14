export type Testimonial = {
  name: string;
  role: string;
  faculty: string;
  quote: string;
  outcome: string;
};

/** Update `anchorIso` when a new batch opens; cycle rolls forward automatically. */
export const enrollment = {
  cycleDays: 12,
  seatsNote: "Limited seats each window",
  cadenceLabel: "Registration opens every 10–15 days",
  /** Last known / upcoming open (Asia/Karachi-friendly ISO). */
  anchorIso: "2026-07-18T10:00:00+05:00",
  remindCta: "Remind me on WhatsApp",
  notifyMessage:
    "Assalamualaikum. Please remind me when the next Al Hadid course enrollment window opens.",
} as const;

export const waitlist = {
  eyebrow: "Stay in the loop",
  title: "Get notified when seats open",
  body: "Leave your name and we’ll prepare a WhatsApp message so you never miss the next enrollment window.",
  placeholder: "Your name",
  cta: "Join waitlist on WhatsApp",
  messagePrefix:
    "Assalamualaikum. Please add me to the Al Hadid enrollment waitlist. My name is",
} as const;

export const testimonials: Testimonial[] = [
  {
    name: "Ayesha R.",
    role: "Graduate",
    faculty: "Complementary Medicine",
    quote:
      "Cupping and holistic modules gave me practical skills I use with family and clients. The teaching felt grounded, not trendy.",
    outcome: "Completed Cupping Therapy Diploma",
  },
  {
    name: "Hassan M.",
    role: "Student",
    faculty: "Mind Sciences",
    quote:
      "NLP Beginner clarified how I speak to myself under pressure. Short sessions, clear drills, and real application between classes.",
    outcome: "Building a daily mind practice",
  },
  {
    name: "Fatima K.",
    role: "Graduate",
    faculty: "Islamic Studies",
    quote:
      "The faculty connected spiritual psychology with living well today. I left with clarity—not just notes.",
    outcome: "Integrated study into family life",
  },
];

export const testimonialsSection = {
  eyebrow: "Student voices",
  title: "Stories from the journey",
  subheading:
    "Transformation is personal. Here is how learners describe their path through Al Hadid.",
} as const;

/** Returns the next enrollment open Date from the rolling cycle. */
export function getNextEnrollmentOpen(from = new Date()): Date {
  const cycleMs = enrollment.cycleDays * 24 * 60 * 60 * 1000;
  let next = new Date(enrollment.anchorIso);
  if (Number.isNaN(next.getTime())) {
    next = new Date(from.getTime() + cycleMs);
  }
  while (next.getTime() <= from.getTime()) {
    next = new Date(next.getTime() + cycleMs);
  }
  return next;
}
