import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const keyAreaDetailSchema = new Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const facultySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    titleShort: { type: String, trim: true },
    description: { type: String, required: true },
    overview: { type: [String], default: [] },
    academy: { type: String },
    registration: { type: String },
    philosophy: { type: [String], default: [] },
    approach: { type: [String], default: [] },
    whoFor: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
    keyAreas: { type: [String], default: [] },
    keyAreasDetail: { type: [keyAreaDetailSchema], default: [] },
    courses: { type: [String], default: [] },
    heroImage: { type: String, required: true },
  },
  { collection: "faculties", timestamps: true },
);

export type FacultyDocument = InferSchemaType<typeof facultySchema> & {
  _id: Schema.Types.ObjectId;
};

export const Faculty: Model<FacultyDocument> =
  (models.Faculty as Model<FacultyDocument>) ??
  model<FacultyDocument>("Faculty", facultySchema);
