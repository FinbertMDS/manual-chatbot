const manualChunks = [];
const { parseTextChunks } = require("../utils/parser");

const { OpenAI } = require("openai");
const { sleep } = require("../utils/util");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processManual(filePath) {
  const chunks = await parseTextChunks(filePath);
  manualChunks.push(...chunks);
}

async function askQuestion(question) {
  // In real version: embed question, search vector DB, send to LLM
  return `Giả lập trả lời cho câu hỏi: "${question}"`;
}

async function getEmbedding(text) {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return res.data[0].embedding;
  } catch (error) {
    console.log("Error:", error);
    if (error.status === 429) {
      console.error("⚠️ Rate limit hit. Waiting 1s before retrying...");
      await sleep(3000);
      return getEmbedding(text); // thử lại
    } else {
      throw error;
    }
  }
}

module.exports = { processManual, askQuestion, getEmbedding };
