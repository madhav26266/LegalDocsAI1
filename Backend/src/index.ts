import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db";
import "./config/passport";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import pdfRoutes from "./routes/pdfRoutes"; 

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Backend is running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", pdfRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
