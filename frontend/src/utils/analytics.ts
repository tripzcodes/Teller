// Analytics utilities for transaction data analysis

import type { Transaction } from '../stores/transactionStore';
import { extractMerchantName } from './fuzzyMatch';

export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MerchantTotal {
  merchant: string;
  total: number;
  count: number;
  category: string;
}

export interface DailySpending {
  date: string;
  total: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface MonthlySpending {
  month: string;
  year: number;
  total: number;
  income: number;
  expenses: number;
  transactionCount: number;
}

export interface SpendingSummary {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  averageTransaction: number;
  transactionCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Calculate category totals from transactions
 */
export function calculateCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const categoryMap = new Map<string, { total: number; count: number }>();

  // Sum up by category
  for (const txn of transactions) {
    if (txn.type === 'debit') {
      const current = categoryMap.get(txn.category) || { total: 0, count: 0 };
      categoryMap.set(txn.category, {
        total: current.total + txn.amount,
        count: current.count + 1
      });
    }
  }

  // Calculate total for percentages
  const grandTotal = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.total, 0);

  // Convert to array and calculate percentages
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Get top merchants by spending
 */
export function getTopMerchants(transactions: Transaction[], limit: number = 10): MerchantTotal[] {
  const merchantMap = new Map<string, { total: number; count: number; category: string }>();

  for (const txn of transactions) {
    if (txn.type === 'debit') {
      const merchant = extractMerchantName(txn.description);
      const current = merchantMap.get(merchant) || { total: 0, count: 0, category: txn.category };
      merchantMap.set(merchant, {
        total: current.total + txn.amount,
        count: current.count + 1,
        category: txn.category
      });
    }
  }

  return Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({
      merchant,
      total: data.total,
      count: data.count,
      category: data.category
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * Get daily spending data for timeline chart
 */
export function getDailySpending(transactions: Transaction[]): DailySpending[] {
  const dailyMap = new Map<string, { income: number; expenses: number; balance: number }>();

  // Group by date
  for (const txn of transactions) {
    const date = normalizeDate(txn.date);
    const current = dailyMap.get(date) || { income: 0, expenses: 0, balance: 0 };

    if (txn.type === 'credit') {
      current.income += txn.amount;
    } else {
      current.expenses += txn.amount;
    }
    current.balance = txn.balance;

    dailyMap.set(date, current);
  }

  // Convert to array and sort by date
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      total: data.expenses - data.income,
      income: data.income,
      expenses: data.expenses,
      balance: data.balance
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get monthly spending data
 */
export function getMonthlySpending(transactions: Transaction[]): MonthlySpending[] {
  const monthlyMap = new Map<string, { income: number; expenses: number; count: number; year: number }>();

  for (const txn of transactions) {
    const date = parseDate(txn.date);
    if (!date) continue;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const current = monthlyMap.get(monthKey) || { income: 0, expenses: 0, count: 0, year: date.getFullYear() };

    if (txn.type === 'credit') {
      current.income += txn.amount;
    } else {
      current.expenses += txn.amount;
    }
    current.count += 1;

    monthlyMap.set(monthKey, current);
  }

  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month: formatMonth(month),
      year: data.year,
      total: data.expenses - data.income,
      income: data.income,
      expenses: data.expenses,
      transactionCount: data.count
    }))
    .sort((a, b) => {
      const aDate = new Date(a.year, parseInt(a.month.split('/')[0]) - 1);
      const bDate = new Date(b.year, parseInt(b.month.split('/')[0]) - 1);
      return aDate.getTime() - bDate.getTime();
    });
}

/**
 * Calculate overall spending summary
 */
export function getSpendingSummary(transactions: Transaction[]): SpendingSummary {
  let totalIncome = 0;
  let totalExpenses = 0;
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const txn of transactions) {
    if (txn.type === 'credit') {
      totalIncome += txn.amount;
    } else {
      totalExpenses += txn.amount;
    }

    const date = parseDate(txn.date);
    if (date) {
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    }
  }

  return {
    totalIncome,
    totalExpenses,
    netChange: totalIncome - totalExpenses,
    averageTransaction: transactions.length > 0 ? totalExpenses / transactions.length : 0,
    transactionCount: transactions.length,
    dateRange: {
      start: minDate ? minDate.toISOString().split('T')[0] : '',
      end: maxDate ? maxDate.toISOString().split('T')[0] : ''
    }
  };
}

/**
 * Detect anomalous transactions (unusually large amounts)
 */
export function detectAnomalies(transactions: Transaction[], threshold: number = 2): Transaction[] {
  if (transactions.length < 3) return [];

  // Calculate mean and standard deviation for debit transactions
  const debits = transactions.filter(t => t.type === 'debit');
  if (debits.length < 3) return [];

  const amounts = debits.map(t => t.amount);
  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  // Find transactions beyond threshold standard deviations
  return transactions.filter(txn => {
    if (txn.type !== 'debit') return false;
    const zScore = Math.abs((txn.amount - mean) / stdDev);
    return zScore > threshold;
  });
}

/**
 * Parse date string to Date object
 */
function parseDate(dateStr: string): Date | null {
  try {
    // Try various date formats
    const formats = [
      // MM/DD/YYYY
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      // DD-MM-YYYY
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      // YYYY-MM-DD
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      // DD MMM YYYY
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{4})/i
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (match[0].includes('-') && match[1].length === 4) {
          // YYYY-MM-DD
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        } else if (match[2] && /[A-Za-z]/.test(match[2])) {
          // DD MMM YYYY
          const months: { [key: string]: number } = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
          };
          const month = months[match[2].toLowerCase().slice(0, 3)];
          return new Date(parseInt(match[3]), month, parseInt(match[1]));
        } else {
          // MM/DD/YYYY or DD-MM-YYYY
          return new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
        }
      }
    }

    // Fallback to Date constructor
    return new Date(dateStr);
  } catch {
    return null;
  }
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;
  return date.toISOString().split('T')[0];
}

/**
 * Format month key to readable format
 */
function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${month}/${year}`;
}
