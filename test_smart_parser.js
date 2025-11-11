const fs = require('fs');

// Read the full text
const fullText = fs.readFileSync('./logs/analysis-Document-2025-11-09T20-36-56-300Z_fulltext.txt', 'utf-8');

console.log('Smart parser - matching TWO dates + description + amount pattern\n');

// Pattern: (Date1) (Date2) (Description with multiple spaces) (Amount)
// Example: Aug 25   Aug 26   PAYMENT THANK YOU/PAIEMENT MERCI   200.00
const transactionPattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2})\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2})\s+(.+?)\s+([-]?\d{1,3}(?:,\d{3})*\.\d{2})(?:\s|$)/gi;

let matches = [];
let match;

while ((match = transactionPattern.exec(fullText)) !== null) {
  const transDate = match[1];
  const postDate = match[2];
  const description = match[3].replace(/\s+/g, ' ').trim();
  const amount = match[4];

  // Filter out headers and junk
  const descUpper = description.toUpperCase();
  if (descUpper.includes('TRANS') || descUpper.includes('POST') || descUpper.includes('DESCRIPTION')) {
    continue;
  }

  // Skip if description is too short or contains mostly special chars
  if (description.length < 5) {
    continue;
  }

  matches.push({
    transDate,
    postDate,
    description,
    amount
  });
}

console.log(`✓ Found ${matches.length} transactions!\n`);

console.log('First 15 transactions:');
matches.slice(0, 15).forEach((t, i) => {
  console.log(`${i + 1}. ${t.transDate} | ${t.description.substring(0, 40).padEnd(40)} | $${t.amount}`);
});

console.log('\nLast 10 transactions:');
matches.slice(-10).forEach((t, i) => {
  console.log(`${matches.length - 10 + i + 1}. ${t.transDate} | ${t.description.substring(0, 40).padEnd(40)} | $${t.amount}`);
});

console.log(`\n✓ Total: ${matches.length} transactions extracted`);
