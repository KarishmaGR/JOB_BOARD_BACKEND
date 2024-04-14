import mongoose, { Schema } from "mongoose";

const jobCategorySchema = new Schema(
  {
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

// Define Job Type Schema
const jobTypeSchema = new Schema(
  {
    jobtype: {
      type: String,
    },
  },
  { timestamps: true }
);

// Define Tag Schema
const tagSchema = new Schema(
  {
    tag: {
      type: String,
    },
  },
  { timestamps: true }
);

const resumeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    file: String,
  },
  { timestamps: true }
);

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);
const JobType = mongoose.model("JobType", jobTypeSchema);
const Resume = mongoose.model("Resume", resumeSchema);

const Tag = mongoose.model("Tag", tagSchema);

export { JobCategory, JobType, Tag, Resume };
