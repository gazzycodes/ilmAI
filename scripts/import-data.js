/**
 * Data Import Script for LLMAI
 * 
 * This script helps import data from external sources into the LLMAI application.
 * Usage: node scripts/import-data.js --source=<source_file> --type=<quran|hadith>
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let sourceFile = '';
let dataType = '';

args.forEach(arg => {
  if (arg.startsWith('--source=')) {
    sourceFile = arg.split('=')[1];
  } else if (arg.startsWith('--type=')) {
    dataType = arg.split('=')[1];
  }
});

// Validate arguments
if (!sourceFile || !dataType) {
  console.error('Error: Missing required arguments');
  console.log('Usage: node scripts/import-data.js --source=<source_file> --type=<quran|hadith>');
  process.exit(1);
}

if (dataType !== 'quran' && dataType !== 'hadith') {
  console.error('Error: Type must be either "quran" or "hadith"');
  process.exit(1);
}

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Source file "${sourceFile}" not found`);
  process.exit(1);
}

// Determine target file
const targetFile = dataType === 'quran' 
  ? path.join(__dirname, '../data/quran-sample.json')
  : path.join(__dirname, '../data/hadith-sample.json');

// Check if target file exists
if (!fs.existsSync(targetFile)) {
  console.error(`Error: Target file "${targetFile}" not found`);
  process.exit(1);
}

// Read source and target files
try {
  const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
  
  // Validate source data structure
  if (dataType === 'quran' && !sourceData.verses) {
    console.error('Error: Source file must contain a "verses" array');
    process.exit(1);
  } else if (dataType === 'hadith' && !sourceData.hadiths) {
    console.error('Error: Source file must contain a "hadiths" array');
    process.exit(1);
  }
  
  // Merge data
  if (dataType === 'quran') {
    // Add new verses
    const existingIds = new Set(targetData.verses.map(v => `${v.surah}:${v.ayah}`));
    let newCount = 0;
    
    sourceData.verses.forEach(verse => {
      const verseId = `${verse.surah}:${verse.ayah}`;
      if (!existingIds.has(verseId)) {
        targetData.verses.push(verse);
        existingIds.add(verseId);
        newCount++;
      }
    });
    
    console.log(`Added ${newCount} new verses to the dataset`);
  } else {
    // Add new hadiths
    const existingIds = new Set(targetData.hadiths.map(h => `${h.collection}:${h.number}`));
    let newCount = 0;
    
    sourceData.hadiths.forEach(hadith => {
      const hadithId = `${hadith.collection}:${hadith.number}`;
      if (!existingIds.has(hadithId)) {
        targetData.hadiths.push(hadith);
        existingIds.add(hadithId);
        newCount++;
      }
    });
    
    console.log(`Added ${newCount} new hadiths to the dataset`);
  }
  
  // Write updated data back to target file
  fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2));
  console.log(`Successfully updated ${targetFile}`);
  
} catch (error) {
  console.error('Error processing files:', error.message);
  process.exit(1);
} 