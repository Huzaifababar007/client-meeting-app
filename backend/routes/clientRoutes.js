const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// Add new client
router.post("/", async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("❌ Error saving client:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE a client
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a client
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    console.error("❌ Error fetching clients:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ GET a single client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
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
