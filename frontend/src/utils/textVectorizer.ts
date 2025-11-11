// Text vectorization for ML model input
// Converts transaction descriptions into numerical features

import { normalizeMerchantName } from './fuzzyMatch';

export interface VocabularyItem {
  word: string;
  index: number;
  frequency: number;
}

export class TextVectorizer {
  private vocabulary: Map<string, number>;
  private maxVocabSize: number;
  private vectorLength: number;

  constructor(maxVocabSize: number = 1000, vectorLength: number = 100) {
    this.vocabulary = new Map();
    this.maxVocabSize = maxVocabSize;
    this.vectorLength = vectorLength;
  }

  /**
   * Build vocabulary from a list of texts
   */
  buildVocabulary(texts: string[]): void {
    const wordFrequency = new Map<string, number>();

    // Count word frequencies
    for (const text of texts) {
      const words = this.tokenize(text);
      for (const word of words) {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      }
    }

    // Sort by frequency and take top N words
    const sortedWords = Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxVocabSize);

    // Build vocabulary map
    this.vocabulary.clear();
    sortedWords.forEach(([word, _], index) => {
      this.vocabulary.set(word, index);
    });
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    // Normalize the text
    const normalized = normalizeMerchantName(text);

    // Split into words and filter out empty strings
    return normalized
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Convert text to vector using bag-of-words representation
   */
  textToVector(text: string): number[] {
    const vector = new Array(this.vectorLength).fill(0);
    const words = this.tokenize(text);

    for (const word of words) {
      const index = this.vocabulary.get(word);
      if (index !== undefined && index < this.vectorLength) {
        vector[index] += 1;
      }
    }

    return vector;
  }

  /**
   * Convert text to TF-IDF weighted vector
   */
  textToTfIdfVector(text: string, documentFrequencies: Map<string, number>, totalDocs: number): number[] {
    const vector = new Array(this.vectorLength).fill(0);
    const words = this.tokenize(text);
    const wordCounts = new Map<string, number>();

    // Count words in this document
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    // Calculate TF-IDF
    for (const [word, count] of wordCounts) {
      const index = this.vocabulary.get(word);
      if (index !== undefined && index < this.vectorLength) {
        const tf = count / words.length;
        const df = documentFrequencies.get(word) || 1;
        const idf = Math.log((totalDocs + 1) / (df + 1));
        vector[index] = tf * idf;
      }
    }

    return vector;
  }

  /**
   * Normalize vector to unit length
   */
  normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map(val => val / magnitude);
  }

  /**
   * Get vocabulary size
   */
  getVocabularySize(): number {
    return this.vocabulary.size;
  }

  /**
   * Get vocabulary as array
   */
  getVocabulary(): string[] {
    return Array.from(this.vocabulary.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([word]) => word);
  }

  /**
   * Export vocabulary to JSON
   */
  exportVocabulary(): string {
    const vocab = Array.from(this.vocabulary.entries());
    return JSON.stringify({
      vocabulary: vocab,
      maxVocabSize: this.maxVocabSize,
      vectorLength: this.vectorLength
    });
  }

  /**
   * Import vocabulary from JSON
   */
  importVocabulary(json: string): void {
    const data = JSON.parse(json);
    this.vocabulary = new Map(data.vocabulary);
    this.maxVocabSize = data.maxVocabSize;
    this.vectorLength = data.vectorLength;
  }
}

/**
 * Extract features from transaction for ML model
 */
export function extractTransactionFeatures(
  description: string,
  amount: number,
  type: string,
  vectorizer: TextVectorizer
): number[] {
  // Get text vector
  const textVector = vectorizer.textToVector(description);

  // Add numerical features
  const features = [
    ...textVector,
    Math.log(Math.abs(amount) + 1),  // Log-scaled amount
    type === 'debit' ? 1 : 0,        // Transaction type (binary)
  ];

  return features;
}
