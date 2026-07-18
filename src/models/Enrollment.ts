import {
  Schema,
  model,
  models,
  type Model,
  type Types,
} from "mongoose";

export type EnrollmentStatus = "active" | "completed" | "revoked";

export type EnrollmentDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseSlug: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  enrolledBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const enrollmentSchema = new Schema<EnrollmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseSlug: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ["active", "completed", "revoked"],
      default: "active",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    enrolledBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "enrollments", timestamps: true },
);

enrollmentSchema.index({ userId: 1, courseSlug: 1 }, { unique: true });

export const Enrollment: Model<EnrollmentDocument> =
  (models.Enrollment as Model<EnrollmentDocument>) ??
  model<EnrollmentDocument>("Enrollment", enrollmentSchema);
