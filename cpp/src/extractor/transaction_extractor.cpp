#include "transaction_extractor.h"
#include <regex>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <iostream>

namespace BankAnalyzer {

TransactionExtractor::TransactionExtractor() {
}

TransactionExtractor::~TransactionExtractor() {
}

// Helper function to clean and parse amount strings
double parseAmount(const std::string& amountStr, bool& isNegative) {
    std::string cleaned = amountStr;

    // Remove common currency symbols
    const std::string currencySymbols = "$£€¥₹";
    for (char c : currencySymbols) {
        cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), c), cleaned.end());
    }

    // Remove thousand separators (commas, spaces)
    cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), ','), cleaned.end());
    cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), ' '), cleaned.end());

    // Check for negative sign or parentheses (accounting format)
    isNegative = (cleaned.find('-') != std::string::npos) ||
                 (amountStr.find('(') != std::string::npos);

    // Remove negative signs and parentheses
    cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), '-'), cleaned.end());
    cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), '('), cleaned.end());
    cleaned.erase(std::remove(cleaned.begin(), cleaned.end(), ')'), cleaned.end());

    // Trim whitespace
    cleaned.erase(0, cleaned.find_first_not_of(" \t\r\n"));
    cleaned.erase(cleaned.find_last_not_of(" \t\r\n") + 1);

    if (cleaned.empty()) {
        return 0.0;
    }

    try {
        return std::stod(cleaned);
    } catch (...) {
        return 0.0;
    }
}

// Helper function to clean description text
std::string cleanDescription(const std::string& desc) {
    std::string cleaned = desc;

    // Trim whitespace
    cleaned.erase(0, cleaned.find_first_not_of(" \t\r\n"));
    cleaned.erase(cleaned.find_last_not_of(" \t\r\n") + 1);

    // Replace multiple spaces with single space
    std::regex multiSpace("\\s+");
    cleaned = std::regex_replace(cleaned, multiSpace, " ");

    return cleaned;
}

// ============================================================================
// PATTERN EXTRACTION FUNCTIONS
// ============================================================================

// Pattern 1: Canadian Dual-Date Separate Columns (RBC, TD, BMO, Scotiabank)
// Format: Date | Description | Amount(s) - flexible format
// Handles date carry-forward (same-day transactions don't repeat the date)
std::vector<Transaction> tryPattern1(const std::string& text) {
    std::vector<Transaction> transactions;

    // Flexible pattern for RBC-style statements
    // Matches: [Date] Description Amount [Amount] [Amount]
    std::regex patternWithDate(
        R"((?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\s+)?)"
        R"(([A-Za-z].*?)\s+)"  // Description: starts with letter, anything until spaces+amount
        R"((\d{1,3}(?:,\d{3})*\.\d{2}))"  // First amount
        R"((?:\s+(\d{1,3}(?:,\d{3})*\.\d{2}))?)"  // Optional second
        R"((?:\s+(\d{1,3}(?:,\d{3})*\.\d{2}))?)"  // Optional third
    );

    std::sregex_iterator iter(text.begin(), text.end(), patternWithDate);
    std::sregex_iterator end;

    std::string lastDate = "";

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string amount1 = match[3].str();
        std::string amount2 = match[4].str();
        std::string amount3 = match[5].str();

        // Skip header rows and totals
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if (descUpper.find("DESCRIPTION") != std::string::npos ||
            descUpper.find("WITHDRAWAL") != std::string::npos && descUpper.find("DEPOSIT") != std::string::npos ||
            descUpper.find("BALANCE") != std::string::npos && descUpper.length() < 20 ||
            descUpper.find("DATE") != std::string::npos && descUpper.length() < 20 ||
            descUpper.find("OPENING") != std::string::npos ||
            descUpper.find("CLOSING") != std::string::npos ||
            descUpper.find("TOTAL") != std::string::npos ||
            descUpper.find("SUMMARY") != std::string::npos ||
            descUpper.find("DETAILS OF YOUR ACCOUNT") != std::string::npos) {
            ++iter;
            continue;
        }

        // Skip if description is too short or just numbers
        if (description.length() < 3 || std::regex_match(description, std::regex(R"(^\s*\d+\.?\d*\s*$)"))) {
            ++iter;
            continue;
        }

        // Use last date if current line has no date (same-day transaction)
        if (date.empty() || date.find_first_not_of(" \t") == std::string::npos) {
            if (lastDate.empty()) {
                ++iter;
                continue; // Skip if we don't have a date yet
            }
            date = lastDate;
        } else {
            lastDate = date; // Update last seen date
        }

        // Determine which amount is the transaction amount (not balance)
        // If 2 amounts: could be withdrawal/deposit OR amount/balance
        // If 3 amounts: withdrawal/deposit/balance
        bool isNegative = false;
        double amount = 0.0;
        bool isCredit = false;
        bool isDebit = false;

        // Keyword-based credit detection
        isCredit = (descUpper.find("DEPOSIT") != std::string::npos ||
                    descUpper.find("CREDIT") != std::string::npos ||
                    descUpper.find("AUTODEPOSIT") != std::string::npos ||
                    descUpper.find("TRANSFER FROM") != std::string::npos ||
                    descUpper.find("INCOMING") != std::string::npos ||
                    descUpper.find("RECEIVED") != std::string::npos);

        // Keyword-based debit detection
        isDebit = (descUpper.find("FEE") != std::string::npos ||
                   descUpper.find("WITHDRAWAL") != std::string::npos ||
                   descUpper.find("PURCHASE") != std::string::npos ||
                   descUpper.find("SENT") != std::string::npos ||
                   descUpper.find("TRANSFER TO") != std::string::npos ||
                   descUpper.find("PAYMENT TO") != std::string::npos ||
                   descUpper.find("DEBIT") != std::string::npos ||
                   descUpper.find("E-TRANSFER SENT") != std::string::npos ||
                   descUpper.find("ONLINE TRANSFER TO") != std::string::npos);

        // If we have 3 amounts, middle two are withdrawal/deposit
        if (!amount3.empty()) {
            // Format: Date Desc Withdrawal Deposit Balance
            std::string withdrawal = amount1;
            std::string deposit = amount2;

            if (!withdrawal.empty() && withdrawal != "0.00") {
                amount = parseAmount(withdrawal, isNegative);
                isDebit = true;
                isCredit = false;
            } else if (!deposit.empty() && deposit != "0.00") {
                amount = parseAmount(deposit, isNegative);
                isCredit = true;
                isDebit = false;
            } else {
                ++iter;
                continue;
            }
        } else if (!amount2.empty()) {
            // Two amounts: could be withdrawal+deposit OR amount+balance
            // Use keywords to determine which amount to use
            if (isCredit) {
                amount = parseAmount(amount1, isNegative);  // First is deposit
            } else {
                amount = parseAmount(amount1, isNegative);  // First is withdrawal
            }
        } else {
            // Single amount - use keyword detection
            amount = parseAmount(amount1, isNegative);
        }

        Transaction txn;
        txn.date = date;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isCredit ? "credit" : "debit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 2: US/Credit Card Dual-Date Single Amount (CIBC Visa, Chase, BoA, Citi)
// Format: Trans date | Post date | Description | Amount($)
std::vector<Transaction> tryPattern2(const std::string& text) {
    std::vector<Transaction> transactions;

    // Pattern: (Date1) (Date2) (Description) (Amount)
    std::regex pattern(
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"((.+?)\s+)"
        R"((-?\d{1,3}(?:,\d{3})*\.\d{2})(?:\s|$))"
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string transDate = match[1].str();
        std::string postDate = match[2].str();
        std::string description = cleanDescription(match[3].str());
        std::string amountStr = match[4].str();

        // Skip headers
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if ((descUpper.find("TRANS") != std::string::npos ||
             descUpper.find("POST") != std::string::npos) &&
            descUpper.find("DESCRIPTION") != std::string::npos) {
            ++iter;
            continue;
        }

        // Skip if description is too short
        if (description.length() < 3) {
            ++iter;
            continue;
        }

        // Parse amount
        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        // For credit cards: positive = debit (purchase), negative = credit (refund)
        // Also check for payment keywords (descUpper already declared above)
        bool isPayment = (descUpper.find("PAYMENT") != std::string::npos ||
                          descUpper.find("PAIEMENT") != std::string::npos);

        Transaction txn;
        txn.date = transDate;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        // Credit cards: payments and negative amounts are credits, everything else is debit
        txn.type = (isPayment || isNegative) ? "credit" : "debit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 3: Simple Date-Description-Amount (Ally, Chime, SoFi, many credit unions)
// Format: Date | Description | Amount | Balance
std::vector<Transaction> tryPattern3(const std::string& text) {
    std::vector<Transaction> transactions;

    // Pattern: (Date) (Description) (Amount) (optional Balance)
    std::regex pattern(
        R"((\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\s+)"
        R"((.+?)\s+)"
        R"((-?[\$€£¥₹]?\s*\d{1,3}(?:,\d{3})*\.\d{2})\s+)"
        R"((?:[\$€£¥₹]?\s*\d{1,3}(?:,\d{3})*\.\d{2})?(?:\s|$))"
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string amountStr = match[3].str();

        // Skip headers
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if (descUpper.find("DESCRIPTION") != std::string::npos &&
            descUpper.find("AMOUNT") != std::string::npos) {
            ++iter;
            continue;
        }

        // Skip if description is too short
        if (description.length() < 3) {
            ++iter;
            continue;
        }

        // Parse amount
        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isNegative ? "debit" : "credit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 4: Check-Heavy Format (Wells Fargo, regional banks)
// Format: Check # | Date | Description | Debit | Credit | Balance
std::vector<Transaction> tryPattern4(const std::string& text) {
    std::vector<Transaction> transactions;

    // Pattern: (Check#) (Date) (Description) (Debit) (Credit) (Balance)
    std::regex pattern(
        R"((\d{3,6}|\*{4})\s+)"  // Check number or ****
        R"((\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"((.+?)\s+)"
        R"((?:(\d{1,3}(?:,\d{3})*\.\d{2})|\s+)\s+)"  // Debit or empty
        R"((?:(\d{1,3}(?:,\d{3})*\.\d{2})|\s+)\s+)"  // Credit or empty
        R"((\d{1,3}(?:,\d{3})*\.\d{2}))"              // Balance
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string checkNum = match[1].str();
        std::string date = match[2].str();
        std::string description = cleanDescription(match[3].str());
        std::string debit = match[4].str();
        std::string credit = match[5].str();
        std::string balanceStr = match[6].str();

        // Skip headers
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if (descUpper.find("DESCRIPTION") != std::string::npos) {
            ++iter;
            continue;
        }

        // Skip if description is too short
        if (description.length() < 3) {
            ++iter;
            continue;
        }

        Transaction txn;
        txn.date = date;
        txn.description = description;

        // Parse amount from debit or credit column
        bool isNegative = false;
        if (!debit.empty() && debit.find_first_of("0123456789") != std::string::npos) {
            txn.amount = parseAmount(debit, isNegative);
            txn.type = "debit";
        } else if (!credit.empty() && credit.find_first_of("0123456789") != std::string::npos) {
            txn.amount = parseAmount(credit, isNegative);
            txn.type = "credit";
        } else {
            ++iter;
            continue;
        }

        txn.balance = parseAmount(balanceStr, isNegative);
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 5: Minimal Export Format (CSV-like)
// Format: Date | Description | Amount
std::vector<Transaction> tryPattern5(const std::string& text) {
    std::vector<Transaction> transactions;

    // Pattern: (Date) (Description) (Amount) [no balance]
    std::regex pattern(
        R"((\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\s+)"
        R"((.+?)\s+)"
        R"((-?[\$€£¥₹]?\s*\d{1,3}(?:,\d{3})*\.\d{2})(?:\s|$))"
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string amountStr = match[3].str();

        // Skip headers
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if (descUpper.find("DESCRIPTION") != std::string::npos) {
            ++iter;
            continue;
        }

        // Skip if description is too short
        if (description.length() < 3) {
            ++iter;
            continue;
        }

        // Parse amount
        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isNegative ? "debit" : "credit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 6: Reference Number Format (7% coverage)
// Format: Date | Reference | Description | Amount | Balance
std::vector<Transaction> tryPattern6(const std::string& text) {
    std::vector<Transaction> transactions;

    // Pattern: (Date) (ReferenceNum) (Description) (Amount) (optional Balance)
    std::regex pattern(
        R"((\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"(([A-Z0-9]{6,20})\s+)"  // Reference number
        R"((.+?)\s+)"
        R"((-?\$?\d{1,3}(?:,\d{3})*\.\d{2})\s+)"
        R"((?:\$?\d{1,3}(?:,\d{3})*\.\d{2})?(?:\s|$))"
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string reference = match[2].str();
        std::string description = cleanDescription(match[3].str());
        std::string amountStr = match[4].str();

        if (description.length() < 3) {
            ++iter;
            continue;
        }

        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isNegative ? "debit" : "credit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 7: Investment/Brokerage Format (5% coverage)
// Format: Trade Date | Settlement Date | Symbol | Description | Type | Quantity | Price | Amount
std::vector<Transaction> tryPattern7(const std::string& text) {
    std::vector<Transaction> transactions;

    // Simplified investment pattern
    std::regex pattern(
        R"((\d{1,2}/\d{1,2}/\d{2,4})\s+)"  // Trade date
        R"((\d{1,2}/\d{1,2}/\d{2,4})\s+)"  // Settlement date
        R"(([A-Z]{1,5})\s+)"                // Symbol
        R"((.+?)\s+)"                       // Description
        R"((BUY|SELL|DIV|INT)\s+)"         // Type
        R"((-?\d+(?:\.\d+)?)\s+)"          // Quantity
        R"((\d+\.\d{2,4})\s+)"             // Price
        R"((-?\d{1,3}(?:,\d{3})*\.\d{2}))" // Amount
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string symbol = match[3].str();
        std::string description = cleanDescription(match[4].str());
        std::string amountStr = match[8].str();

        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = symbol + " " + description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isNegative ? "debit" : "credit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 8: Bilingual English/French (3% coverage)
// Format: Date | Description/Description | Débit/Debit | Crédit/Credit | Solde/Balance
std::vector<Transaction> tryPattern8(const std::string& text) {
    std::vector<Transaction> transactions;

    // French month names support
    std::regex pattern(
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Janv|Févr|Mars|Avr|Mai|Juin|Juil|Août|Sept)[a-z]*\s+\d{1,2})\s+)"
        R"((.*?)\s+)"
        R"((?:(\d{1,3}(?:[,\s]\d{3})*[,\.]\d{2})|\s+)\s+)"  // Debit (European decimal)
        R"((?:(\d{1,3}(?:[,\s]\d{3})*[,\.]\d{2})|\s+)\s+)"  // Credit
        R"((\d{1,3}(?:[,\s]\d{3})*[,\.]\d{2}))"              // Balance
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string debit = match[3].str();
        std::string credit = match[4].str();

        if (description.length() < 3) {
            ++iter;
            continue;
        }

        Transaction txn;
        txn.date = date;
        txn.description = description;

        bool isNegative = false;
        if (!debit.empty() && debit.find_first_of("0123456789") != std::string::npos) {
            txn.amount = parseAmount(debit, isNegative);
            txn.type = "debit";
        } else if (!credit.empty() && credit.find_first_of("0123456789") != std::string::npos) {
            txn.amount = parseAmount(credit, isNegative);
            txn.type = "credit";
        } else {
            ++iter;
            continue;
        }

        txn.balance = 0.0;
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 9: Multi-Currency Format (2% coverage)
// Format: Date | Description | Amount | Currency | CAD Equivalent | Balance
std::vector<Transaction> tryPattern9(const std::string& text) {
    std::vector<Transaction> transactions;

    std::regex pattern(
        R"((\d{1,2}/\d{1,2}/\d{2,4})\s+)"
        R"((.+?)\s+)"
        R"((-?\d{1,3}(?:,\d{3})*\.\d{2})\s+)"
        R"(([A-Z]{3})\s+)"  // Currency code (USD, CAD, EUR, etc.)
        R"((-?\d{1,3}(?:,\d{3})*\.\d{2}))"  // Converted amount
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string amountStr = match[3].str();
        std::string currency = match[4].str();

        if (description.length() < 3) {
            ++iter;
            continue;
        }

        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = description + " (" + currency + ")";
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = isNegative ? "debit" : "credit";
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// Pattern 10: Legacy/Simple Single-Date-Amount (10% coverage)
// Format: Date | Description | Amount (very permissive, catches many edge cases)
std::vector<Transaction> tryPattern10(const std::string& text) {
    std::vector<Transaction> transactions;

    // Very permissive pattern for legacy formats
    std::regex pattern(
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\s+)"
        R"((.{5,80}?)\s+)"  // Description (5-80 chars)
        R"((\d{1,3}(?:,\d{3})*\.\d{2})(?:\s|$))"  // Amount (no negative, no currency)
    );

    std::sregex_iterator iter(text.begin(), text.end(), pattern);
    std::sregex_iterator end;

    while (iter != end) {
        std::smatch match = *iter;

        std::string date = match[1].str();
        std::string description = cleanDescription(match[2].str());
        std::string amountStr = match[3].str();

        // Skip headers
        std::string descUpper = description;
        std::transform(descUpper.begin(), descUpper.end(), descUpper.begin(), ::toupper);
        if (descUpper.find("DESCRIPTION") != std::string::npos ||
            descUpper.find("BALANCE") != std::string::npos ||
            descUpper.find("TOTAL") != std::string::npos) {
            ++iter;
            continue;
        }

        if (description.length() < 5) {
            ++iter;
            continue;
        }

        bool isNegative = false;
        double amount = parseAmount(amountStr, isNegative);

        Transaction txn;
        txn.date = date;
        txn.description = description;
        txn.amount = amount;
        txn.balance = 0.0;
        txn.type = "debit";  // Assume debit for legacy formats
        txn.category = "uncategorized";

        transactions.push_back(txn);
        ++iter;
    }

    return transactions;
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

std::vector<Transaction> TransactionExtractor::extract(const std::string& text) {
    std::vector<Transaction> transactions;

    // Try each pattern in order of popularity (most common first)
    // Pattern 2: US/Credit Card Dual-Date (25% coverage)
    transactions = tryPattern2(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 2 matched: US/Credit Card Dual-Date (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 1: Canadian Dual-Date Separate Columns (20% coverage)
    transactions = tryPattern1(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 1 matched: Canadian Dual-Date Separate Columns (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 3: Simple Date-Description-Amount (15% coverage)
    transactions = tryPattern3(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 3 matched: Simple Date-Description-Amount (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 10: Legacy/Simple Single-Date-Amount (10% coverage - try early as fallback)
    transactions = tryPattern10(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 10 matched: Legacy Single-Date-Amount (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 4: Check-Heavy Format (8% coverage)
    transactions = tryPattern4(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 4 matched: Check-Heavy Format (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 6: Reference Number Format (7% coverage)
    transactions = tryPattern6(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 6 matched: Reference Number Format (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 5: Minimal Export (5% coverage)
    transactions = tryPattern5(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 5 matched: Minimal Export (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 7: Investment/Brokerage (5% coverage)
    transactions = tryPattern7(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 7 matched: Investment/Brokerage (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 8: Bilingual Format (3% coverage)
    transactions = tryPattern8(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 8 matched: Bilingual English/French (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    // Pattern 9: Multi-Currency Format (2% coverage)
    transactions = tryPattern9(text);
    if (!transactions.empty()) {
        std::cout << "✓ Pattern 9 matched: Multi-Currency Format (Found " << transactions.size() << " transactions)" << std::endl;
        return transactions;
    }

    std::cout << "⚠ No pattern matched. Found 0 transactions." << std::endl;
    return transactions; // Empty vector
}

} // namespace BankAnalyzer
