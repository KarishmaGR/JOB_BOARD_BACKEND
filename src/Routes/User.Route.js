import { Router } from "express";
import {
  login,
  logout,
  resetPassword,
  resetPasswordToken,
  signup,
} from "../Controllers/User.controller.js";
import { verifyJwt } from "../Middelware/auth.middelware.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);
router.route("/resetpasswordtoken").post(resetPasswordToken);
router.route("/update-password/:token").put(resetPassword);
export default router;
