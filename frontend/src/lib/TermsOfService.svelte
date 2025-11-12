<script lang="ts">
  export let onNavigate: (page: string) => void;
</script>

<div class="terms-page">
  <button class="back-button" on:click={() => onNavigate('home')}>← Back to Home</button>

  <h1>Terms of Service</h1>
  <p class="updated">Last updated: November 8, 2025</p>

  <section>
    <h2>Agreement to Terms</h2>
    <p>
      By accessing and using Teller, you agree to be bound by these Terms of Service.
      If you do not agree to these terms, please do not use Teller.
    </p>
  </section>

  <section>
    <h2>Description of Service</h2>
    <p>
      Teller is a free, open-source web application that allows you to analyze bank statement PDFs
      locally in your web browser. The service processes your data entirely on your device using
      WebAssembly technology - no data is sent to external servers.
    </p>
  </section>

  <section>
    <h2>Use of Service</h2>
    <h3>Permitted Use</h3>
    <p>You may use Teller for:</p>
    <ul>
      <li>Personal financial analysis and record-keeping</li>
      <li>Analyzing your own bank statements from any financial institution</li>
      <li>Learning about your spending patterns and financial habits</li>
      <li>Educational purposes</li>
    </ul>

    <h3>Prohibited Use</h3>
    <p>You may NOT use Teller for:</p>
    <ul>
      <li>Analyzing bank statements that don't belong to you without explicit permission</li>
      <li>Any illegal purposes or activities</li>
      <li>Attempting to reverse engineer, decompile, or disassemble the service</li>
      <li>Attempting to circumvent any security features</li>
      <li>Commercial purposes without appropriate licensing</li>
    </ul>
  </section>

  <section>
    <h2>Your Data and Privacy</h2>
    <p>
      Teller processes all data locally in your browser. We do not:
    </p>
    <ul>
      <li>Collect, store, or transmit your personal data</li>
      <li>Have access to your bank statements or financial information</li>
      <li>Track your usage or behavior</li>
      <li>Share data with third parties (because we don't have any data)</li>
    </ul>
    <p>
      For complete details, please see our <button class="inline-link" on:click={() => onNavigate('privacy')}>Privacy Policy</button>.
    </p>
  </section>

  <section>
    <h2>No Warranty</h2>
    <p>
      Teller is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either express or implied, including but not limited to:
    </p>
    <ul>
      <li>Warranties of merchantability</li>
      <li>Fitness for a particular purpose</li>
      <li>Non-infringement</li>
      <li>Accuracy of results</li>
      <li>Uninterrupted or error-free operation</li>
    </ul>
    <p>
      We make no guarantees that:
    </p>
    <ul>
      <li>Teller will correctly parse or analyze all bank statement formats</li>
      <li>The categorization or analysis will be accurate</li>
      <li>The service will be available at all times</li>
      <li>Your browser will support all features</li>
    </ul>
  </section>

  <section>
    <h2>Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, Teller and its developers shall not be liable for any:
    </p>
    <ul>
      <li>Direct, indirect, incidental, special, or consequential damages</li>
      <li>Loss of data or financial information</li>
      <li>Loss of profits or revenue</li>
      <li>Errors in analysis or categorization</li>
      <li>Decisions made based on information provided by Teller</li>
    </ul>
    <p>
      You use Teller at your own risk and are solely responsible for any decisions you make based on its output.
    </p>
  </section>

  <section>
    <h2>Accuracy and Financial Decisions</h2>
    <p>
      Teller is a tool for analyzing and understanding your financial data. However:
    </p>
    <ul>
      <li>Always verify important financial information with your bank or financial institution</li>
      <li>Do not rely solely on Teller for critical financial decisions</li>
      <li>Teller is not a substitute for professional financial advice</li>
      <li>Transaction extraction may not be 100% accurate for all bank formats</li>
    </ul>
  </section>

  <section>
    <h2>Open Source License</h2>
    <p>
      Teller is open source software licensed under the MIT License. You are free to:
    </p>
    <ul>
      <li>Use the software for any purpose</li>
      <li>Modify the source code</li>
      <li>Distribute copies</li>
      <li>Contribute improvements</li>
    </ul>
    <p>
      See the LICENSE file in the GitHub repository for complete license terms.
    </p>
  </section>

  <section>
    <h2>Changes to Service</h2>
    <p>
      We reserve the right to:
    </p>
    <ul>
      <li>Modify or discontinue Teller at any time</li>
      <li>Update features, fix bugs, or make improvements</li>
      <li>Change these Terms of Service with notice on this page</li>
    </ul>
    <p>
      Continued use of Teller after changes constitutes acceptance of the new terms.
    </p>
  </section>

  <section>
    <h2>Browser Compatibility</h2>
    <p>
      Teller requires a modern web browser with WebAssembly support. We recommend:
    </p>
    <ul>
      <li>Chrome 90+</li>
      <li>Firefox 88+</li>
      <li>Safari 14+</li>
      <li>Edge 90+</li>
    </ul>
    <p>
      Older browsers may not support all features or may not work at all.
    </p>
  </section>

  <section>
    <h2>Indemnification</h2>
    <p>
      You agree to indemnify and hold harmless Teller and its developers from any claims,
      damages, losses, or expenses arising from:
    </p>
    <ul>
      <li>Your use of Teller</li>
      <li>Your violation of these Terms of Service</li>
      <li>Your violation of any rights of another party</li>
    </ul>
  </section>

  <section>
    <h2>Severability</h2>
    <p>
      If any provision of these Terms is found to be unenforceable or invalid, that provision
      will be limited or eliminated to the minimum extent necessary so that these Terms will
      otherwise remain in full force and effect.
    </p>
  </section>

  <section>
    <h2>Governing Law</h2>
    <p>
      These Terms shall be governed by and construed in accordance with applicable laws,
      without regard to conflict of law principles.
    </p>
  </section>

  <section>
    <h2>Contact and Support</h2>
    <p>
      For questions, issues, or feedback:
    </p>
    <ul>
      <li>Open an issue on our GitHub repository</li>
      <li>Check the documentation for common questions</li>
      <li>Review the open source code to understand how Teller works</li>
    </ul>
    <p>
      As Teller is open source and provided free of charge, we cannot guarantee response times
      or ongoing support.
    </p>
  </section>

  <section>
    <h2>Acceptance of Terms</h2>
    <p>
      By using Teller, you acknowledge that you have read, understood, and agree to be bound
      by these Terms of Service and our Privacy Policy.
    </p>
  </section>

  <div class="footer-nav">
    <button on:click={() => onNavigate('home')}>Back to Home</button>
    <button on:click={() => onNavigate('privacy')}>Privacy Policy</button>
  </div>
</div>

<style>
  .terms-page {
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

  .inline-link {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-size: inherit;
  }

  .inline-link:hover {
    color: #5568d3;
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

  /* Mobile responsive styles */
  @media (max-width: 640px) {
    .terms-container {
      padding: 1.5rem 1rem;
    }

    .terms-container h1 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    .last-updated {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .terms-container h2 {
      font-size: 1.25rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    .terms-container h3 {
      font-size: 1rem;
      margin-top: 1.5rem;
    }

    .terms-container p,
    .terms-container li {
      font-size: 0.9375rem;
      line-height: 1.7;
    }

    .footer-nav {
      margin-top: 2rem;
      padding-top: 1.5rem;
    }

    .footer-nav button {
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      width: 100%;
      max-width: 250px;
      min-height: 44px;
    }
  }

  @media (max-width: 768px) {
    .terms-container {
      padding: 2rem 1.5rem;
    }

    .terms-container h1 {
      font-size: 2rem;
    }

    .terms-container h2 {
      font-size: 1.375rem;
    }
  }
</style>
