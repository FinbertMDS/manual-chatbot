const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const { detectLanguage } = require('../utils/lang');
const { embedAndStoreChunks } = require('../services/embedding');
const { parseFileToText } = require('../utils/parser');

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { textChunks, fileInfo } = await parseFileToText(req);
    const lang = detectLanguage(textChunks.slice(0, 3).join(' ')); // detect dựa trên vài đoạn đầu

    await embedAndStoreChunks({
      chunks: textChunks,
      metadata: {
        source: fileInfo.source || 'unknown',
        name: fileInfo.name || 'Unnamed Manual',
        tag: fileInfo.tag || '',
        lang
      }
    });

    res.json({ success: true, detectedLang: lang });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
