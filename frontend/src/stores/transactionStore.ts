import { writable } from 'svelte/store';
import { categorizeTransaction } from '../utils/categorizer';
import { getMLCategorizer } from '../utils/mlCategorizer';

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'debit' | 'credit';
  category: string;
}

export interface AnalysisResult {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  categoryTotals: Record<string, number>;
}

// Store for all transactions
export const transactions = writable<Transaction[]>([]);

// Store for analysis results
export const analysisResult = writable<AnalysisResult | null>(null);

// Helper functions
export function addTransactions(newTransactions: Transaction[]) {
  // Automatically categorize transactions if they don't have a category or are uncategorized
  const categorized = newTransactions.map(txn => {
    if (!txn.category || txn.category === 'uncategorized') {
      return {
        ...txn,
        category: categorizeTransaction(txn.description, txn.type)
      };
    }
    return txn;
  });

  transactions.update(txns => [...txns, ...categorized]);
}

export function clearTransactions() {
  transactions.set([]);
  analysisResult.set(null);
}

export function setAnalysis(result: AnalysisResult) {
  analysisResult.set(result);
}

export function updateTransactionCategory(index: number, newCategory: string) {
  transactions.update(txns => {
    if (index >= 0 && index < txns.length) {
      const oldCategory = txns[index].category;
      txns[index].category = newCategory;

      // If the user corrected the category, add it as training data for ML
      if (oldCategory !== newCategory) {
        const mlCategorizer = getMLCategorizer();
        mlCategorizer.addTrainingData(txns[index]);
      }
    }
    return txns;
  });
}
