const express = require("express");
const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  verifyLoginOTP,
  resendRegisterOTP,
  resendLoginOTP
} = require("../controllers/authController");

// 📩 User Registration
router.post("/register", register);

// ✅ OTP Verification
router.post("/verify-register-otp", verifyOTP);

// 🔐 Login
router.post("/login", login);

// ✅ Add this new route
router.post("/verify-login-otp", verifyLoginOTP);

// Resend
router.post("/resend-register-otp", resendRegisterOTP);
router.post("/resend-login-otp", resendLoginOTP);



module.exports = router;
