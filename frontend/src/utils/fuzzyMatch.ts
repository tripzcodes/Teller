// Fuzzy string matching utilities for merchant name recognition

/**
 * Calculate Levenshtein distance between two strings
 * Lower distance = more similar strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Create 2D array for dynamic programming
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
export function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 1;

  return 1 - distance / maxLength;
}

/**
 * Check if two strings are fuzzy matches
 * @param str1 First string
 * @param str2 Second string
 * @param threshold Similarity threshold (0-1), default 0.7
 */
export function isFuzzyMatch(str1: string, str2: string, threshold: number = 0.7): boolean {
  return similarityScore(str1, str2) >= threshold;
}

/**
 * Find best fuzzy match from a list of candidates
 * @param target Target string to match
 * @param candidates List of candidate strings
 * @param threshold Minimum similarity threshold
 * @returns Best matching string or null if no match above threshold
 */
export function findBestMatch(
  target: string,
  candidates: string[],
  threshold: number = 0.7
): { match: string; score: number } | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const score = similarityScore(target, candidate);
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  return bestMatch ? { match: bestMatch, score: bestScore } : null;
}

/**
 * Clean merchant name for better matching
 * Removes common noise like location identifiers, transaction IDs, etc.
 */
export function cleanMerchantName(name: string): string {
  let cleaned = name.trim();

  // Remove common patterns that add noise
  // Transaction IDs, dates, locations with numbers
  cleaned = cleaned.replace(/\s+#?\d{3,}/g, ''); // Remove long numbers (transaction IDs)
  cleaned = cleaned.replace(/\s+\d{1,2}\/\d{1,2}\/\d{2,4}/g, ''); // Remove dates
  cleaned = cleaned.replace(/\s+\d{1,2}-\d{1,2}-\d{2,4}/g, ''); // Remove dates

  // Remove location indicators
  cleaned = cleaned.replace(/\s+(store|location|branch)\s+#?\d+/gi, '');

  // Remove state/zip codes at end
  cleaned = cleaned.replace(/\s+[A-Z]{2}\s+\d{5}(-\d{4})?$/gi, '');

  // Remove common suffixes
  cleaned = cleaned.replace(/\s+(inc|llc|ltd|corp|corporation)\.?$/gi, '');

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Extract merchant name from transaction description
 * Handles common formats like "PURCHASE AT MERCHANT NAME" or "DEBIT CARD MERCHANT"
 */
export function extractMerchantName(description: string): string {
  let merchant = description.trim();

  // Remove common prefixes
  const prefixes = [
    /^(purchase|payment|debit card|credit card|withdrawal|transfer|atm|pos|direct debit)\s+(at|to|from|for)?\s*/i,
    /^(card payment|online payment|mobile payment)\s+(to|at)?\s*/i,
    /^(dd|so|bp|tfr|trf|tfp|bgc)\s*/i, // Bank transaction codes
  ];

  for (const prefix of prefixes) {
    merchant = merchant.replace(prefix, '');
  }

  // Clean up the result
  merchant = cleanMerchantName(merchant);

  return merchant;
}

/**
 * Normalize merchant name for consistent matching
 * Useful for grouping similar merchants
 */
export function normalizeMerchantName(name: string): string {
  let normalized = extractMerchantName(name);

  // Convert to lowercase
  normalized = normalized.toLowerCase();

  // Remove special characters except spaces
  normalized = normalized.replace(/[^a-z0-9\s]/g, '');

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Group similar merchant names together
 * Useful for analytics and reporting
 */
export function groupSimilarMerchants(
  merchants: string[],
  threshold: number = 0.8
): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  const processed = new Set<string>();

  for (const merchant of merchants) {
    if (processed.has(merchant)) continue;

    const normalized = normalizeMerchantName(merchant);
    const group: string[] = [merchant];
    processed.add(merchant);

    // Find similar merchants
    for (const other of merchants) {
      if (processed.has(other) || merchant === other) continue;

      const otherNormalized = normalizeMerchantName(other);
      if (isFuzzyMatch(normalized, otherNormalized, threshold)) {
        group.push(other);
        processed.add(other);
      }
    }

    groups.set(normalized, group);
  }

  return groups;
}
