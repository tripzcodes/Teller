<script lang="ts">
  import { Upload } from 'lucide-svelte';
  import { parsePDF, extractTransactions } from '../utils/wasmLoader';
  import { addTransactions, clearTransactions } from '../stores/transactionStore';
  import { saveLog, type AnalysisLogEntry } from '../utils/logger';

  export let isProcessing = false;
  export let error: string | null = null;
  export let hasProcessedFile = false;

  let fileInput: HTMLInputElement;
  let isDragging = false;

  async function handleFile(file: File) {
    if (!file || file.type !== 'application/pdf') {
      error = 'Please upload a PDF file';
      return;
    }

    isProcessing = true;
    error = null;
    const startTime = performance.now();

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Parse PDF using PDF.js
      console.log('Parsing PDF...');
      const text = await parsePDF(uint8Array);
      console.log('Extracted text:', text.substring(0, 200));

      // Extract transactions using C++ WASM module
      console.log('Extracting transactions...');
      const transactions = await extractTransactions(text);
      console.log('Found transactions:', transactions);

      // Calculate statistics
      const categories = new Set(transactions.map((t: any) => t.category));
      const dates = transactions
        .map((t: any) => t.date)
        .filter(Boolean)
        .sort();
      const dateRange = dates.length > 0
        ? { start: dates[0], end: dates[dates.length - 1] }
        : null;

      const processingTime = performance.now() - startTime;

      // Create log entry
      const logEntry: AnalysisLogEntry = {
        timestamp: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        textLength: text.length,
        transactionCount: transactions.length,
        categories: Array.from(categories),
        dateRange,
        processingTime,
        success: true,
        extractedText: text.substring(0, 2000), // Sample for JSON
        fullText: text // Full text for debugging
      };

      // Save log to backend
      saveLog(logEntry);

      // Add to store
      clearTransactions();
      addTransactions(transactions);

    } catch (err) {
      console.error('Error processing PDF:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF. Make sure the WASM module is built.';
      error = errorMessage;

      // Save error log
      const errorLog: AnalysisLogEntry = {
        timestamp: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        textLength: 0,
        transactionCount: 0,
        categories: [],
        dateRange: null,
        processingTime: performance.now() - startTime,
        success: false,
        error: errorMessage
      };
      saveLog(errorLog);

    } finally {
      isProcessing = false;
      hasProcessedFile = true;
    }
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function triggerFileInput() {
    fileInput.click();
  }
</script>

<div class="upload-section">
  <input
    type="file"
    accept="application/pdf"
    bind:this={fileInput}
    on:change={handleFileSelect}
    style="display: none"
  />

  <div
    class="drop-zone"
    class:dragging={isDragging}
    on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:click={triggerFileInput}
  >
    <div class="icon">
      <Upload size={48} strokeWidth={1.5} />
    </div>
    <p class="main-text">
      {#if isDragging}
        Drop your PDF here
      {:else}
        Drag and drop your bank statement PDF
      {/if}
    </p>
    <p class="sub-text">or click to browse</p>
    <button class="browse-button" on:click|stopPropagation={triggerFileInput}>
      Choose File
    </button>
  </div>
</div>


<style>
  .upload-section {
    margin-bottom: 2rem;
  }

  .drop-zone {
    border: 2px dashed #e5e7eb;
    border-radius: 8px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #f9fafb;
  }

  .drop-zone:hover {
    border-color: #d1d5db;
    background: #f3f4f6;
  }

  .drop-zone.dragging {
    border-color: #9ca3af;
    background: #f3f4f6;
    border-style: solid;
  }

  :global(.dark) .drop-zone {
    background: #111827;
    border-color: #374151;
  }

  :global(.dark) .drop-zone:hover {
    border-color: #4b5563;
    background: #1f2937;
  }

  :global(.dark) .drop-zone.dragging {
    border-color: #6b7280;
    background: #1f2937;
  }

  .icon {
    margin-bottom: 1rem;
    color: #6b7280;
  }

  :global(.dark) .icon {
    color: #9ca3af;
  }

  .main-text {
    font-size: 1rem;
    color: #374151;
    margin: 0.5rem 0;
    font-weight: 500;
  }

  :global(.dark) .main-text {
    color: #d1d5db;
  }

  .sub-text {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.5rem 0 1.5rem;
  }

  :global(.dark) .sub-text {
    color: #9ca3af;
  }

  .browse-button {
    background: #111827;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .browse-button:hover {
    background: #1f2937;
  }

  :global(.dark) .browse-button {
    background: #f9fafb;
    color: #111827;
  }

  :global(.dark) .browse-button:hover {
    background: #e5e7eb;
  }

</style>
