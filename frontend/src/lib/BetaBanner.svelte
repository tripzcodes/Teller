<script lang="ts">
  import { Beaker, Github } from 'lucide-svelte';

  const githubUrl = 'https://github.com/tripzcodes/Teller/issues/new/choose';
</script>

<div class="beta-banner">
  <div class="beta-content">
    <div class="beta-badge">
      <Beaker size={16} />
      <span>BETA</span>
    </div>
    <p class="beta-text">
      Teller is in active development. Some bank formats may not be supported yet.
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="feedback-link">
        <Github size={14} />
        Report issues or contribute
      </a>
    </p>
  </div>
</div>

<style>
  .beta-banner {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-bottom: 1px solid #fbbf24;
    padding: 0.75rem 1rem;
  }

  :global(.dark) .beta-banner {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    border-bottom-color: #b45309;
  }

  .beta-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .beta-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    background: #f59e0b;
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  :global(.dark) .beta-badge {
    background: #d97706;
  }

  .beta-text {
    font-size: 0.875rem;
    color: #78350f;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  :global(.dark) .beta-text {
    color: #fef3c7;
  }

  .feedback-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: #92400e;
    text-decoration: none;
    font-weight: 500;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .feedback-link:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  :global(.dark) .feedback-link {
    color: #fcd34d;
  }

  :global(.dark) .feedback-link:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    .beta-content {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .beta-text {
      flex-direction: column;
      gap: 0.375rem;
    }
  }
</style>
