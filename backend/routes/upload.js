const express = require("express");
const multer = require("multer");
const { getEmbedding } = require("../services/embedding");
const { addDocument } = require("../services/vectordb");
const { chunkText } = require("../utils/parser");
const fs = require("fs");
const { sleep } = require("../utils/util");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const text = fs.readFileSync(req.file.path, "utf-8"); // giả định là file txt
    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);

      await addDocument(`${req.file.filename}-${i}`, chunk, embedding);
      await sleep(1000); // chờ 200ms giữa mỗi lần gọi OpenAI
    }

    res.json({ message: "Manual uploaded and embedded!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
