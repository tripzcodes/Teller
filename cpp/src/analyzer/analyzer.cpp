#include "analyzer.h"
#include <cmath>
#include <numeric>

namespace BankAnalyzer {

Analyzer::Analyzer() {
}

Analyzer::~Analyzer() {
}

AnalysisResult Analyzer::analyze(const std::vector<Transaction>& transactions) {
    AnalysisResult result;
    result.totalIncome = 0.0;
    result.totalExpenses = 0.0;

    // Calculate totals by transaction type
    for (const auto& txn : transactions) {
        if (txn.type == "credit") {
            result.totalIncome += txn.amount;
        } else {
            result.totalExpenses += txn.amount;
        }
    }

    result.netChange = result.totalIncome - result.totalExpenses;

    return result;
}

double Analyzer::calculateMean(const std::vector<double>& values) {
    if (values.empty()) return 0.0;
    return std::accumulate(values.begin(), values.end(), 0.0) / values.size();
}

double Analyzer::calculateStdDev(const std::vector<double>& values, double mean) {
    if (values.empty()) return 0.0;

    double variance = 0.0;
    for (double value : values) {
        variance += std::pow(value - mean, 2);
    }
    variance /= values.size();

    return std::sqrt(variance);
}

} // namespace BankAnalyzer
