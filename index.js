const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/admin/categoryRoutes");
const subjectRoutes = require("./routes/admin/subjectRoutes");
const subCategoryRoutes = require("./routes/admin/subCategoryRoutes");
const contentRoutes = require("./routes/admin/contentRoutes"); 
const purchaseRoutes = require('./routes/purchaseRoutes');
const studentContentRoutes = require("./routes/student/studentContentRoutes");
const packageRoutes = require("./routes/admin/packageRoutes");

const streamRoutes = require("./routes/admin/streamRoutes");

const app = express();
// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/admin", subjectRoutes);
app.use("/api/admin", subCategoryRoutes);
app.use("/api/admin", contentRoutes); 
app.use("/api/admin", packageRoutes);
app.use("/api/admin", streamRoutes);
app.use('/api/purchases', purchaseRoutes);

// Use the student content routes
app.use("/api/student/content", studentContentRoutes);

// Server start
// ✅ Root route – health check (ye upar hona chahiye)
app.get("/", (req, res) => res.send("Server is live"));

// ✅ Server start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
