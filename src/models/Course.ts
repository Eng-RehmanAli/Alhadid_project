import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const courseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    facultySlug: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    price: { type: String, required: true },
    compareAtPrice: { type: String },
    duration: { type: String },
    level: { type: String },
    badge: {
      type: String,
      enum: ["Popular", "New", "Limited"],
    },
    featured: { type: Boolean, default: false },
    seatsLeft: { type: Number },
    image: { type: String },
    modules: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
  },
  { collection: "courses", timestamps: true },
);

export type CourseDocument = InferSchemaType<typeof courseSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Course: Model<CourseDocument> =
  (models.Course as Model<CourseDocument>) ??
  model<CourseDocument>("Course", courseSchema);
