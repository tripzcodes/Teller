// Machine Learning categorizer using TensorFlow.js
// Learns from user feedback to improve categorization

import * as tf from '@tensorflow/tfjs';
import type { Transaction } from '../stores/transactionStore';
import { TextVectorizer, extractTransactionFeatures } from './textVectorizer';
import { getAllCategories, CATEGORIES } from './categorizer';

export interface TrainingData {
  description: string;
  amount: number;
  type: string;
  category: string;
}

export interface ModelMetrics {
  accuracy: number;
  loss: number;
  trainingSize: number;
  vocabulary: number;
}

export class MLCategorizer {
  private model: tf.LayersModel | null = null;
  private vectorizer: TextVectorizer;
  private categoryToIndex: Map<string, number>;
  private indexToCategory: Map<number, string>;
  private trainingData: TrainingData[] = [];
  private isTraining: boolean = false;

  constructor() {
    this.vectorizer = new TextVectorizer(100, 100);

    // Initialize category mappings
    this.categoryToIndex = new Map();
    this.indexToCategory = new Map();

    const categories = getAllCategories();
    categories.forEach((category, index) => {
      this.categoryToIndex.set(category, index);
      this.indexToCategory.set(index, category);
    });
  }

  /**
   * Build and compile the neural network model
   */
  buildModel(inputSize: number, numCategories: number): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        // Input layer with dropout for regularization
        tf.layers.dense({
          inputShape: [inputSize],
          units: 128,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.3 }),

        // Hidden layer
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }),
        tf.layers.dropout({ rate: 0.2 }),

        // Output layer with softmax for multi-class classification
        tf.layers.dense({
          units: numCategories,
          activation: 'softmax'
        })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Add training data from user corrections
   */
  addTrainingData(transaction: Transaction): void {
    this.trainingData.push({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category
    });
  }

  /**
   * Add multiple training samples
   */
  addTrainingDataBatch(transactions: Transaction[]): void {
    transactions.forEach(txn => this.addTrainingData(txn));
  }

  /**
   * Train the model on accumulated data
   */
  async trainModel(epochs: number = 50, validationSplit: number = 0.2): Promise<ModelMetrics> {
    if (this.trainingData.length < 10) {
      throw new Error('Need at least 10 training samples to train the model');
    }

    this.isTraining = true;

    try {
      // Build vocabulary from training data descriptions
      const descriptions = this.trainingData.map(d => d.description);
      this.vectorizer.buildVocabulary(descriptions);

      // Prepare training data
      const features: number[][] = [];
      const labels: number[] = [];

      for (const data of this.trainingData) {
        const feature = extractTransactionFeatures(
          data.description,
          data.amount,
          data.type,
          this.vectorizer
        );
        features.push(feature);

        const categoryIndex = this.categoryToIndex.get(data.category) || 0;
        labels.push(categoryIndex);
      }

      // Convert to tensors
      const xs = tf.tensor2d(features);
      const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), this.categoryToIndex.size);

      // Build model if not exists
      if (!this.model) {
        this.model = this.buildModel(features[0].length, this.categoryToIndex.size);
      }

      // Train the model
      const history = await this.model.fit(xs, ys, {
        epochs,
        validationSplit,
        batchSize: 32,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
          }
        }
      });

      // Clean up tensors
      xs.dispose();
      ys.dispose();

      const finalLoss = history.history.loss[history.history.loss.length - 1] as number;
      const finalAccuracy = history.history.acc[history.history.acc.length - 1] as number;

      return {
        accuracy: finalAccuracy,
        loss: finalLoss,
        trainingSize: this.trainingData.length,
        vocabulary: this.vectorizer.getVocabularySize()
      };
    } finally {
      this.isTraining = false;
    }
  }

  /**
   * Predict category for a transaction
   */
  async predict(transaction: Transaction): Promise<{ category: string; confidence: number }> {
    if (!this.model) {
      throw new Error('Model not trained yet');
    }

    const features = extractTransactionFeatures(
      transaction.description,
      transaction.amount,
      transaction.type,
      this.vectorizer
    );

    const input = tf.tensor2d([features]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const probabilities = await prediction.array() as number[][];

    // Clean up tensors
    input.dispose();
    prediction.dispose();

    // Get category with highest probability
    const probs = probabilities[0];
    const maxIndex = probs.indexOf(Math.max(...probs));
    const category = this.indexToCategory.get(maxIndex) || CATEGORIES.UNCATEGORIZED;
    const confidence = probs[maxIndex];

    return { category, confidence };
  }

  /**
   * Predict categories for multiple transactions
   */
  async predictBatch(transactions: Transaction[]): Promise<Array<{ category: string; confidence: number }>> {
    if (!this.model) {
      throw new Error('Model not trained yet');
    }

    const features = transactions.map(txn =>
      extractTransactionFeatures(txn.description, txn.amount, txn.type, this.vectorizer)
    );

    const input = tf.tensor2d(features);
    const predictions = this.model.predict(input) as tf.Tensor;
    const probabilities = await predictions.array() as number[][];

    // Clean up tensors
    input.dispose();
    predictions.dispose();

    return probabilities.map(probs => {
      const maxIndex = probs.indexOf(Math.max(...probs));
      return {
        category: this.indexToCategory.get(maxIndex) || CATEGORIES.UNCATEGORIZED,
        confidence: probs[maxIndex]
      };
    });
  }

  /**
   * Export model to browser storage
   */
  async exportModel(): Promise<void> {
    if (!this.model) {
      throw new Error('No model to export');
    }

    await this.model.save('localstorage://transaction-categorizer');

    // Also save vectorizer vocabulary
    const vocab = this.vectorizer.exportVocabulary();
    localStorage.setItem('transaction-categorizer-vocab', vocab);

    // Save training data
    localStorage.setItem('transaction-categorizer-training', JSON.stringify(this.trainingData));
  }

  /**
   * Import model from browser storage
   */
  async importModel(): Promise<boolean> {
    try {
      // Load model
      this.model = await tf.loadLayersModel('localstorage://transaction-categorizer');

      // Load vocabulary
      const vocab = localStorage.getItem('transaction-categorizer-vocab');
      if (vocab) {
        this.vectorizer.importVocabulary(vocab);
      }

      // Load training data
      const trainingData = localStorage.getItem('transaction-categorizer-training');
      if (trainingData) {
        this.trainingData = JSON.parse(trainingData);
      }

      return true;
    } catch (error) {
      console.error('Failed to import model:', error);
      return false;
    }
  }

  /**
   * Clear all training data and model
   */
  async clearModel(): Promise<void> {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }

    this.trainingData = [];

    // Clear from storage
    try {
      await tf.io.removeModel('localstorage://transaction-categorizer');
      localStorage.removeItem('transaction-categorizer-vocab');
      localStorage.removeItem('transaction-categorizer-training');
    } catch (error) {
      console.error('Failed to clear model:', error);
    }
  }

  /**
   * Check if model is trained
   */
  isModelTrained(): boolean {
    return this.model !== null;
  }

  /**
   * Get training data size
   */
  getTrainingDataSize(): number {
    return this.trainingData.length;
  }

  /**
   * Check if currently training
   */
  isCurrentlyTraining(): boolean {
    return this.isTraining;
  }
}

// Singleton instance
let mlCategorizerInstance: MLCategorizer | null = null;

/**
 * Get the ML categorizer singleton instance
 */
export function getMLCategorizer(): MLCategorizer {
  if (!mlCategorizerInstance) {
    mlCategorizerInstance = new MLCategorizer();
  }
  return mlCategorizerInstance;
}
