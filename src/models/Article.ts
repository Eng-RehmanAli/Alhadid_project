import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const articleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    publishedDate: { type: String, required: true },
    facultySlug: { type: String, trim: true, index: true },
    body: { type: [String], default: [] },
  },
  { collection: "articles", timestamps: true },
);

export type ArticleDocument = InferSchemaType<typeof articleSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Article: Model<ArticleDocument> =
  (models.Article as Model<ArticleDocument>) ??
  model<ArticleDocument>("Article", articleSchema);
