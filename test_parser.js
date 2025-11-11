const fs = require('fs');

// Read the full text
const fullText = fs.readFileSync('./logs/analysis-Document-2025-11-09T20-36-56-300Z_fulltext.txt', 'utf-8');

// Date pattern - matches "Aug 25", "Sep 02", etc.
const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:\s*,?\s*\d{4})?|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{2}[/-]\d{2}/gi;

// Amount pattern
const amountPattern = /[-\(]?[£$€¥₹]?\s*[\d,]+\.?\d{0,2}\)?/g;

const lines = fullText.split('\n');
let transactionCount = 0;
let transactions = [];

console.log('Testing parser on actual CIBC statement...\n');

for (let line of lines) {
  // Skip empty lines
  if (line.trim().length < 10) continue;

  // Check if line starts with a date
  const dateMatches = line.match(datePattern);
  if (!dateMatches || dateMatches.length === 0) continue;

  // Skip headers
  const lineUpper = line.toUpperCase();
  if (lineUpper.includes('DATE') &&
      (lineUpper.includes('DESCRIPTION') || lineUpper.includes('TRANSACTION') || lineUpper.includes('AMOUNT'))) {
    continue;
  }

  // Get position of first date
  const firstDate = dateMatches[0];
  const datePos = line.indexOf(firstDate);
  const remainder = line.substring(datePos + firstDate.length);

  // Find amounts
  const amounts = remainder.match(amountPattern) || [];
  const validAmounts = amounts.filter(a => a.length >= 3 && /\d/.test(a));

  if (validAmounts.length === 0) continue;

  // Extract description (remove second date if present)
  let description = remainder;
  if (dateMatches.length > 1) {
    // Remove the second date
    description = description.replace(dateMatches[1], '');
  }

  // Get description before first amount
  const firstAmountPos = description.indexOf(validAmounts[0]);
  description = description.substring(0, firstAmountPos).trim();

  if (description.length < 2) continue;

  transactionCount++;
  transactions.push({
    date: firstDate,
    description: description.replace(/\s+/g, ' '),
    amount: validAmounts[validAmounts.length - 1]
  });

  // Show first 10 transactions
  if (transactionCount <= 10) {
    console.log(`${transactionCount}. ${firstDate} | ${description.replace(/\s+/g, ' ').substring(0, 50)} | ${validAmounts[validAmounts.length - 1]}`);
  }
}

console.log(`\n✓ Total transactions found: ${transactionCount}`);
console.log(`\nShowing sample transactions from different sections:`);
console.log(`- Payments section: ${transactions.filter(t => t.description.includes('PAYMENT')).length}`);
console.log(`- Purchase section: ${transactions.filter(t => !t.description.includes('PAYMENT') && !t.description.includes('INTEREST')).length}`);
console.log(`- Interest section: ${transactions.filter(t => t.description.includes('INTEREST')).length}`);
