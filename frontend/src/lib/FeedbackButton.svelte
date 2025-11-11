<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';

  const feedbackUrl = 'https://github.com/tripzcodes/Teller/issues/new/choose';
</script>

<a
  href={feedbackUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="feedback-btn"
  title="Report bugs, request features, or contribute bank formats"
>
  <MessageCircle size={18} />
  <span>Feedback</span>
</a>

<style>
  .feedback-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #111827;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
    border: 1px solid transparent;
  }

  .feedback-btn:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }

  .feedback-btn:active {
    transform: translateY(0);
  }

  :global(.dark) .feedback-btn {
    background: #374151;
    border-color: #4b5563;
  }

  :global(.dark) .feedback-btn:hover {
    background: #4b5563;
    border-color: #6b7280;
  }

  @media (max-width: 640px) {
    .feedback-btn span {
      display: none;
    }
  }
</style>
