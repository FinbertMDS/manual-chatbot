require("dotenv").config();
const { CohereClient } = require("cohere-ai");
const { sleep } = require("../utils/util");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// ✅ Batch embedding với retry
async function getEmbeddingsBatch(chunks) {
  let attempts = 0;
  const maxRetries = 5;

  while (attempts < maxRetries) {
    try {
      const res = await cohere.embed({
        model: "embed-multilingual-v3.0",
        texts: chunks,
        inputType: "search_document", // hoặc 'classification' tùy mục tiêu
      });

      return res.embeddings;
    } catch (error) {
      if (error.statusCode === 429 || error.code === "rate_limit_exceeded") {
        attempts++;
        console.warn(`⚠️ Cohere Rate limit — retry ${attempts}/${maxRetries}`);
        await sleep(1000 * attempts);
      } else {
        console.error("❌ Cohere embedding error:", error.message);
        throw error;
      }
    }
  }

  throw new Error("Too many retries for Cohere embeddings.");
}

module.exports = { getEmbeddingsBatch };
