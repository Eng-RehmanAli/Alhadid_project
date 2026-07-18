import {
  Schema,
  model,
  models,
  type Model,
  type Types,
} from "mongoose";

export const LESSON_TYPES = ["video", "text", "pdf"] as const;
export type LessonType = (typeof LESSON_TYPES)[number];

export const SUMMARY_STATUSES = [
  "idle",
  "processing",
  "ready",
  "failed",
] as const;
export type SummaryStatus = (typeof SUMMARY_STATUSES)[number];

export type LessonDocument = {
  _id: Types.ObjectId;
  courseSlug: string;
  moduleTitle: string;
  moduleIndex: number;
  slug: string;
  title: string;
  type: LessonType;
  content: string;
  cloudinaryPublicId?: string;
  order: number;
  durationMinutes?: number;
  transcript?: string;
  summary?: string;
  summaryStatus?: SummaryStatus;
  summaryError?: string;
  summaryGeneratedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const lessonSchema = new Schema<LessonDocument>(
  {
    courseSlug: { type: String, required: true, trim: true, index: true },
    moduleTitle: { type: String, required: true, trim: true },
    moduleIndex: { type: Number, required: true, min: 0 },
    slug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: LESSON_TYPES,
      required: true,
    },
    /** Video URL, PDF URL, or lesson body text depending on `type`. */
    content: { type: String, required: true },
    cloudinaryPublicId: { type: String, trim: true },
    order: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, min: 0 },
    /** Full speech-to-text produced by Gemini for a video lesson. */
    transcript: { type: String },
    /** Short student-facing summary produced by Gemini. */
    summary: { type: String },
    summaryStatus: {
      type: String,
      enum: SUMMARY_STATUSES,
      default: "idle",
    },
    summaryError: { type: String },
    summaryGeneratedAt: { type: Date },
  },
  { collection: "lessons", timestamps: true },
);

lessonSchema.index({ courseSlug: 1, slug: 1 }, { unique: true });
lessonSchema.index({ courseSlug: 1, order: 1 });

export const Lesson: Model<LessonDocument> =
  (models.Lesson as Model<LessonDocument>) ??
  model<LessonDocument>("Lesson", lessonSchema);
