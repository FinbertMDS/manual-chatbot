const { ChromaClient } = require("chromadb");
const client = new ChromaClient({
  path: `http://${process.env.CHROMA_HOST}:8000`,
});

const COLLECTION_NAME = "manual_chunks";

async function initCollection() {
  return await client.getOrCreateCollection({ name: COLLECTION_NAME });
}

async function addDocument(id, text, embedding, metadata = {}) {
  const collection = await initCollection();
  await collection.add({
    ids: [id],
    documents: [text],
    embeddings: [embedding],
    metadatas: [metadata],
  });
}

async function searchSimilar(embedding, topK = 3) {
  const collection = await initCollection();
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: topK,
  });

  return results;
}

module.exports = { addDocument, searchSimilar };
