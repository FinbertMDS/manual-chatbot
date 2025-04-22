import { ChromaClient } from "chromadb";
import { v4 as uuidv4 } from "uuid";

const chroma = new ChromaClient();
const collectionName = "manuals";
let collection;

async function getCollection() {
  if (!collection) {
    collection = await chroma.getOrCreateCollection({ name: collectionName });
  }
  return collection;
}

// 🔹 Lưu chunk vào vectorDB kèm metadata
export async function upsertChunks(chunks = [], metadata = {}) {
  const col = await getCollection();
  const ids = chunks.map(() => uuidv4());
  await col.upsert({
    ids,
    documents: chunks,
    metadatas: chunks.map(() => metadata),
  });
  return ids;
}

// 🔍 Tìm kiếm theo vector với metadata filter (nếu có)
export async function queryEmbedding({ embedding, topK = 5, manualId = null }) {
  const col = await getCollection();

  const queryOptions = {
    queryEmbeddings: [embedding],
    nResults: topK,
  };

  // Thêm filter nếu manualId được cung cấp
  if (manualId) {
    queryOptions.where = { manualId };
  }

  const results = await col.query(queryOptions);

  // Chuẩn hóa output
  const matches = results?.documents?.[0]?.map((doc, i) => ({
    text: doc,
    metadata: results.metadatas[0][i],
    distance: results.distances[0][i],
  })) || [];

  return matches;
}

export async function addToVectorDB(embeddings, metadataArray) {
  const collection = await getCollection();

  const ids = metadataArray.map((meta, i) => `chunk-${Date.now()}-${i}`);
  await collection.add({
    ids,
    embeddings,
    metadatas: metadataArray,
    documents: metadataArray.map((m) => m.text),
  });

  console.log(`✅ Added ${embeddings.length} vectors to ChromaDB.`);
}


export async function clearAllManuals() {
  const collection = await chroma.getOrCreateCollection({ name: 'manuals' });
  await collection.delete(); // Xóa toàn bộ document trong collection
}
