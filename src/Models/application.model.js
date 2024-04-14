import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "job" },
    candidate: { type: Schema.Types.ObjectId, ref: "User" },
    resume: { type: String },
    username: { type: String },
    email: { type: String },
    phone: { type: String },
    currentcompany: { type: String },
    desiredsalary: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
  },
  { timestamps: true }
);

const Application = mongoose.model("application", applicationSchema);
export { Application };
