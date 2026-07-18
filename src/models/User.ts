import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const USER_ROLES = ["student", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
      required: true,
    },
    avatarUrl: { type: String, default: null, trim: true },
    disabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
};

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ??
  model<UserDocument>("User", userSchema);

export function normalizeRole(role: unknown): UserRole {
  if (role === "admin") return "admin";
  return "student";
}
