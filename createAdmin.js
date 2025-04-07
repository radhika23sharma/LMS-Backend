//createAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User.js");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (!adminExists) {
      const newAdmin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        phone: "9999999999",
        password: "Admin@123",
        role: "admin",
        isVerified: true,
      });
      await newAdmin.save();
      console.log("✅ Admin created");
    } else {
      console.log("⚠️ Admin already exists");
    }

    mongoose.disconnect();
  })
  .catch((err) => console.error("MongoDB Error:", err));
