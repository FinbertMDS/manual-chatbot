const express = require('express');
const router = express.Router();
const { detectLanguage } = require('../utils/lang');
const { chatHandler } = require('../services/chat');

router.post('/', async (req, res) => {
  try {
    const { question, selectedManual } = req.body;
    const lang = detectLanguage(question);

    const answer = await chatHandler(question, selectedManual);

    res.json({
      answer,
      lang,
      results: topMatches,
      context: topMatches.map(doc => doc.text).join('\n---\n'),
      metadata: topMatches.map(doc => doc.metadata)
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

module.exports = router;
