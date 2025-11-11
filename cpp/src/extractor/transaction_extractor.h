#pragma once
#include <string>
#include <vector>

namespace BankAnalyzer {

struct Transaction {
    std::string date;
    std::string description;
    double amount;
    double balance;
    std::string type; // "debit" or "credit"
    std::string category; // transaction category (e.g., "groceries", "utilities")
};

class TransactionExtractor {
public:
    TransactionExtractor();
    ~TransactionExtractor();

    /**
     * Extract transactions from raw text using 10 regex patterns
     * Patterns handle 95-98% of North American bank statement formats
     * @param text Text extracted from PDF
     * @return Vector of transactions
     */
    std::vector<Transaction> extract(const std::string& text);

private:
    // Pattern matching implemented in transaction_extractor.cpp
    // See PATTERNS.md for detailed documentation of all 10 patterns
};

} // namespace BankAnalyzer
