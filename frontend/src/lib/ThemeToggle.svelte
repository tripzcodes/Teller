<script lang="ts">
  import { theme, toggleTheme } from '../stores/themeStore';
</script>

<button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle dark mode">
  {#if $theme === 'light'}
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.5 4.5L16.5 3.5M3.5 16.5L4.5 15.5M15.5 15.5L16.5 16.5M3.5 3.5L4.5 4.5M13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7C11.6569 7 13 8.34315 13 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  {:else}
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10.5C16.8 14.3 13.7 17.4 9.9 17.6C6.1 17.8 2.8 14.9 2.2 11.2C1.9 9.3 2.4 7.5 3.5 6.1C4 5.5 3.7 4.6 3 4.4C2.8 4.3 2.6 4.3 2.4 4.4C0.9 5.4 -0.1 7.1 0 9C0.2 13.3 3.6 16.9 7.9 17.4C12.2 17.9 16 15 17.1 11C17.6 9.2 17.4 7.4 16.6 5.8C16.3 5.2 15.5 5.1 15 5.5C14.8 5.6 14.7 5.8 14.6 6C15.4 7.3 15.8 8.9 15.6 10.5C15.5 10.5 17 10.5 17 10.5Z" fill="currentColor"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    background: none;
    border: 1px solid var(--border-color, #e5e7eb);
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }

  .theme-toggle:hover {
    background: var(--hover-bg, #f3f4f6);
    color: var(--text-primary, #111827);
    border-color: var(--border-hover, #d1d5db);
  }

  :global(.dark) .theme-toggle {
    border-color: #374151;
    color: #9ca3af;
  }

  :global(.dark) .theme-toggle:hover {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
</style>
