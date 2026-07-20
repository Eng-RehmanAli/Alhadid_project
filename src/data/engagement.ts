export type Testimonial = {
  name: string;
  role: string;
  /** Longer profile text when the role line is not enough. */
  bio?: string;
  image: string;
  /** Optional crop focus for portrait photos. */
  imagePosition?: "center" | "top";
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

/** Keep name ↔ image pairs exact — do not reorder without updating photos. */
export const testimonials: Testimonial[] = [
  {
    name: "Eman Fatima",
    role: "Founder of Imaniyah Institute · Life Coach & Psychology Expert",
    bio: "She is the Founder of Imaniyah Institute and a proud alumna of Al Hadid. As a Life Coach, Psychology Expert, and Mentor, she empowers individuals through personal and professional development. She conducts training in Neuro-Linguistic Programming (NLP) and the Silva Method, helping people strengthen their mindset, confidence, and overall growth while inspiring lifelong learning and transformation.",
    image: "/brand/eman-fatima.png",
    imagePosition: "top",
  },
  {
    name: "Hammad Kalim Malhi",
    role: "CEO of Hikson Academy · Medical Educator & Author",
    bio: "CEO of Hikson Academy, a medical educator, and author specializing in Integrative Medicine, Acupuncture, Dry Needling, Hijama, Herbal Medicine, and Clinical Diagnosis. He has trained over 1,000 students and healthcare professionals and authored The Grammar of the Human Body.",
    image: "/brand/hammad-kalim-malhi.png",
    imagePosition: "top",
  },
  {
    name: "Dr. Waseem Ahmed",
    role: "Director of Al Hadid · Health Educator & Alternative Medicine Expert",
    bio: "He serves as the Director of Al Hadid, leading the organization's academic, administrative, and strategic initiatives. As the trusted right hand of Founder Dr. Muzammil Ramzan, he plays a key role in managing the academy's operations and growth. A skilled public speaker, health educator, and Alternative Medicine expert, he is recognized for his leadership, management, and commitment to advancing education, innovation, and professional development.",
    image: "/brand/dr-waseem-ahmed.png",
    imagePosition: "top",
  },
  {
    name: "M. Umer Haq",
    role: "Doctor of Physical Therapy (4th year) · IFCA & IREPS Certified Fitness Trainer",
    bio: "Certified in stroke rehab, cupping therapy, kinesiotaping, and dry needling. Biology lecturer at Al Hafiz Science Academy, General Secretary of Punjab White Coat Society (PWCS), and Management Head of Neurophysio Welfare Society (NWPS).",
    image: "/brand/m-umer-haq.png",
    imagePosition: "top",
  },
  {
    name: "Amna Touqir",
    role: "Educator · Psychologist · Trainer · Community Leader",
    bio: "Educator, psychologist, trainer, social worker, freelancer, media professional, and community leader recognized for contributions to education, mental health, youth development, women empowerment, and social impact. Recipient of the Pride of Pakistan Golden Medal, Changemaker Award, and Talent Excellence Award. Trainer, speaker, and co-author of Baz Gasht Khyal.",
    image: "/brand/amna-touqir.png",
    imagePosition: "top",
  },
  {
    name: "Dr. Rizwan Afzal PT",
    role: "Physiotherapist · Author · Founder, The Physio Network Community",
    bio: "Physiotherapist, author, and community leader from Nawabshah, Sindh. Earned his Doctor of Physical Therapy (DPT) from Liaquat University of Medical & Health Sciences, Jamshoro, and completed training at Liaquat National Hospital, Karachi. Founder of The Physio Network Community, author of Rebuilt by Allah (Google Books), and Ex-Plus Member of Physiopedia Official.",
    image: "/brand/dr-rizwan-afzal.png",
    imagePosition: "top",
  },
];

export const testimonialsSection = {
  eyebrow: "Top students",
  title: "Leaders shaped at Al Hadid",
  subheading:
    "Standout graduates whose work now reaches clinics, institutes, and communities across Pakistan.",
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
