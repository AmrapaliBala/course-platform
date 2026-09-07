import crypto from "crypto";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/email.js";
import { createToken } from "../utils/token.js";

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
      });
    }

    // Prevent requesting OTP too frequently
    if (
      user.lastOtpSentAt &&
      Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = generateOtp();

    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();

    await user.save();

    await sendOtpEmail(normalizedEmail, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not requested",
      });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
    }

    const incomingHash = hashOtp(otp);

    if (incomingHash !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is now consumed
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;

    await user.save();

    const token = createToken(user._id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};