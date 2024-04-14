import { asyncHandler } from "../Utils/asyncHandler.js";
import { JobCategory, JobType, Tag } from "../Models/Jobcategory.model.js";
import { Job } from "../Models/job.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";

const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  if (!category) {
    return res
      .status(409)
      .json(new ApiResponse(409, "Please Enter Category Name"));
  }

  const newcategory = await JobCategory.create({ category });
  if (!newcategory) {
    return res
      .status(500)
      .json(new ApiError(500, "Server Error While Creating new Categry"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Category created Successfully", newcategory));
});

const createJobType = asyncHandler(async (req, res) => {
  const { jobtype } = req.body;
  if (!jobtype) {
    res.status(409).json(new ApiResponse(409, "Please Enter Job Type"));
  }

  const newjobtype = await JobType.create({ jobtype });
  if (!newjobtype) {
    return res
      .status(500)
      .json(new ApiError(500, "Server Error While Creating Job type"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Job Type created Successfully", newjobtype));
});

const createTag = asyncHandler(async (req, res) => {
  const { tag } = req.body;

  if (!tag) {
    res.status(409).json(new ApiResponse(409, "Please Enter Tag"));
  }

  const tagtype = await Tag.create({ tag });
  if (!tagtype) {
    return res
      .status(500)
      .json(new ApiError(500, "Server Error While Creating Tag"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tag created Successfully", tagtype));
});

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    experienceRequired,
    salary,
    description,
    skills,
    customefields,
  } = req.body;
  const { category, jobType, tags } = req.params;

  if ((!category && !jobType && !tags) || !skills || !skills.length) {
    res.status(409).json(new ApiResponse(409, "Please enter Required Fields"));
  }

  const newjob = await Job.create({
    title,
    company,
    experienceRequired,
    salary,
    skills,
    category,
    jobType,
    tags,
    customefields,
    description,
  });

  if (!newjob) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Something went wrong while creating new Job")
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "New Job Created Succeesfully", newjob));
});

const getAllCategory = asyncHandler(async (req, res) => {
  console.log("job category");
  const allcategory = await JobCategory.find();
  if (!allcategory || allcategory.length === 0) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error While Fetching Category"));
  }
  return res.status(200).json(new ApiResponse(200, "Success", allcategory));
});
const getAllJobtype = asyncHandler(async (req, res) => {
  const alljobtype = await JobType.find();
  if (!alljobtype) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error While Fetching Job Type"));
  }
  return res.status(200).json(new ApiResponse(200, "Success", alljobtype));
});
const getAllTag = asyncHandler(async (req, res) => {
  const alltag = await Tag.find();
  if (!alltag) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error While Fetching Tag", alltag));
  }
  return res.status(200).json(new ApiResponse(200, "Success", alltag));
});
const getAllJob = asyncHandler(async (req, res) => {
  const allJob = await Job.find();
  if (!allJob) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error While Fetching Tag", allJob));
  }
  return res.status(200).json(new ApiResponse(200, "Success", allJob));
});

export {
  createCategory,
  createJob,
  createTag,
  createJobType,
  getAllCategory,
  getAllJob,
  getAllJobtype,
  getAllTag,
};
