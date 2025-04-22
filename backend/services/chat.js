const { queryEmbedding } = require('./vectordb');
const { generateAnswerWithCohere } = require('./cohere');
const { detectLanguage } = require('../utils/lang');

async function generateAnswer({ question, contextChunks }) {
  const contextText = contextChunks.map(doc => doc.text).join('\n---\n');

  const prompt = `Bạn là trợ lý AI. Dựa trên thông tin dưới đây, hãy trả lời câu hỏi của người dùng.\n\nThông tin:\n${contextText}\n\nCâu hỏi: ${question}\n\nTrả lời:`;

  const response = await generateAnswerWithCohere(prompt);
  return response;
}

async function chatHandler({ question, selectedManual }) {
  const lang = detectLanguage(question);

  const topMatches = await queryEmbedding({
    embedding,        // embedding vector của câu hỏi
    topK: 5,          // số kết quả gần nhất
    manualId: selectedManual || null  // nếu null → tìm toàn bộ manuals
  });
  const answer = await generateAnswer({ question, contextChunks: topMatches });

  return {
    answer,
    lang,
    results: topMatches,
    context: topMatches.map(doc => doc.text).join('\n---\n'),
    metadata: topMatches.map(doc => doc.metadata)
  };
}

module.exports = {
  chatHandler,
  generateAnswer,
  queryEmbedding,
};
