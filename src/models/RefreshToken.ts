import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "refresh_tokens" },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema> & {
  _id: Schema.Types.ObjectId;
};

export const RefreshToken: Model<RefreshTokenDocument> =
  (models.RefreshToken as Model<RefreshTokenDocument>) ??
  model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema);
