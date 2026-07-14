import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    faculty: { type: String, required: true, trim: true },
    quote: { type: String, required: true },
    outcome: { type: String, required: true },
  },
  { collection: "testimonials", timestamps: true },
);

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  (models.Testimonial as Model<TestimonialDocument>) ??
  model<TestimonialDocument>("Testimonial", testimonialSchema);
