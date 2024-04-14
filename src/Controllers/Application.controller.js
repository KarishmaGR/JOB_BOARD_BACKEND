import { Application } from "../Models/application.model.js";
import { User } from "../Models/user.modle.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Job } from "../Models/job.model.js";
import { uploadonCloudinary } from "../Utils/Cloudinary.js";
import { mailSender } from "../Utils/MailSender.js";
import { Resume } from "../Models/Jobcategory.model.js";
import { response } from "express";

const createnewApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { email, username, phone, currentcompany, desiredsalary } = req.body;
  const userId = req.user._id;

  console.log("files", req.files);
  const resumelocalpath = req.files?.resume[0]?.path;
  if (!jobId && !userId) {
    res
      .status(400)
      .json(new ApiError(400, {}, "Please provide jobId and userId"));
  }
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(409).json(ApiError(400, "Job not found"));
  }

  console.log("id", userId);

  const users = await User.findById(userId);
  console.log("role", users);
  if (users.role !== "candidate") {
    return res
      .status(403)
      .json(
        new ApiError(
          400,
          {},
          "User not found or you are not Athorized to apply for job"
        )
      );
  }
  const uploadresume = await uploadonCloudinary(resumelocalpath);
  if (!uploadresume) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error while Uploading Resume !"));
  }
  const application = await Application.create({
    job: jobId,
    candidate: userId,
    resume: uploadresume.url,
    email,
    phone,
    username,
    currentcompany,
    desiredsalary,
  });

  const resumecreate = await Resume.create({
    user: userId,
    file: uploadresume.url,
  });

  if (!application) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Server Error While Submitting Application"));
  }

  const sentmailtouser = await mailSender(
    users.email,
    "Application for job",
    `Hello ${users.username} Thanks for applying for job at ${job.company} for ${job.title} We have received your Application `
  );
  const sendmailtoadmin = await mailSender(
    `karishmasvryadav@gmail.com`,
    "Application for job",
    `Hello Admin here is a application for job ${application.job}`
  );
  if (!sendmailtoadmin && !sentmailtouser) {
    return res
      .status(409)
      .json(new ApiResponse(409, "Something went wrong while sending mail"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Application Submitted Successfully", application)
    );
});

const getAllApplication = asyncHandler(async (req, res) => {
  const allApplication = await Application.find().populate("job");
  if (!allApplication) {
    return res
      .status(500)
      .json(new ApiError(500, {}, "Error While getting all Application"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Applications fetched Successfully", allApplication)
    );
});

const updateApplicationstatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  let { status } = req.body;
  if (!applicationId) {
    throw new ApiError(404, "", "Please Provide Application Id");
  }

  console.log("status", status);

  let rejectionReason;
  if (status === "rejected") {
    rejectionReason = req.body.rejectionReason;
    if (!rejectionReason) {
      return res
        .status(409)
        .json(new ApiResponse(409, "Please Specify Rejection Reason"));
    }
  }

  const application = await Application.findByIdAndUpdate(
    {
      _id: applicationId,
    },
    { status, rejectionReason },
    { new: true }
  );

  const user = await User.findById(application.candidate);
  if (!application) {
    throw new ApiError(404, {}, "Application Not Found");
  }

  const sentmailtouser = await mailSender(
    user.email,
    "Application Update",
    `Dear candidate your application has a status of ${status}`
  );
  if (!sentmailtouser) {
    throw new ApiError(500, {}, "Error While sending mail to user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Application status updated Successfully",
        application
      )
    );
});
const getallAppliedJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const getAllJobApplied = await Application.find({
    candidate: userId,
  }).populate("job");
  if (!getAllJobApplied || getAllJobApplied.lenght === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "You Have not applied to any job"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Application Fetched Successfully", getAllJobApplied)
    );
});

const getAllResume = asyncHandler(async (req, res) => {
  const allresume = await Resume.find();
  if (!allresume) {
    return res
      .status(500)
      .json(new ApiError(500, "Server Error While Fetching resums"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Resumes Fetched Successfully", allresume));
});
export {
  createnewApplication,
  getAllApplication,
  updateApplicationstatus,
  getallAppliedJob,
  getAllResume,
};
