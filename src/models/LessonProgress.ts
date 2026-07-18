import {
  Schema,
  model,
  models,
  type Model,
  type Types,
} from "mongoose";

export type LessonProgressDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  courseSlug: string;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const lessonProgressSchema = new Schema<LessonProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
    },
    courseSlug: { type: String, required: true, trim: true, index: true },
    completedAt: { type: Date, default: Date.now },
  },
  { collection: "lesson_progress", timestamps: true },
);

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress: Model<LessonProgressDocument> =
  (models.LessonProgress as Model<LessonProgressDocument>) ??
  model<LessonProgressDocument>("LessonProgress", lessonProgressSchema);
