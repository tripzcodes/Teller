# Contributing to Teller

Thank you for your interest in contributing to Teller! This guide will help you contribute safely and effectively.

## 🎯 Ways to Contribute

- 🐛 **Report Bugs**: Found a bug? Let us know!
- 💡 **Request Features**: Have an idea? We'd love to hear it!
- 🏦 **Add Bank Support**: Help us support more banks!
- 📝 **Improve Documentation**: Fix typos, clarify instructions
- 💻 **Submit Code**: Fix bugs, add features, improve patterns
- ✅ **Test & Validate**: Test with your bank statements

## 🏦 Adding Support for Your Bank (Most Needed!)

Your bank format isn't working? Help us add support for it!

### Method 1: Report via GitHub (Easiest)

1. Go to [GitHub Issues](../../issues/new/choose)
2. Select **"Unsupported Bank Format"** template
3. Fill in bank name and follow the anonymization guide below
4. Paste 3-5 anonymized transaction lines
5. Submit!

We'll create a regex pattern for your bank and test it.

### Method 2: Manual Anonymization Guide

**Step 1: Get Sample Transactions**

Open your bank statement PDF and find 3-5 consecutive transaction lines. They usually look like:

```
Jan 15  Coffee Shop Downtown      12.50   450.30
Jan 16  Gas Station #4523         45.00   405.30
Jan 17  Grocery Store             87.50   317.80
```

**Step 2: Anonymize Sensitive Data**

✅ **SAFE to share** (keep as-is or similar):
- Date format: `Jan 15`, `01/15/2025`, `2025-01-15`
- Column structure and spacing
- Generic merchant names: `GROCERY STORE`, `GAS STATION`, `RESTAURANT`
- Format of amounts: `1,234.56` or `1.234,56`

❌ **MUST REMOVE** (replace with dummy data):
- Account numbers → `XXXX-XXXX-1234`
- Real merchant names → `MERCHANT NAME HERE`
- Your name → `CUSTOMER NAME`
- Actual amounts → Change to dummy values like `123.45`
- Real balances → Change to dummy values

**Example Anonymization:**

Before (sensitive):
```
Jan 15  Starbucks #4521 Toronto      5.75   1,234.56
Jan 16  Shell Gas Station            45.23   1,189.33
        John Doe - Account#: 1234567890
```

After (anonymized):
```
Jan 15  COFFEE SHOP LOCATION         12.50   500.00
Jan 16  GAS STATION                  45.00   455.00
        CUSTOMER NAME - Account#: XXXX-XXXX
```

**Step 3: Submit**

Create a new issue using the **"Unsupported Bank Format"** template and paste your anonymized samples.

### Method 3: Test Existing Patterns

If you're technical, you can test which pattern matches your bank:

1. Upload your statement to Teller
2. Open browser console (F12)
3. Look for: `⚠ No pattern matched` or `✓ Pattern X matched`
4. Report which pattern tried and why it failed

---

## 🐛 Reporting Bugs

1. Check if the bug is already reported in [Issues](../../issues)
2. Use the **"Bug Report"** template
3. Include:
   - Browser and OS version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (with sensitive info removed!)

---

## 💡 Requesting Features

1. Check if the feature is already requested
2. Use the **"Feature Request"** template
3. Describe:
   - The problem it solves
   - How you envision it working
   - Example use cases

---

## 💻 Contributing Code

### Prerequisites

- Node.js 18+
- Basic knowledge of TypeScript/Svelte
- For C++ changes: Emscripten SDK

### Development Setup

```bash
# Clone the repo
git clone https://github.com/tripzcodes/Teller.git
cd Teller

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start dev servers
npm run dev   # Frontend (port 5173)
# In another terminal:
cd backend && npm start  # Logging server (port 3001)
```

### Adding a New Pattern

See **[PATTERNS.md](PATTERNS.md)** for detailed pattern documentation.

1. Edit `cpp/src/extractor/transaction_extractor.cpp`
2. Add new `tryPatternX()` function
3. Add to pattern selection in `extract()` function
4. Rebuild WASM: `cd cpp/build && ninja`
5. Test with real statement
6. Document in PATTERNS.md

### Code Style

- **C++**: Follow existing style (2-space indent, camelCase)
- **TypeScript/Svelte**: Prettier default config
- **Comments**: Explain WHY, not WHAT
- **Commit messages**: `feat: `, `fix: `, `docs: ` prefixes

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/add-chase-pattern`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request with:
   - Clear description of changes
   - Link to related issues
   - Test results (bank names tested)
   - Screenshots if UI changes

---

## 📝 Documentation Improvements

Documentation is always welcome!

- Fix typos
- Clarify confusing sections
- Add examples
- Translate (future)

Just submit a PR with your changes!

---

## ✅ Testing

Help us test Teller with different banks:

1. Upload your statement (anonymize first!)
2. Report results:
   - ✅ Worked perfectly
   - ⚠️ Partial (some transactions missing)
   - ❌ Failed (0 transactions)
3. If failed, submit "Unsupported Bank" issue

### Banks We Need Testing For:

**🇨🇦 Canada**:
- ✅ RBC (tested, working)
- ✅ CIBC (tested, working)
- ❓ TD Bank
- ❓ BMO
- ❓ Scotiabank
- ❓ Tangerine
- ❓ Simplii
- ❓ Desjardins

**🇺🇸 USA**:
- ❓ Chase
- ❓ Bank of America
- ❓ Wells Fargo
- ❓ Citibank
- ❓ Capital One
- ❓ Ally Bank
- ❓ Discover
- ❓ American Express

---

## 🔒 Privacy & Security Guidelines

**NEVER share in issues or PRs:**
- Account numbers (full or partial beyond last 4 digits)
- Real transaction amounts
- Your name or others' names
- Social Security Numbers (SSN)
- Balances
- Any personally identifiable information

**When in doubt**: Change it to dummy data!

**We only need**:
- The structure/pattern of your statement
- Date and amount formats
- Column layout

Your financial privacy is our top priority. If you accidentally share sensitive info, delete it immediately and notify us.

---

## ❓ Questions?

- Check [DOCS.md](DOCS.md) for documentation index
- Ask in [GitHub Discussions](../../discussions) (coming soon)
- Open a [Question issue](../../issues/new?template=question.md)

---

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something useful!

- ✅ Be kind and courteous
- ✅ Respect differing viewpoints
- ✅ Focus on what's best for the community
- ❌ No harassment, trolling, or spam
- ❌ No sharing others' private information

---

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Future CONTRIBUTORS.md file
- Release notes for significant contributions

Thank you for helping make Teller better for everyone! 🙌

---

**Questions about contributing?** Open an issue with the "Question" template!
