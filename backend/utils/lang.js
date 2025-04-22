const { franc } = require('franc');

function detectLanguage(text) {
  const langCode = franc(text);
  return langCode === 'und' ? 'unknown' : langCode;
}

module.exports = { detectLanguage };
