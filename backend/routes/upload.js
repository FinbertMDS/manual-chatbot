const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { chunkText, parseFileToText } = require("../utils/parser");
const { getEmbeddingsBatch } = require("../services/embedding");
const { addDocument } = require("../services/vectordb");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const fileContent = await parseFileToText(req.file.path, req.file.originalname);

    const chunks = chunkText(fileContent);
    const limitedChunks = chunks.slice(0, 20); // 🚫 hạn chế upload nếu cần

    console.log(
      `📄 File upload: ${req.file.originalname} (${limitedChunks.length} chunks)`
    );

    const embeddings = await getEmbeddingsBatch(limitedChunks);

    // Lưu từng embedding + chunk vào vectordb
    for (let i = 0; i < embeddings.length; i++) {
      await addDocument(
        `${req.file.filename}-${i}`,
        limitedChunks[i],
        embeddings[i]
      );
    }

    res.json({ message: "Manual uploaded and processed successfully!" });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ error: "Failed to process manual" });
  }
});

module.exports = router;
