import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const priceSchema = new Schema(
  {
    label: { type: String, required: true },
    amount: { type: String, required: true },
  },
  { _id: false },
);

const bookSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    praise: { type: [String], default: [] },
    prices: { type: [priceSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { collection: "books", timestamps: true },
);

export type BookDocument = InferSchemaType<typeof bookSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Book: Model<BookDocument> =
  (models.Book as Model<BookDocument>) ??
  model<BookDocument>("Book", bookSchema);
