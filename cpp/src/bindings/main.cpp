#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "../extractor/transaction_extractor.h"
#include "../analyzer/analyzer.h"

using namespace emscripten;
using namespace BankAnalyzer;

// Wrapper function to extract transactions
val extractTransactions(const std::string& text) {
    TransactionExtractor extractor;
    std::vector<Transaction> transactions = extractor.extract(text);

    // Convert to JavaScript array
    val jsTransactions = val::array();
    for (size_t i = 0; i < transactions.size(); ++i) {
        val jsTxn = val::object();
        jsTxn.set("date", transactions[i].date);
        jsTxn.set("description", transactions[i].description);
        jsTxn.set("amount", transactions[i].amount);
        jsTxn.set("balance", transactions[i].balance);
        jsTxn.set("type", transactions[i].type);
        jsTxn.set("category", transactions[i].category);
        jsTransactions.set(i, jsTxn);
    }

    return jsTransactions;
}

// Wrapper function for analysis
val analyzeTransactions(const val& jsTransactions) {
    // Convert JavaScript array to C++ vector
    std::vector<Transaction> transactions;
    unsigned int length = jsTransactions["length"].as<unsigned int>();

    for (unsigned int i = 0; i < length; ++i) {
        val jsTxn = jsTransactions[i];
        Transaction txn;
        txn.date = jsTxn["date"].as<std::string>();
        txn.description = jsTxn["description"].as<std::string>();
        txn.amount = jsTxn["amount"].as<double>();
        txn.balance = jsTxn["balance"].as<double>();
        txn.type = jsTxn["type"].as<std::string>();
        txn.category = jsTxn["category"].as<std::string>();
        transactions.push_back(txn);
    }

    Analyzer analyzer;
    AnalysisResult result = analyzer.analyze(transactions);

    // Convert result to JavaScript object
    val jsResult = val::object();
    jsResult.set("totalIncome", result.totalIncome);
    jsResult.set("totalExpenses", result.totalExpenses);
    jsResult.set("netChange", result.netChange);

    // Convert category totals
    val jsCategoryTotals = val::object();
    for (const auto& pair : result.categoryTotals) {
        jsCategoryTotals.set(pair.first, pair.second);
    }
    jsResult.set("categoryTotals", jsCategoryTotals);

    return jsResult;
}

// Bind functions to JavaScript
EMSCRIPTEN_BINDINGS(bank_analyzer) {
    function("extractTransactions", &extractTransactions);
    function("analyzeTransactions", &analyzeTransactions);
}
