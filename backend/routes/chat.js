const express = require("express");
const router = express.Router();
const { askQuestion } = require("../services/embedding");

router.post("/", async (req, res) => {
  const { question } = req.body;
  const answer = await askQuestion(question);
  res.json({ answer });
});

module.exports = router;
