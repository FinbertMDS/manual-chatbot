const manualChunks = [];
const { getEmbedding } = require("./vectordb");
const { parseTextChunks } = require("../utils/parser");

async function processManual(filePath) {
  const chunks = await parseTextChunks(filePath);
  manualChunks.push(...chunks);
}

async function askQuestion(question) {
  // In real version: embed question, search vector DB, send to LLM
  return `Giả lập trả lời cho câu hỏi: "${question}"`;
}

module.exports = { processManual, askQuestion };
