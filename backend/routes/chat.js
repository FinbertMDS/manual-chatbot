const express = require("express");
const { getEmbedding } = require("../services/embedding");
const { searchSimilar } = require("../services/vectordb");
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    const embedding = await getEmbedding(question);
    const results = await searchSimilar(embedding, 3);

    const context = results.documents[0].join("\n---\n");
    const prompt = `Dựa vào tài liệu sau, hãy trả lời câu hỏi:\n\n${context}\n\nCâu hỏi: ${question}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

module.exports = router;
