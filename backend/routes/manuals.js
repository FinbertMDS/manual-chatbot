const express = require("express");
const router = express.Router();
const { getAllManuals } = require("../services/vectordb");

// GET /api/manuals
router.get("/", async (req, res) => {
  try {
    const manuals = await getAllManuals(); // Trả về list các metadata
    res.json(manuals);
  } catch (err) {
    console.error("Error fetching manuals:", err);
    res.status(500).json({ error: "Failed to fetch manuals" });
  }
});

module.exports = router;
