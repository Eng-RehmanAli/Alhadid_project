import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const waitlistEntrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "waitlist_entries" },
);

export type WaitlistEntryDocument = InferSchemaType<
  typeof waitlistEntrySchema
> & {
  _id: Schema.Types.ObjectId;
};

export const WaitlistEntry: Model<WaitlistEntryDocument> =
  (models.WaitlistEntry as Model<WaitlistEntryDocument>) ??
  model<WaitlistEntryDocument>("WaitlistEntry", waitlistEntrySchema);
