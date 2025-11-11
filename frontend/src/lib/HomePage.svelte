<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import BetaBanner from './BetaBanner.svelte';
  import { Lock, Zap, TrendingUp, Globe, Code2, Building2 } from 'lucide-svelte';
  export let onNavigate: (page: string) => void;
</script>

<div class="homepage">
  <BetaBanner />

  <div class="theme-toggle-wrapper">
    <ThemeToggle />
  </div>

  <header class="hero">
    <h1>Teller</h1>
    <p class="tagline">Your personal banking teller, running entirely in your browser</p>
    <p class="subtitle">Analyze statements, track spending, and gain insights without ever sending your data to the cloud</p>
    <button class="cta-button" on:click={() => onNavigate('app')}>
      Get Started
    </button>
  </header>

  <section class="features">
    <h2>Why Teller?</h2>
    <div class="feature-grid">
      <div class="feature">
        <div class="feature-icon">
          <Lock size={24} strokeWidth={1.5} />
        </div>
        <h3>100% Private</h3>
        <p>All processing happens locally in your browser. Your financial data never leaves your device.</p>
      </div>

      <div class="feature">
        <div class="feature-icon">
          <Zap size={24} strokeWidth={1.5} />
        </div>
        <h3>Blazing Fast</h3>
        <p>Built with C++ and WebAssembly for near-native performance. Analyze statements in seconds.</p>
      </div>

      <div class="feature">
        <div class="feature-icon">
          <TrendingUp size={24} strokeWidth={1.5} />
        </div>
        <h3>Smart Analysis</h3>
        <p>Automatic transaction extraction, categorization, and spending insights.</p>
      </div>

      <div class="feature">
        <div class="feature-icon">
          <Globe size={24} strokeWidth={1.5} />
        </div>
        <h3>No Installation</h3>
        <p>Works entirely in your browser. No apps to download, no accounts to create.</p>
      </div>

      <div class="feature">
        <div class="feature-icon">
          <Code2 size={24} strokeWidth={1.5} />
        </div>
        <h3>Free & Open Source</h3>
        <p>Always free to use. Open source on GitHub for full transparency.</p>
      </div>

      <div class="feature">
        <div class="feature-icon">
          <Building2 size={24} strokeWidth={1.5} />
        </div>
        <h3>Multi-Bank Support</h3>
        <p>Works with statements from any bank. Just upload your PDF.</p>
      </div>
    </div>
  </section>

  <section class="how-it-works">
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Upload</h3>
        <p>Drag and drop your bank statement PDF</p>
      </div>

      <div class="step">
        <div class="step-number">2</div>
        <h3>Analyze</h3>
        <p>Teller extracts and categorizes transactions</p>
      </div>

      <div class="step">
        <div class="step-number">3</div>
        <h3>Insights</h3>
        <p>View spending patterns and trends</p>
      </div>
    </div>
  </section>

  <section class="tech">
    <h2>Built with Modern Technology</h2>
    <div class="tech-details">
      <p><strong>C++ & WebAssembly</strong> - High-performance PDF parsing and analysis</p>
      <p><strong>PDFium</strong> - Chrome's production-grade PDF library</p>
      <p><strong>Svelte</strong> - Modern, reactive UI framework</p>
      <p><strong>TypeScript</strong> - Type-safe frontend code</p>
    </div>
  </section>

  <footer class="footer">
    <p>&copy; 2025 Teller. Open source and free to use.</p>
    <div class="footer-links">
      <button on:click={() => onNavigate('privacy')}>Privacy Policy</button>
      <button on:click={() => onNavigate('terms')}>Terms of Service</button>
      <a href="https://github.com/tripzcodes/Teller" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>
</div>

<style>
  .homepage {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
    position: relative;
  }

  .theme-toggle-wrapper {
    position: absolute;
    top: 5rem;
    right: 2rem;
    z-index: 10;
  }

  .hero {
    text-align: center;
    padding: 6rem 2rem;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    color: #111827;
    margin-bottom: 5rem;
  }

  :global(.dark) .hero {
    background: #111827;
    border-bottom-color: #374151;
  }

  .hero h1 {
    font-size: 3.75rem;
    margin: 0 0 1.5rem 0;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: #111827;
  }

  :global(.dark) .hero h1 {
    color: #f9fafb;
  }

  .tagline {
    font-size: 1.25rem;
    margin: 0 auto 0.75rem;
    font-weight: 400;
    color: #374151;
    max-width: 600px;
    line-height: 1.6;
  }

  :global(.dark) .tagline {
    color: #d1d5db;
  }

  .subtitle {
    font-size: 1rem;
    margin: 0 auto 2.5rem;
    color: #6b7280;
    max-width: 560px;
    line-height: 1.6;
  }

  :global(.dark) .subtitle {
    color: #9ca3af;
  }

  .cta-button {
    background: #111827;
    color: white;
    border: none;
    padding: 0.875rem 2.5rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .cta-button:hover {
    background: #1f2937;
  }

  :global(.dark) .cta-button {
    background: #f9fafb;
    color: #111827;
  }

  :global(.dark) .cta-button:hover {
    background: #e5e7eb;
  }

  .features, .how-it-works, .tech {
    padding: 0 2rem;
  }

  .features h2, .how-it-works h2, .tech h2 {
    text-align: center;
    font-size: 2.25rem;
    margin-bottom: 3.5rem;
    color: #111827;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  :global(.dark) .features h2,
  :global(.dark) .how-it-works h2,
  :global(.dark) .tech h2 {
    color: #f9fafb;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 6rem;
  }

  .feature {
    padding: 2rem 1.75rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .feature:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  :global(.dark) .feature {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark) .feature:hover {
    border-color: #4b5563;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .feature-icon {
    margin-bottom: 1rem;
    color: #111827;
  }

  :global(.dark) .feature-icon {
    color: #f9fafb;
  }

  .feature h3 {
    font-size: 1.125rem;
    margin: 0 0 0.75rem 0;
    color: #111827;
    font-weight: 600;
  }

  :global(.dark) .feature h3 {
    color: #f9fafb;
  }

  .feature p {
    color: #6b7280;
    line-height: 1.65;
    font-size: 0.9375rem;
    margin: 0;
  }

  :global(.dark) .feature p {
    color: #9ca3af;
  }

  .steps {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin-bottom: 6rem;
    flex-wrap: wrap;
  }

  .step {
    text-align: center;
    max-width: 250px;
  }

  .step-number {
    width: 48px;
    height: 48px;
    background: #111827;
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 auto 1.25rem;
  }

  :global(.dark) .step-number {
    background: #f9fafb;
    color: #111827;
  }

  .step h3 {
    font-size: 1.125rem;
    margin: 0 0 0.625rem 0;
    font-weight: 600;
    color: #111827;
  }

  :global(.dark) .step h3 {
    color: #f9fafb;
  }

  .step p {
    color: #6b7280;
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 0;
  }

  :global(.dark) .step p {
    color: #9ca3af;
  }

  .tech {
    background: #f9fafb;
    padding: 3.5rem 2rem;
    border-radius: 0;
    margin-bottom: 6rem;
  }

  :global(.dark) .tech {
    background: #1f2937;
  }

  .tech-details {
    max-width: 700px;
    margin: 0 auto;
  }

  .tech-details p {
    font-size: 1rem;
    margin: 1.25rem 0;
    padding: 0.875rem 0;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    line-height: 1.6;
  }

  :global(.dark) .tech-details p {
    border-bottom-color: #374151;
    color: #d1d5db;
  }

  .tech-details p:last-child {
    border-bottom: none;
  }

  .tech-details strong {
    color: #111827;
    font-weight: 600;
  }

  :global(.dark) .tech-details strong {
    color: #f9fafb;
  }

  .footer {
    text-align: center;
    padding: 3rem 2rem;
    border-top: 1px solid #e5e7eb;
    margin-top: 0;
  }

  :global(.dark) .footer {
    border-top-color: #374151;
  }

  .footer p {
    margin: 0 0 1.25rem 0;
    color: #6b7280;
    font-size: 0.9375rem;
  }

  :global(.dark) .footer p {
    color: #9ca3af;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .footer-links button,
  .footer-links a {
    background: none;
    border: none;
    color: #374151;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.9375rem;
    padding: 0.5rem;
    transition: color 0.2s;
  }

  .footer-links button:hover,
  .footer-links a:hover {
    color: #111827;
  }

  :global(.dark) .footer-links button,
  :global(.dark) .footer-links a {
    color: #9ca3af;
  }

  :global(.dark) .footer-links button:hover,
  :global(.dark) .footer-links a:hover {
    color: #f9fafb;
  }
</style>
