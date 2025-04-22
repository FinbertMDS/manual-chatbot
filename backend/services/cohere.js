const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function generateAnswerWithCohere(prompt) {
  try {
    const res = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 300,
      temperature: 0.3,
    });

    return res.body.generations[0].text;
  } catch (err) {
    console.error('❌ Cohere generate error:', err.message);
    throw new Error('Failed to generate answer from Cohere');
  }
}

module.exports = {
  generateAnswerWithCohere,
};
