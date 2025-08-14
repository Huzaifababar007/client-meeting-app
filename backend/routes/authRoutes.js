const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      phone: user.phone
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token
    });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      phone: user.phone
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Profile fetch error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { fullName, email, phone, profilePicture } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      phone: user.phone
    };

    res.json({
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("❌ Profile update error:", error.message);
    res.status(500).json({ error: "Server error during profile update" });
  }
});

// Forgot password (send reset email)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Send an email with the reset link
    // 3. Store the reset token in the database with expiration

    res.json({ message: "Password reset instructions sent to your email" });
  } catch (error) {
    console.error("❌ Forgot password error:", error.message);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Password reset error:", error.message);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

module.exports = router;
