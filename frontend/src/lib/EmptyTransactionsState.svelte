<script lang="ts">
  import { AlertCircle, Github } from 'lucide-svelte';

  const issueUrl = 'https://github.com/tripzcodes/Teller/issues/new?template=unsupported_bank.md&title=%5BBANK%5D%20';
</script>

<div class="empty-transactions">
  <div class="icon">
    <AlertCircle size={48} strokeWidth={1.5} />
  </div>

  <h3>No Transactions Found</h3>

  <p class="description">
    We couldn't extract any transactions from your statement. This usually means your bank's format isn't supported yet.
  </p>

  <div class="help-section">
    <p class="help-title">How to get your bank supported:</p>
    <ol>
      <li>Click the button below to open a GitHub issue</li>
      <li>Follow the anonymization guide to safely share 3-5 sample transaction lines</li>
      <li>We'll create a pattern for your bank format</li>
    </ol>
  </div>

  <a
    href={issueUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="submit-btn"
  >
    <Github size={18} />
    <span>Submit Bank Format</span>
  </a>

  <p class="privacy-note">
    Don't worry - we'll guide you through removing all sensitive information!
  </p>
</div>

<style>
  .empty-transactions {
    text-align: center;
    padding: 3rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .icon {
    color: #f59e0b;
    margin-bottom: 1.5rem;
  }

  :global(.dark) .icon {
    color: #fbbf24;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
  }

  :global(.dark) h3 {
    color: #f9fafb;
  }

  .description {
    font-size: 1rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  :global(.dark) .description {
    color: #9ca3af;
  }

  .help-section {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  :global(.dark) .help-section {
    background: #1f2937;
    border-color: #374151;
  }

  .help-title {
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.75rem 0;
    font-size: 0.9375rem;
  }

  :global(.dark) .help-title {
    color: #d1d5db;
  }

  ol {
    margin: 0;
    padding-left: 1.5rem;
    color: #6b7280;
    font-size: 0.9375rem;
    line-height: 1.7;
  }

  :global(.dark) ol {
    color: #9ca3af;
  }

  li {
    margin: 0.5rem 0;
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1.5rem;
    background: #111827;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
    border: 1px solid transparent;
  }

  .submit-btn:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  :global(.dark) .submit-btn {
    background: #374151;
    border-color: #4b5563;
  }

  :global(.dark) .submit-btn:hover {
    background: #4b5563;
    border-color: #6b7280;
  }

  .privacy-note {
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 1.25rem 0 0 0;
    font-style: italic;
  }

  :global(.dark) .privacy-note {
    color: #6b7280;
  }

  /* Mobile responsive styles */
  @media (max-width: 640px) {
    .empty-state {
      padding: 2rem 1.5rem;
    }

    .icon-container {
      width: 80px;
      height: 80px;
      margin-bottom: 1.25rem;
    }

    .title {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .description {
      font-size: 0.9375rem;
      margin-bottom: 2rem;
    }

    .feedback-form {
      padding: 1.25rem;
      gap: 1rem;
    }

    .feedback-form h3 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }

    .form-label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .form-textarea {
      padding: 0.75rem;
      font-size: 0.9375rem;
      min-height: 100px;
    }

    .submit-btn {
      padding: 0.75rem 1.25rem;
      font-size: 0.875rem;
      min-height: 44px;
      width: 100%;
    }

    .privacy-note {
      font-size: 0.8125rem;
      margin-top: 1rem;
    }
  }

  @media (max-width: 768px) {
    .empty-state {
      padding: 2.5rem 2rem;
    }

    .icon-container {
      width: 90px;
      height: 90px;
    }

    .title {
      font-size: 1.375rem;
    }
  }
</style>
