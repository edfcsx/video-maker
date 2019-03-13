const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apikey;
const sentenceBoundaryDetection = require('sbd');

async function fetchContentFromWikipedia(content) {
  const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
  const wikipediaAlgotithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
  const wikipediaResponse = await wikipediaAlgotithm.pipe(content.searchTerm);
  const wikipediaContent = wikipediaResponse.get();
  // eslint-disable-next-line no-param-reassign
  content.sourceContentOriginal = wikipediaContent.content;
}

function sanitizeContent(content) {
  const withoutBlankLines = content.sourceContentOriginal.split('\n');
  const sanitizedLines = withoutBlankLines.filter((line) => {
    if (line.trim().lenght === 0 || line.trim().startsWith('=')) return false;
    return true;
  });
  const text = sanitizedLines.join(' ');
  const removeDataInParentheses = text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
  // eslint-disable-next-line no-param-reassign
  content.sourceContentSanitized = removeDataInParentheses;
}

function breakContentIntoSentences(content) {
  // eslint-disable-next-line no-param-reassign
  content.sentences = [];
  const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized);
  sentences.forEach(sentence => content.sentences.push({
    text: sentence,
    keywords: [],
    images: [],
  }));
}

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
}

module.exports = robot;
