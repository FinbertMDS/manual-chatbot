const express = require("express");
const router = express.Router();
const { getEmbeddingsBatch } = require("../services/embedding");
const { searchSimilar } = require("../services/vectordb");
// const { createAnswerFromContext } = require("../services/answer"); // optional nếu muốn tóm tắt trả lời

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // 👉 1. Tạo embedding từ message (Cohere)
    const [queryEmbedding] = await getEmbeddingsBatch([message]);

    // 👉 2. Tìm các đoạn văn gần nhất từ vectordb
    const topMatches = await searchSimilar(queryEmbedding, 3); // lấy top 3 context gần nhất

    // 👉 3. Trả lại kết quả (hoặc bạn có thể ghép lại thành 1 câu trả lời)
    res.json({
      results: topMatches,
      context: topMatches.map((doc) => doc.text).join("\n---\n"),
    });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;
