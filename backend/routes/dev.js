// routes/dev.js
const express = require("express");
const router = express.Router();
const { clearAllManuals } = require("../services/vectordb");

router.post('/clear', async (req, res) => {
  await clearAllManuals();
  res.json({ message: 'All manuals cleared' });
});

module.exports = router;
