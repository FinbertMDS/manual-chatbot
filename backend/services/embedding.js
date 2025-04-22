
const { detectLanguage } = require('../utils/lang');
const { addToVectorDB } = require('./vectordb');
const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function getEmbeddings(texts) {
  const res = await cohere.embed({
    model: 'embed-multilingual-v3.0',
    texts,
    inputType: 'search_document',
  });

  return res.embeddings;
}

async function embedAndStoreChunks({ chunks, metadata }) {
  const lang = detectLanguage(chunks.slice(0, 3).join(' '));
  const embeddings = await getEmbeddings(chunks);

  const entries = chunks.map((text, i) => ({
    id: `chunk-${Date.now()}-${i}`,
    embedding: embeddings[i],
    metadata: {
      ...metadata,
      lang,
      index: i,
      text
    }
  }));

  await addToVectorDB(embeddings, entries);
  return entries.length;
}

module.exports = {
  getEmbeddings,
  embedAndStoreChunks,
};
