import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { User } from "../Models/user.modle.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { mailSender } from "../Utils/MailSender.js";
const genetaterefreshaccesstoken = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // skip validation on save
    return { refreshToken, accessToken };
  } catch (error) {
    console.log("Error while generting Tokens", error);
  }
};
const signup = asyncHandler(async (req, res) => {
  const { username, email, password, contactNumber } = req.body;
  // Check if All Details are there or not
  if (!username || !email || !password || !contactNumber) {
    return res.status(403).json(new ApiError(403, "All Fields Are Required"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(new ApiError(401, "User Already Exist"));
  }

  const user = await User.create({
    username,
    email,
    contactNumber,
    password,
  });
  if (!user) {
    return res
      .status(500)
      .json(new ApiError(500, "User Not Registered Please Try Again"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User Registered Successfully"));
});

// Login controller for authenticating users
const login = asyncHandler(async (req, res) => {
  // Get email and password from request body
  const { email, password } = req.body;
  // Check if email or password is missing
  if (!email || !password) {
    // Return 400 Bad Request status code with error message
    return res
      .status(400)
      .json(new ApiResponse(409, "Please Enter All Fields"));
  }

  const user = await User.findOne({ email });
  const isPasswordMatch = await user.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Credencials Do not Match Please try again"));
  }
  if (!user) {
    return res.status(401).json(new ApiResponse(404, "User Not Registered"));
  }
  // Generate JWT token and Compare Password
  const { refreshToken, accessToken } = await genetaterefreshaccesstoken(
    user._id
  );

  // Set cookie for token and return success response
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const loggedInuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToke", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(200, "User LoggedIn successfully", {
        user: loggedInuser,
        accessToken,
        refreshToken,
      })
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "User Logged Out SuccessFully", {}));
});
const resetPasswordToken = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({
      success: false,
      message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
    });
  }
  const token = crypto.randomBytes(20).toString("hex");

  const updatedDetails = await User.findOneAndUpdate(
    { email: email },
    {
      refreshToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    },
    { new: true }
  );

  const url = `http://localhost:3000/resetpassword/${token}`;
  //const url = `https://localhost:5173/update-password/${token}`;

  const mail = await mailSender(
    email,
    "Password Reset",
    `Your Link for email verification is ${url}. Please click this url to reset your password.`
  );

  if (!mail) {
    return res.status(500).json(new ApiResponse(500, "Email Not sent"));
  }

  return res.json(
    new ApiResponse(200, "Reset Password Token Sent Successfully")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const userDetails = await User.findOne({ refreshToken: token });
  if (!userDetails) {
    return res.json(new ApiResponse(401, "Invalid Token"));
  }
  if (!(userDetails.resetPasswordExpires > Date.now())) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Token Expired Please Try Again"));
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const updatepassword = await User.findOneAndUpdate(
    { refreshToken: token },
    { password: hashpassword },
    { new: true },
    { validateBeforeSave: true }
  );
  if (!updatepassword) {
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset Successfully"));
});

export { signup, login, resetPassword, resetPasswordToken, logout };
