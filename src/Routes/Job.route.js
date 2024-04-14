import { Router } from "express";
import { isAdmin, verifyJwt } from "../Middelware/auth.middelware.js";
import {
  createCategory,
  createJob,
  createJobType,
  createTag,
  getAllCategory,
  getAllJob,
  getAllJobtype,
  getAllTag,
} from "../Controllers/Job.controller.js";
const router = Router();

router.route("/createcategory").post(verifyJwt, isAdmin, createCategory);
router.route("/createjobtype").post(verifyJwt, isAdmin, createJobType);
router
  .route("/createjob/:category/:jobType/:tags")
  .post(verifyJwt, isAdmin, createJob);
router.route("/createtag").post(verifyJwt, isAdmin, createTag);

router.route("/getcategory").get(verifyJwt, getAllCategory);
router.route("/getjobtype").get(verifyJwt, getAllJobtype);
router.route("/gettag").get(verifyJwt, getAllTag);
router.route("/getjobs").get(verifyJwt, getAllJob);
export default router;
