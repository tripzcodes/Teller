#pragma once
#include "../extractor/transaction_extractor.h"
#include <vector>
#include <map>
#include <string>

namespace BankAnalyzer {

struct AnalysisResult {
    double totalIncome;
    double totalExpenses;
    double netChange;
    std::map<std::string, double> categoryTotals;
    std::vector<Transaction> anomalies;
};

class Analyzer {
public:
    Analyzer();
    ~Analyzer();

    /**
     * Analyze a set of transactions
     * @param transactions Vector of transactions to analyze
     * @return Analysis results including totals, trends, and anomalies
     */
    AnalysisResult analyze(const std::vector<Transaction>& transactions);

private:
    double calculateMean(const std::vector<double>& values);
    double calculateStdDev(const std::vector<double>& values, double mean);
};

} // namespace BankAnalyzer
