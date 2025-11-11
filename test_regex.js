const fs = require('fs');

// Read the full text
const fullText = fs.readFileSync('./logs/analysis-Document-2025-11-09T20-36-56-300Z_fulltext.txt', 'utf-8');

// Date pattern
const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}/gi;

console.log('Testing if date pattern matches at all...\n');

// Find ALL date matches in the entire text
const allMatches = fullText.match(datePattern);
console.log(`Total date matches found: ${allMatches ? allMatches.length : 0}`);

if (allMatches && allMatches.length > 0) {
  console.log('\nFirst 20 date matches:');
  allMatches.slice(0, 20).forEach((match, i) => {
    console.log(`${i + 1}. "${match}"`);
  });
}

// Now let's look at actual transaction lines
console.log('\n\nLooking for lines that start with dates...\n');

const lines = fullText.split('\n');
let linesWithDates = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line || line.trim().length < 10) continue;

  // Check if line has our date pattern
  const hasDate = datePattern.test(line);
  datePattern.lastIndex = 0; // Reset regex

  if (hasDate) {
    linesWithDates++;
    if (linesWithDates <= 10) {
      console.log(`Line ${i + 1}: ${line.substring(0, 100)}...`);
    }
  }
}

console.log(`\nTotal lines with dates: ${linesWithDates}`);

// Let's look specifically at page 2 where transactions start
console.log('\n\nLooking at Page 2 content:');
const page2Start = fullText.indexOf('Page   2   of 6');
const page2Content = fullText.substring(page2Start, page2Start + 2000);
console.log(page2Content);
