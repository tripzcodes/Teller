import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

// Get initial theme from localStorage or system preference
function getInitialTheme(): 'light' | 'dark' {
  if (!browser) return 'light';

  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export const theme = writable<'light' | 'dark'>(getInitialTheme());

// Subscribe to theme changes and update localStorage + document class
theme.subscribe(value => {
  if (browser) {
    localStorage.setItem('theme', value);
    document.documentElement.classList.toggle('dark', value === 'dark');
  }
});

export function toggleTheme() {
  theme.update(current => current === 'light' ? 'dark' : 'light');
}
