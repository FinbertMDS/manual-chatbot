const express = require("express");
const router = express.Router();
const { getEmbeddingsBatch } = require("../services/embedding");
const { searchSimilar } = require("../services/vectordb");
// const { createAnswerFromContext } = require("../services/answer"); // optional nếu muốn tóm tắt trả lời

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    // 👉 1. Tạo embedding từ question (Cohere)
    const [queryEmbedding] = await getEmbeddingsBatch([question]);
    
    // 👉 2. Tìm các đoạn văn gần nhất từ vectordb
    const searchResults = await searchSimilar(queryEmbedding, 5); // lấy top 3 context gần nhất
    
    const topMatches = searchResults.documents[0].map((text, i) => ({
      text,
      id: searchResults.ids[0][i],
      score: searchResults.distances[0][i],
    }));
    
    // 👉 3. Trả lại kết quả (hoặc bạn có thể ghép lại thành 1 câu trả lời)
    const context = topMatches.map((doc) => doc.text).join('\n---\n');

    // 3. Ask Cohere to generate an answer
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: `Bạn là trợ lý AI. Dựa trên thông tin dưới đây, hãy trả lời câu hỏi của người dùng.\n\nThông tin:\n${context}\n\nCâu hỏi: ${question}\n\nTrả lời:`,
      maxTokens: 300,
      temperature: 0.3,
    });

    const answer = response.generations?.[0]?.text || "Xin lỗi, tôi không thể tạo câu trả lời.";

    // 4. Return full result
    res.json({
      answer,
      results: topMatches,
      context,
    });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;
