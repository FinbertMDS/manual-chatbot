function chunkText(text, maxLength = 100) {
  const paragraphs = text.split(/\n\s*\n/); // chia theo đoạn thay vì câu
  const chunks = [];

  let current = "";
  for (const para of paragraphs) {
    if ((current + para).length > maxLength) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += "\n" + para;
    }
  }

  if (current) chunks.push(current.trim());

  return chunks;
}

module.exports = { chunkText };
