<script lang="ts">
  import { onMount } from 'svelte';
  import HomePage from './lib/HomePage.svelte';
  import FileUpload from './lib/FileUpload.svelte';
  import SpendingDashboard from './lib/SpendingDashboard.svelte';
  import TransactionTable from './lib/TransactionTable.svelte';
  import MLTrainingPanel from './lib/MLTrainingPanel.svelte';
  import PrivacyPolicy from './lib/PrivacyPolicy.svelte';
  import TermsOfService from './lib/TermsOfService.svelte';
  import ThemeToggle from './lib/ThemeToggle.svelte';
  import FeedbackButton from './lib/FeedbackButton.svelte';
  import EmptyTransactionsState from './lib/EmptyTransactionsState.svelte';
  import { FileText } from 'lucide-svelte';
  import { transactions } from './stores/transactionStore';
  import { theme } from './stores/themeStore';

  let currentPage: string = 'home';
  let isProcessing = false;
  let error: string | null = null;
  let hasProcessedFile = false;

  // Simple hash-based routing
  function handleNavigation(page: string) {
    currentPage = page;
    window.location.hash = page;
    window.scrollTo(0, 0);
  }

  // Handle browser back/forward
  function handleHashChange() {
    const hash = window.location.hash.slice(1);
    currentPage = hash || 'home';
  }

  onMount(() => {
    // Check initial hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      currentPage = hash;
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });
</script>

<div class="app">
  {#if currentPage === 'home'}
    <HomePage onNavigate={handleNavigation} />

  {:else if currentPage === 'app'}
    <main>
      <header>
        <div class="header-content">
          <button class="home-link" on:click={() => handleNavigation('home')}>
            ← Teller
          </button>
          <div class="header-text">
            <h1>Bank Statement Analyzer</h1>
            <p class="subtitle">Privacy-first analysis - all processing happens locally</p>
          </div>
          <div class="header-actions">
            <FeedbackButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div class="container">
        <FileUpload bind:isProcessing bind:error bind:hasProcessedFile />

        {#if error}
          <div class="error-message">
            <strong>Error:</strong> {error}
          </div>
        {/if}

        {#if $transactions.length > 0}
          <SpendingDashboard />
          <TransactionTable />
          <MLTrainingPanel />
        {:else if !isProcessing && hasProcessedFile}
          <EmptyTransactionsState />
        {:else if !isProcessing}
          <div class="empty-state">
            <div class="empty-icon">
              <FileText size={48} strokeWidth={1.5} />
            </div>
            <p>Upload a PDF bank statement to get started</p>
            <p class="hint">Your data never leaves your device - all processing is done locally</p>
          </div>
        {/if}

        {#if isProcessing}
          <div class="processing">
            <div class="spinner"></div>
            <p>Processing your statement...</p>
          </div>
        {/if}
      </div>
    </main>

  {:else if currentPage === 'privacy'}
    <PrivacyPolicy onNavigate={handleNavigation} />

  {:else if currentPage === 'terms'}
    <TermsOfService onNavigate={handleNavigation} />

  {:else}
    <!-- 404 fallback -->
    <div class="not-found">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button on:click={() => handleNavigation('home')}>Go Home</button>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f9fafb;
    transition: background 0.2s, color 0.2s;
  }

  :global(.dark body) {
    background: #111827;
    color: #f9fafb;
  }

  .app {
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  :global(.dark) header {
    border-bottom-color: #374151;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .header-text {
    flex: 1;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .home-link {
    background: none;
    border: none;
    color: #374151;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    transition: background 0.2s, color 0.2s;
  }

  .home-link:hover {
    background: #f3f4f6;
    color: #111827;
  }

  h1 {
    color: #111827;
    font-size: 1.875rem;
    margin: 0 0 0.375rem 0;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  :global(.dark) h1 {
    color: #f9fafb;
  }

  .subtitle {
    color: #6b7280;
    font-size: 0.9375rem;
    margin: 0;
  }

  :global(.dark) .subtitle {
    color: #9ca3af;
  }

  .container {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 2rem;
  }

  :global(.dark) .container {
    background: #1f2937;
    border-color: #374151;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }

  .empty-icon {
    margin-bottom: 1.5rem;
    color: #9ca3af;
  }

  :global(.dark) .empty-icon {
    color: #6b7280;
  }

  .empty-state p {
    font-size: 1rem;
    margin: 0.625rem 0;
    line-height: 1.6;
  }

  .empty-state p:first-of-type {
    font-size: 1.125rem;
    color: #374151;
  }

  :global(.dark) .empty-state p:first-of-type {
    color: #d1d5db;
  }

  .hint {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-size: 0.9375rem;
  }

  .processing {
    text-align: center;
    padding: 3.5rem 2rem;
    color: #6b7280;
  }

  .processing p {
    font-size: 0.9375rem;
    margin: 0;
  }

  .spinner {
    border: 2px solid #e5e7eb;
    border-top: 2px solid #111827;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .not-found {
    max-width: 600px;
    margin: 4rem auto;
    text-align: center;
    padding: 3rem 2rem;
  }

  .not-found h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #111827;
    font-weight: 600;
  }

  .not-found p {
    color: #6b7280;
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .not-found button {
    background: #111827;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }

  .not-found button:hover {
    background: #1f2937;
  }
</style>
