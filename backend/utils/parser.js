const fs = require('fs');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const unzipper = require('unzipper');
const xmljs = require('xml-js');
const path = require('path');
const { log } = require('console');

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

async function parseFileToText(filePath, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  log('🚀 File upload:', filePath, fileName);

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === '.xlsx') {
    const workbook = xlsx.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      text += xlsx.utils.sheet_to_csv(sheet);
    });
    return text;
  }

  if (ext === '.pptx') {
    return extractTextFromPPTX(filePath);
  }

  throw new Error('Unsupported file format: ' + ext);
}

async function extractTextFromPPTX(filePath) {
  let text = '';
  const directory = await unzipper.Open.file(filePath);
  const slides = directory.files.filter(f => f.path.startsWith('ppt/slides/slide') && f.path.endsWith('.xml'));

  for (const file of slides) {
    const content = await file.buffer();
    const slideXML = xmljs.xml2json(content.toString(), { compact: true });
    const parsed = JSON.parse(slideXML);

    const shapes = parsed['p:sld']?.['p:cSld']?.['p:spTree']?.['p:sp'];
    if (Array.isArray(shapes)) {
      shapes.forEach(shape => {
        const textBody = shape?.['p:txBody']?.['a:p'];
        if (Array.isArray(textBody)) {
          textBody.forEach(p => {
            const runs = p?.['a:r'];
            if (Array.isArray(runs)) {
              runs.forEach(r => {
                const t = r?.['a:t']?._text;
                if (t) text += t + '\n';
              });
            } else if (runs?.['a:t']?._text) {
              text += runs['a:t']._text + '\n';
            }
          });
        }
      });
    }
  }

  return text;
}

module.exports = { chunkText, parseFileToText };
