import mongoose, { Schema } from "mongoose";
const applicationStatusUpdateSchema = new Schema(
  {
    application: { type: Schema.Types.ObjectId, ref: "Application" },
    status: { type: String, enum: ["pending", "approved", "rejected"] },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ApplicationStatus = mongoose.model(
  "applicationstatus",
  applicationStatusUpdateSchema
);

export { ApplicationStatus };
