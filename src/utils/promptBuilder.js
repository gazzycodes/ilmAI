const { searchQuran, searchHadith } = require('./dataService');
const logger = require('./logger');

/**
 * Build a structured prompt for the Gemini API with context from our datasets
 * @param {string} userQuery - The user's question
 * @returns {Object} - The formatted prompt and relevant data
 */
function buildPrompt(userQuery) {
  logger.debug('Building prompt for query:', userQuery);
  
  // Search for relevant Quran verses and Hadiths
  const relevantVerses = searchQuran(userQuery);
  const relevantHadiths = searchHadith(userQuery);
  
  logger.debug(`Found ${relevantVerses.length} relevant Quran verses and ${relevantHadiths.length} relevant Hadiths`);
  
  // Filter for high relevance content only (relevance score > 0.5)
  const highlyRelevantVerses = relevantVerses.filter(verse => verse.relevance > 0.5);
  const highlyRelevantHadiths = relevantHadiths.filter(hadith => hadith.relevance > 0.5);
  
  logger.debug(`After filtering, using ${highlyRelevantVerses.length} highly relevant Quran verses and ${highlyRelevantHadiths.length} highly relevant Hadiths`);
  
  // Build context from search results
  let context = '';
  let hasRelevantContent = false;
  
  if (highlyRelevantVerses.length > 0) {
    hasRelevantContent = true;
    context += 'RELEVANT QURAN VERSES:\n';
    highlyRelevantVerses.slice(0, 3).forEach(verse => {
      context += `Surah ${verse.surah_name} (${verse.surah}:${verse.ayah})\n`;
      context += `Arabic: ${verse.arabic}\n`;
      context += `Translation: ${verse.translation}\n\n`;
    });
  } else if (relevantVerses.length > 0) {
    // Fall back to best matches if no highly relevant verses
    hasRelevantContent = true;
    context += 'RELEVANT QURAN VERSES:\n';
    relevantVerses.slice(0, 2).forEach(verse => {
      context += `Surah ${verse.surah_name} (${verse.surah}:${verse.ayah})\n`;
      context += `Arabic: ${verse.arabic}\n`;
      context += `Translation: ${verse.translation}\n\n`;
    });
  }
  
  if (highlyRelevantHadiths.length > 0) {
    hasRelevantContent = true;
    context += 'RELEVANT HADITHS:\n';
    highlyRelevantHadiths.slice(0, 3).forEach(hadith => {
      context += `${hadith.collection} ${hadith.number}\n`;
      context += `Arabic: ${hadith.arabic}\n`;
      context += `Text: ${hadith.text}\n`;
      context += `Narrator: ${hadith.narrator}\n`;
      context += `Grade: ${hadith.grade}\n\n`;
    });
  } else if (relevantHadiths.length > 0 && highlyRelevantVerses.length === 0) {
    // Only include regular hadiths if we don't have highly relevant verses
    hasRelevantContent = true;
    context += 'RELEVANT HADITHS:\n';
    relevantHadiths.slice(0, 2).forEach(hadith => {
      context += `${hadith.collection} ${hadith.number}\n`;
      context += `Arabic: ${hadith.arabic}\n`;
      context += `Text: ${hadith.text}\n`;
      context += `Narrator: ${hadith.narrator}\n`;
      context += `Grade: ${hadith.grade}\n\n`;
    });
  }
  
  // Build the full prompt
  const prompt = `
You are LLMAI, an AI assistant specialized in Islamic knowledge. You provide accurate information based on the Quran and authentic Hadith.

USER QUERY: ${userQuery}

${hasRelevantContent ? `CONTEXT:
${context}

INSTRUCTIONS:
1. Answer the question based on the provided context.
2. ALWAYS include the original Arabic text of Quranic verses along with English translations.
3. Keep your answer concise and to the point.
4. Use clear references to Quranic verses (Surah:Ayah) and Hadith sources when applicable.
5. Format your response with Arabic text first, followed by translation.` : 
`INSTRUCTIONS:
1. I don't have specific Quranic verses or Hadith that directly address this question.
2. Politely inform the user that you don't have sufficient information to answer their question.
3. Suggest that they rephrase their question to focus on Islamic teachings from the Quran or authentic Hadith.
4. Do not make up information or provide answers without authentic sources.
5. Do not reference any sources that weren't provided to you.`}

ANSWER:
`;

  logger.debug('Prompt built successfully');
  
  return {
    prompt,
    relevantVerses: hasRelevantContent ? (highlyRelevantVerses.length > 0 ? highlyRelevantVerses : relevantVerses.slice(0, 2)) : [],
    relevantHadiths: hasRelevantContent ? (highlyRelevantHadiths.length > 0 ? highlyRelevantHadiths : relevantHadiths.slice(0, 2)) : []
  };
}

/**
 * Extract sources from relevant verses and hadiths for frontend display
 * @param {Array} verses - Relevant Quran verses
 * @param {Array} hadiths - Relevant Hadiths
 * @returns {Array} - Formatted sources for frontend display
 */
function extractSources(verses, hadiths) {
  const sources = [];
  
  // Add Quran verses as sources
  verses.slice(0, 3).forEach(verse => {
    sources.push({
      type: 'Quran',
      text: verse.translation,
      arabic: verse.arabic,
      reference: `Surah ${verse.surah_name} (${verse.surah}:${verse.ayah})`,
      relevance: verse.relevance || 0
    });
  });
  
  // Add Hadiths as sources
  hadiths.slice(0, 3).forEach(hadith => {
    sources.push({
      type: 'Hadith',
      text: hadith.text,
      arabic: hadith.arabic || '',
      reference: `${hadith.collection} ${hadith.number}, Narrator: ${hadith.narrator}`,
      relevance: hadith.relevance || 0
    });
  });
  
  // Sort sources by relevance
  return sources.sort((a, b) => b.relevance - a.relevance);
}

module.exports = {
  buildPrompt,
  extractSources
}; 