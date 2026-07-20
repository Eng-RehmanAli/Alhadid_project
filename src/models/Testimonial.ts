import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    imagePosition: {
      type: String,
      enum: ["center", "top"],
      default: "top",
    },
  },
  { collection: "testimonials", timestamps: true },
);

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  (models.Testimonial as Model<TestimonialDocument>) ??
  model<TestimonialDocument>("Testimonial", testimonialSchema);
