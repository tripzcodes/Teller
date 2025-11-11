const fs = require('fs');

// Read the extracted text from Document.pdf
const fullText = fs.readFileSync('./logs/analysis-Document-2025-11-09T20-39-44-094Z_fulltext.txt', 'utf-8');

// Load the WASM module
const Module = require('./frontend/public/wasm/bank_analyzer.js');

console.log('Loading WASM module...\n');

Module().then(async (wasmModule) => {
  console.log('✓ WASM module loaded successfully!\n');

  // Call the extractTransactions function
  console.log('Extracting transactions from Document.pdf...\n');

  try {
    const result = wasmModule.extractTransactions(fullText);
    const transactions = JSON.parse(result);

    console.log(`✓ Found ${transactions.length} transactions!\n`);

    if (transactions.length > 0) {
      console.log('First 10 transactions:');
      transactions.slice(0, 10).forEach((t, i) => {
        console.log(`${i + 1}. ${t.date} | ${t.description.substring(0, 40).padEnd(40)} | $${t.amount}`);
      });

      console.log('\nLast 5 transactions:');
      transactions.slice(-5).forEach((t, i) => {
        console.log(`${transactions.length - 5 + i + 1}. ${t.date} | ${t.description.substring(0, 40).padEnd(40)} | $${t.amount}`);
      });

      console.log(`\n✓ Total: ${transactions.length} transactions extracted by C++ WASM parser!`);
    } else {
      console.log('⚠ No transactions found. The pattern may not be matching.');
      console.log('\nSample of extracted text:');
      console.log(fullText.substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Error extracting transactions:', error.message);
    console.error(error.stack);
  }
}).catch(error => {
  console.error('❌ Failed to load WASM module:', error);
});
