const express = require("express");
const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  resendRegisterOTP,
 
} = require("../controllers/authController");

// 📩 User Registration
router.post("/register", register);

// ✅ OTP Verification
router.post("/verify-register-otp", verifyOTP);

// 🔐 Login
router.post("/login", login);



// Resend
router.post("/resend-register-otp", resendRegisterOTP);




module.exports = router;
