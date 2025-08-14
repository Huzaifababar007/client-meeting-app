const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to extract user ID from token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add new client
router.post("/", authenticateUser, async (req, res) => {
  try {
    const newClient = new Client({
      ...req.body,
      userId: req.userId
    });
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("❌ Error saving client:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE a client
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a client
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET all clients for current user
router.get("/", authenticateUser, async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error("❌ Error fetching clients:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ GET a single client by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    
    res.status(200).json(client);
  } catch (error) {
    console.error("❌ Error fetching client by ID:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
