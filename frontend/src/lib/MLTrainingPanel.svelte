<script lang="ts">
  import { transactions } from '../stores/transactionStore';
  import { getMLCategorizer } from '../utils/mlCategorizer';
  import type { ModelMetrics } from '../utils/mlCategorizer';
  import { Brain, Download, Upload, Trash2, Play } from 'lucide-svelte';

  let isTraining = false;
  let modelTrained = false;
  let trainingSize = 0;
  let metrics: ModelMetrics | null = null;
  let errorMessage = '';
  let successMessage = '';

  const mlCategorizer = getMLCategorizer();

  // Check if model is already loaded
  $: {
    modelTrained = mlCategorizer.isModelTrained();
    trainingSize = mlCategorizer.getTrainingDataSize();
  }

  async function trainModel() {
    try {
      isTraining = true;
      errorMessage = '';
      successMessage = '';

      // Add all current transactions as training data
      mlCategorizer.addTrainingDataBatch($transactions);

      // Train the model
      metrics = await mlCategorizer.trainModel(50, 0.2);

      successMessage = `Model trained successfully! Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`;
      modelTrained = true;

      // Auto-save the model
      await mlCategorizer.exportModel();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to train model';
    } finally {
      isTraining = false;
    }
  }

  async function loadModel() {
    try {
      errorMessage = '';
      successMessage = '';

      const loaded = await mlCategorizer.importModel();
      if (loaded) {
        successMessage = 'Model loaded successfully!';
        modelTrained = true;
        trainingSize = mlCategorizer.getTrainingDataSize();
      } else {
        errorMessage = 'No saved model found';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to load model';
    }
  }

  async function saveModel() {
    try {
      errorMessage = '';
      successMessage = '';

      await mlCategorizer.exportModel();
      successMessage = 'Model saved successfully!';
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to save model';
    }
  }

  async function clearModel() {
    if (!confirm('Are you sure you want to clear the ML model and all training data?')) {
      return;
    }

    try {
      errorMessage = '';
      successMessage = '';

      await mlCategorizer.clearModel();
      successMessage = 'Model cleared successfully';
      modelTrained = false;
      trainingSize = 0;
      metrics = null;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to clear model';
    }
  }
</script>

<div class="ml-panel">
  <div class="panel-header">
    <div class="header-title">
      <Brain size={20} />
      <h3>Machine Learning</h3>
    </div>
    <div class="status">
      {#if modelTrained}
        <span class="status-badge trained">Model Trained</span>
      {:else}
        <span class="status-badge untrained">Not Trained</span>
      {/if}
    </div>
  </div>

  <div class="panel-content">
    {#if errorMessage}
      <div class="message error">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="message success">
        {successMessage}
      </div>
    {/if}

    <div class="info-section">
      <div class="info-item">
        <span class="info-label">Training Data:</span>
        <span class="info-value">{trainingSize} transactions</span>
      </div>

      {#if metrics}
        <div class="info-item">
          <span class="info-label">Accuracy:</span>
          <span class="info-value">{(metrics.accuracy * 100).toFixed(1)}%</span>
        </div>
        <div class="info-item">
          <span class="info-label">Loss:</span>
          <span class="info-value">{metrics.loss.toFixed(4)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Vocabulary:</span>
          <span class="info-value">{metrics.vocabulary} words</span>
        </div>
      {/if}
    </div>

    <div class="help-text">
      <p><strong>How it works:</strong></p>
      <ul>
        <li>Click categories to edit and correct them</li>
        <li>The ML model learns from your corrections</li>
        <li>Train the model to improve future predictions</li>
        <li>Model is saved automatically in your browser</li>
      </ul>
    </div>

    <div class="actions">
      <button
        class="btn btn-primary"
        on:click={trainModel}
        disabled={isTraining || $transactions.length < 10}
        title={$transactions.length < 10 ? 'Need at least 10 transactions' : 'Train model on current transactions'}
      >
        <Play size={16} />
        {isTraining ? 'Training...' : 'Train Model'}
      </button>

      <button
        class="btn btn-secondary"
        on:click={loadModel}
        disabled={isTraining}
        title="Load saved model from browser storage"
      >
        <Upload size={16} />
        Load Model
      </button>

      <button
        class="btn btn-secondary"
        on:click={saveModel}
        disabled={!modelTrained || isTraining}
        title="Save model to browser storage"
      >
        <Download size={16} />
        Save Model
      </button>

      <button
        class="btn btn-danger"
        on:click={clearModel}
        disabled={!modelTrained || isTraining}
        title="Clear model and training data"
      >
        <Trash2 size={16} />
        Clear Model
      </button>
    </div>

    {#if $transactions.length < 10}
      <div class="warning">
        Upload more transactions (minimum 10) to train the ML model.
      </div>
    {/if}
  </div>
</div>

<style>
  .ml-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-top: 2rem;
  }

  :global(.dark) .ml-panel {
    background: #1f2937;
    border-color: #374151;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  :global(.dark) .panel-header {
    border-bottom-color: #374151;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #111827;
  }

  :global(.dark) .header-title {
    color: #f9fafb;
  }

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.trained {
    background: #d1fae5;
    color: #065f46;
  }

  .status-badge.untrained {
    background: #fee2e2;
    color: #991b1b;
  }

  :global(.dark) .status-badge.trained {
    background: #064e3b;
    color: #6ee7b7;
  }

  :global(.dark) .status-badge.untrained {
    background: #7f1d1d;
    color: #fca5a5;
  }

  .panel-content {
    padding: 1.5rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .message.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .message.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  :global(.dark) .message.error {
    background: #7f1d1d;
    color: #fca5a5;
    border-color: #991b1b;
  }

  :global(.dark) .message.success {
    background: #064e3b;
    color: #6ee7b7;
    border-color: #065f46;
  }

  .info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }

  :global(.dark) .info-label {
    color: #9ca3af;
  }

  .info-value {
    font-size: 1.125rem;
    color: #111827;
    font-weight: 600;
  }

  :global(.dark) .info-value {
    color: #f9fafb;
  }

  .help-text {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
  }

  :global(.dark) .help-text {
    background: #111827;
  }

  .help-text p {
    margin: 0 0 0.5rem 0;
    color: #374151;
    font-size: 0.875rem;
  }

  :global(.dark) .help-text p {
    color: #d1d5db;
  }

  .help-text ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #6b7280;
    font-size: 0.875rem;
  }

  :global(.dark) .help-text ul {
    color: #9ca3af;
  }

  .help-text li {
    margin: 0.25rem 0;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #111827;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #1f2937;
  }

  :global(.dark) .btn-primary {
    background: #f9fafb;
    color: #111827;
  }

  :global(.dark) .btn-primary:hover:not(:disabled) {
    background: #e5e7eb;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
  }

  :global(.dark) .btn-secondary {
    background: #374151;
    color: #d1d5db;
  }

  :global(.dark) .btn-secondary:hover:not(:disabled) {
    background: #4b5563;
  }

  .btn-danger {
    background: #fee2e2;
    color: #991b1b;
  }

  .btn-danger:hover:not(:disabled) {
    background: #fecaca;
  }

  :global(.dark) .btn-danger {
    background: #7f1d1d;
    color: #fca5a5;
  }

  :global(.dark) .btn-danger:hover:not(:disabled) {
    background: #991b1b;
  }

  .warning {
    background: #fef3c7;
    color: #92400e;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    margin-top: 1rem;
    border: 1px solid #fde68a;
  }

  :global(.dark) .warning {
    background: #78350f;
    color: #fde68a;
    border-color: #92400e;
  }

  /* Mobile responsive styles */
  @media (max-width: 640px) {
    .panel {
      padding: 1.25rem;
    }

    .panel h2 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .panel p {
      font-size: 0.875rem;
    }

    .info-section {
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .info-item {
      padding: 0.875rem;
    }

    .info-label {
      font-size: 0.75rem;
    }

    .info-value {
      font-size: 1.25rem;
    }

    .actions {
      gap: 0.625rem;
    }

    .btn, .btn-danger {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      width: 100%;
      min-height: 44px;
    }

    .training-form {
      gap: 1rem;
      padding: 1rem;
    }

    .form-group label {
      font-size: 0.875rem;
    }

    .form-group input,
    .form-group select {
      padding: 0.75rem;
      font-size: 0.9375rem;
      min-height: 44px;
    }

    .warning {
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 768px) {
    .panel {
      padding: 1.5rem;
    }

    .info-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }

    .btn, .btn-danger {
      width: 100%;
    }
  }
</style>
