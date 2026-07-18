import type { LessonType } from "@/models/Lesson";

export type SeedLesson = {
  slug: string;
  title: string;
  type: LessonType;
  content: string;
  durationMinutes?: number;
};

export type SeedModule = {
  title: string;
  lessons: SeedLesson[];
};

export type SeedCurriculum = {
  courseSlug: string;
  modules: SeedModule[];
};

/**
 * Sample learning curricula for Phase 1.
 * Marketing copy stays in `src/data/courses.ts`; lesson bodies live here / Mongo.
 */
export const sampleCurricula: SeedCurriculum[] = [
  {
    courseSlug: "nlp-beginner",
    modules: [
      {
        title: "Foundations of NLP",
        lessons: [
          {
            slug: "welcome-to-nlp",
            title: "Welcome to NLP Beginner",
            type: "text",
            durationMinutes: 8,
            content: `Welcome to the NLP Beginner program at Al Hadid.

Neuro-Linguistic Programming (NLP) is a practical framework for understanding how language, thought patterns, and behaviour interact — and how you can use that awareness to communicate more clearly and change unhelpful habits.

In this course you will:
- Learn the core NLP presuppositions
- Practise sensory acuity and rapport
- Build a simple outcomes framework you can use every day

Move through each lesson in order. Mark a lesson complete when you have read or watched it fully.`,
          },
          {
            slug: "nlp-presuppositions",
            title: "Core NLP Presuppositions",
            type: "text",
            durationMinutes: 12,
            content: `NLP rests on a set of useful assumptions — not absolute truths, but working beliefs that open more choices.

Key presuppositions in this module:
1. The map is not the territory — your model of the world is not the world itself.
2. People respond to their maps, not to reality directly.
3. Behind every behaviour is a positive intention.
4. People already have the resources they need; they may need a better strategy.
5. There is no failure, only feedback.

Reflection: Write down one situation this week where changing your “map” would change your response.`,
          },
          {
            slug: "sensory-acuity-intro",
            title: "Sensory Acuity Introduction",
            type: "video",
            durationMinutes: 10,
            content:
              "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0",
          },
        ],
      },
      {
        title: "Rapport and Outcomes",
        lessons: [
          {
            slug: "building-rapport",
            title: "Building Rapport",
            type: "text",
            durationMinutes: 15,
            content: `Rapport is the felt sense of connection that makes influence ethical and effective.

Practice this week:
- Match and mirror posture and breathing lightly (never mock)
- Pace language: use the other person’s key words before leading
- Calibrate: notice skin tone, breathing rate, and micro-expressions

Exercise: Have a 10-minute conversation where you consciously pace first, then gently lead the energy of the talk.`,
          },
          {
            slug: "well-formed-outcomes",
            title: "Well-Formed Outcomes",
            type: "text",
            durationMinutes: 14,
            content: `A well-formed outcome is stated so your mind and behaviour can organise around it.

Checklist:
1. Stated in the positive (what you want, not what you don’t want)
2. Under your control / initiated by you
3. Specific and sensory-based (how will you know you’ve got it?)
4. Ecological — good for you and the wider system
5. Has a first step you can take today

Write one well-formed outcome for the next 30 days and bring it to class discussion.`,
          },
          {
            slug: "nlp-beginner-handbook",
            title: "NLP Beginner Practice Sheet (PDF)",
            type: "pdf",
            durationMinutes: 5,
            content:
              "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
          },
        ],
      },
    ],
  },
  {
    courseSlug: "cupping-therapy-diploma",
    modules: [
      {
        title: "History and Safety",
        lessons: [
          {
            slug: "hijama-overview",
            title: "Hijama: History and Context",
            type: "text",
            durationMinutes: 10,
            content: `Cupping (Hijama) has deep roots in prophetic medicine and traditional practice across many cultures.

This diploma covers theory, hygiene, client care, and supervised practical technique. Always practise within your scope and local regulations.

Learning goals for Module 1:
- Understand historical and contemporary contexts
- Know absolute contraindications
- Prepare a clean, professional treatment space`,
          },
          {
            slug: "safety-hygiene",
            title: "Safety, Hygiene, and Client Care",
            type: "text",
            durationMinutes: 18,
            content: `Safety is non-negotiable.

Before every session:
- Screen for contraindications (e.g. certain skin conditions, blood disorders, pregnancy — follow your clinical checklist)
- Obtain informed consent
- Use single-use or properly sterilised equipment as required
- Maintain documentation

Hand hygiene, surface disinfection, and sharps disposal must follow your clinic protocol.`,
          },
        ],
      },
      {
        title: "Practical Foundations",
        lessons: [
          {
            slug: "cupping-demo",
            title: "Dry Cupping Demonstration",
            type: "video",
            durationMinutes: 12,
            content:
              "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0",
          },
          {
            slug: "technique-notes",
            title: "Technique Notes and Aftercare",
            type: "text",
            durationMinutes: 12,
            content: `Aftercare guidance for clients typically includes:
- Hydration
- Avoiding intense exercise for 24 hours where advised
- Monitoring marks and reporting unusual symptoms
- Scheduling follow-up as clinically appropriate

Record cup type, duration, sites, and client response in your notes.`,
          },
        ],
      },
    ],
  },
];
