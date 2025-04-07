const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// 🔐 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📩 Send OTP
const sendOTP = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();
  console.log("OTP Sent:", otp);
};

// 📝 Register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, referredBy, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot register as admin." });
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const referralCode = crypto.randomBytes(4).toString("hex");
    const user = await User.create({
      name,
      email,
      phone,
      password,
      referralCode,
      referredBy,
      role, // 🟢 add role here
    });

    await sendOTP(user);

    res.status(201).json({
      success: true,
      message: "OTP sent to verify your account.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
};

// ✅ Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ success: true, message: "Account verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed. Please try again." });
  }
};

// 🔑 Login
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your account first." });
    }

    await sendOTP(user);

    res.json({
      success: true,
      message: "OTP sent for login verification.",
    });
  } catch (error) {
    console.error("Login OTP Send Error:", error);
    res.status(500).json({ success: false, message: "Failed to send login OTP." });
  }
};

// ✅ Verify Login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login OTP Error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed." });
  }
};

// 🔁 Resend OTP for Registration
const resendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified." });
    }

    await sendOTP(user);

    res.json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP." });
  }
};

// 🔁 Resend OTP for Login
const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your account first." });
    }

    await sendOTP(user);

    res.json({
      success: true,
      message: "Login OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend Login OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to resend login OTP." });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  verifyLoginOTP,
  resendRegisterOTP,
  resendLoginOTP,
};
