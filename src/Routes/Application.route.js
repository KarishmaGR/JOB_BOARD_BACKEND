import { Router } from "express";
import {
  createnewApplication,
  getAllApplication,
  getAllResume,
  getallAppliedJob,
  updateApplicationstatus,
} from "../Controllers/Application.controller.js";
import { upload } from "../Middelware/multer.middleware.js";
import { isAdmin, verifyJwt } from "../Middelware/auth.middelware.js";
const router = Router();
router.route("/newapplication/:jobId").post(
  verifyJwt,
  upload.fields([
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  createnewApplication
);

router.route("/getallapplication").get(verifyJwt, isAdmin, getAllApplication);
router
  .route("/updateapplicationstatus/:applicationId")
  .put(verifyJwt, isAdmin, updateApplicationstatus);

router.route("/appliedjob").get(verifyJwt, getallAppliedJob);
router.route("/allresume").get(verifyJwt, isAdmin, getAllResume);
export default router;
