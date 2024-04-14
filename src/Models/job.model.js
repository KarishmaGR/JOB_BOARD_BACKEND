import mongoose, { Schema } from "mongoose";
const JobSchema = new Schema(
  {
    title: String,
    company: String,
    category: { type: Schema.Types.ObjectId, ref: "JobCategory" },
    jobType: { type: Schema.Types.ObjectId, ref: "JobType" },
    tags: { type: Schema.Types.ObjectId, ref: "Tag" },
    skills: [String],
    experienceRequired: String,
    description: String,
    salary: String,
    customefields: {
      type: Schema.Types.Mixed,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("job", JobSchema);

export { Job };
