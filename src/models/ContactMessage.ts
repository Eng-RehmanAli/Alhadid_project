import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "contact_messages" },
);

export type ContactMessageDocument = InferSchemaType<
  typeof contactMessageSchema
> & {
  _id: Schema.Types.ObjectId;
};

export const ContactMessage: Model<ContactMessageDocument> =
  (models.ContactMessage as Model<ContactMessageDocument>) ??
  model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
