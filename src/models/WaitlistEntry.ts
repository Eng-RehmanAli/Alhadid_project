import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const waitlistEntrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 1, max: 120 },
    city: { type: String, trim: true },
    profession: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    university: { type: String, trim: true },
    source: {
      type: String,
      enum: ["fellowship", "enrollment", "other"],
      default: "fellowship",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "waitlist_entries" },
);

waitlistEntrySchema.index({ email: 1 }, { sparse: true });
waitlistEntrySchema.index({ whatsapp: 1 }, { sparse: true });

export type WaitlistEntryDocument = InferSchemaType<
  typeof waitlistEntrySchema
> & {
  _id: Schema.Types.ObjectId;
};

export const WaitlistEntry: Model<WaitlistEntryDocument> =
  (models.WaitlistEntry as Model<WaitlistEntryDocument>) ??
  model<WaitlistEntryDocument>("WaitlistEntry", waitlistEntrySchema);
