<script lang="ts">
  export let onNavigate: (page: string) => void;
</script>

<div class="policy-page">
  <button class="back-button" on:click={() => onNavigate('home')}>← Back to Home</button>

  <h1>Privacy Policy</h1>
  <p class="updated">Last updated: November 8, 2025</p>

  <section>
    <h2>Our Commitment to Privacy</h2>
    <p>
      Teller is built with privacy at its core. We believe your financial data should remain yours and yours alone.
      This privacy policy explains how Teller handles your data - or rather, how it doesn't.
    </p>
  </section>

  <section>
    <h2>Data Processing</h2>
    <h3>What Happens to Your Data</h3>
    <p>
      When you upload a bank statement PDF to Teller:
    </p>
    <ul>
      <li><strong>100% Local Processing:</strong> All analysis happens entirely in your web browser</li>
      <li><strong>No Server Uploads:</strong> Your PDFs and transaction data are NEVER sent to any server</li>
      <li><strong>No Cloud Storage:</strong> We don't store your data anywhere - not in the cloud, not on our servers</li>
      <li><strong>No Tracking:</strong> We don't use analytics, cookies, or any tracking technologies</li>
    </ul>

    <h3>Technical Implementation</h3>
    <p>
      Teller uses WebAssembly (WASM) technology to run C++ code directly in your browser. This means:
    </p>
    <ul>
      <li>PDF parsing happens on your device using PDFium (Chrome's PDF library)</li>
      <li>Transaction extraction and analysis run locally using our C++ engine</li>
      <li>All data remains in your browser's memory and is cleared when you close the tab</li>
    </ul>
  </section>

  <section>
    <h2>Data We Do NOT Collect</h2>
    <p>We do not collect, store, or have access to:</p>
    <ul>
      <li>Your bank statements or PDFs</li>
      <li>Your transaction data</li>
      <li>Your personal information</li>
      <li>Your browsing behavior</li>
      <li>Your IP address</li>
      <li>Any analytics or usage data</li>
    </ul>
  </section>

  <section>
    <h2>Local Storage</h2>
    <p>
      Currently, Teller does not use any local storage (cookies, localStorage, or IndexedDB).
      All data is processed in memory and discarded when you close the browser tab.
    </p>
    <p>
      In future versions, we may add optional local storage features to save your preferences or
      analyzed statements on your device. This will always be:
    </p>
    <ul>
      <li>Opt-in only</li>
      <li>Stored locally on your device</li>
      <li>Never synchronized or uploaded to any server</li>
      <li>Fully controlled by you (with clear delete options)</li>
    </ul>
  </section>

  <section>
    <h2>Open Source Transparency</h2>
    <p>
      Teller is fully open source. You can review the entire codebase on GitHub to verify that:
    </p>
    <ul>
      <li>No data is sent to external servers</li>
      <li>No tracking or analytics code exists</li>
      <li>All processing happens locally as stated</li>
    </ul>
    <p>
      We encourage security researchers and privacy advocates to audit our code and report any concerns.
    </p>
  </section>

  <section>
    <h2>Third-Party Services</h2>
    <p>
      Teller does not integrate with any third-party services, APIs, or analytics platforms.
      The only external resources loaded are:
    </p>
    <ul>
      <li>The Teller web application files (HTML, CSS, JavaScript)</li>
      <li>WebAssembly modules (PDFium and our C++ analyzer)</li>
    </ul>
    <p>
      These are served once when you load the page and cached by your browser. No subsequent
      network requests are made during PDF analysis.
    </p>
  </section>

  <section>
    <h2>Your Rights</h2>
    <p>
      Since we don't collect any data, there's no data to access, modify, or delete.
      You maintain complete control over your information at all times because it never leaves your device.
    </p>
  </section>

  <section>
    <h2>Changes to This Policy</h2>
    <p>
      If we make any changes to how Teller handles data, we will update this privacy policy
      and clearly indicate the date of the latest revision. Any changes will maintain our core
      commitment to privacy and local processing.
    </p>
  </section>

  <section>
    <h2>Contact</h2>
    <p>
      If you have questions about this privacy policy or Teller's privacy practices,
      please open an issue on our GitHub repository.
    </p>
  </section>

  <div class="footer-nav">
    <button on:click={() => onNavigate('home')}>Back to Home</button>
    <button on:click={() => onNavigate('terms')}>Terms of Service</button>
  </div>
</div>

<style>
  .policy-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.6;
  }

  .back-button {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem 0;
    margin-bottom: 2rem;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  h1 {
    color: #333;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .updated {
    color: #666;
    font-style: italic;
    margin-bottom: 2rem;
  }

  section {
    margin-bottom: 2.5rem;
  }

  h2 {
    color: #667eea;
    font-size: 1.8rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: #333;
    font-size: 1.3rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    color: #444;
    margin-bottom: 1rem;
  }

  ul {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.5rem 0;
    color: #444;
  }

  strong {
    color: #333;
    font-weight: 600;
  }

  .footer-nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #e0e0e0;
  }

  .footer-nav button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .footer-nav button:hover {
    background: #5568d3;
  }
</style>
