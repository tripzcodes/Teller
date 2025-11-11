# Teller

![Beta](https://img.shields.io/badge/status-beta-yellow) ![License](https://img.shields.io/badge/license-AGPL--3.0-blue) ![Privacy](https://img.shields.io/badge/privacy-100%25%20local-green)

An open-source, privacy-first bank statement analyzer that runs 100% in your browser using WebAssembly.

**⚠️ Status**: **PUBLIC BETA** - Teller is in active development. Core features are working, but some bank formats may not be supported yet.

> **Teller** - Your personal banking teller, running entirely in your browser. Analyze statements, track spending, and gain insights without ever sending your data to the cloud.

**Found a bug or unsupported bank format?** [Open an issue on GitHub](https://github.com/tripzcodes/Teller/issues/new/choose) - we'd love your feedback!

## Features

- ✅ **PDF Parsing**: Upload bank statement PDFs locally (using PDF.js)
- ✅ **Universal Transaction Extraction**: Smart regex patterns work with any bank format
- ✅ **Smart Categorization**: Rule-based auto-categorization into 17 categories
- ✅ **Machine Learning**: TensorFlow.js neural network learns from your corrections
- ✅ **Interactive Learning**: Click to edit categories, model learns from feedback
- ✅ **Universal Bank Support**: Works with continuous text extraction from any PDF format
- ✅ **Fuzzy Matching**: Intelligent merchant name recognition and grouping
- ✅ **Analysis Engine**: Calculate totals, statistics, and category breakdowns
- ✅ **Modern UI**: Clean interface with dark mode support
- ✅ **Model Persistence**: Save and load trained models in your browser
- ✅ **Interactive Dashboard**: Comprehensive spending analytics with D3.js
- ✅ **Visual Analytics**: Pie charts, timelines, bar charts for spending patterns
- ✅ **Anomaly Detection**: Automatically detect unusually large transactions
- ✅ **Monthly Comparisons**: Track spending trends across months
- 🔒 **100% Local**: All processing happens in your browser - your data never leaves your device

## Tech Stack

- **Frontend**: Svelte + TypeScript (Vite dev server on port 5173)
- **Backend (Dev)**: Express.js logging server (port 3001)
- **Core Engine**: C++ compiled to WebAssembly (via Emscripten)
- **PDF Parsing**: PDF.js (Mozilla's JavaScript PDF library)
- **Transaction Extraction**: C++ regex patterns on continuous text (236KB WASM)
- **ML Engine**: TensorFlow.js (neural network categorization)
- **Text Processing**: Custom vectorizer with bag-of-words and TF-IDF
- **Visualization**: D3.js v7 (interactive charts and analytics)
- **Storage**: Browser LocalStorage (for ML model persistence)
- **Logging**: File-based logging to `/logs` directory (JSON + full text files)

## Architecture

```
PDF File → PDF.js (Browser) → Continuous Text Stream
              ↓
       C++ Universal Parser WASM (236KB) → Transactions[]
              ↓
       TensorFlow.js ML Categorization → Categorized Transactions
              ↓
       D3.js Visualizations → Dashboard Analytics
              ↓
       Express Logging Server → /logs/*.json + *_fulltext.txt (development only)
```

All processing happens locally in the browser. Total WASM size: 236KB (our code).

## Project Structure

```
bankstatementanalyzer/
├── cpp/                          # C++ source code (compiled to WASM)
│   ├── src/
│   │   ├── extractor/           # ✅ Universal transaction parser (continuous text)
│   │   ├── analyzer/            # ✅ Statistical analysis
│   │   └── bindings/            # ✅ Emscripten JS↔C++ bridge
│   ├── build/                   # Build output directory
│   └── CMakeLists.txt           # CMake configuration
├── frontend/                     # Svelte application
│   ├── src/
│   │   ├── lib/                 # Svelte components
│   │   ├── utils/               # WASM loader, logger, categorizer, ML
│   │   └── stores/              # State management
│   └── public/wasm/             # WASM modules
│       ├── bank_analyzer.wasm   # Our C++ code (236KB)
│       └── bank_analyzer.js     # Analyzer glue code
├── backend/                      # Development logging server
│   ├── server.js                # Express server (port 3001)
│   └── package.json             # Backend dependencies
├── logs/                         # Analysis logs (development)
│   ├── *.json                   # Log metadata + sample text
│   └── *_fulltext.txt           # Complete extracted PDF text
└── start-dev.bat                 # Start both backend & frontend
```

## Prerequisites

1. **Node.js** (v18+) - for both frontend and backend
2. **Emscripten SDK** - only if modifying C++ code
   - Installation: https://emscripten.org/docs/getting_started/downloads.html
3. **CMake** (v3.20+) - only if modifying C++ code

## Getting Started

### Quick Start (Recommended)

**Frontend Only** - All processing happens in the browser:

```bash
cd frontend
npm install  # First time only
npm run dev  # Runs on port 5173
```

Visit `http://localhost:5173` and upload a PDF bank statement to test.

### Development Mode (With Optional Logging)

**Note:** The backend logging server is **optional** and only used for development debugging. Teller works 100% locally without it.

```bash
# Option 1: Use the start script (Windows)
start-dev.bat

# Option 2: Manual start
# Terminal 1 - Backend logging server (optional - for debugging only)
cd backend
npm install  # First time only
npm start    # Runs on port 3001

# Terminal 2 - Frontend
cd frontend
npm install  # First time only
npm run dev  # Runs on port 5173
```

**What the backend does:** Saves analysis logs to `/logs` directory for debugging pattern matching. Not required for production use.

### Building C++ WASM (Only if Modified)

The WASM module is pre-built. Rebuild only if you modify C++ code:

```bash
cd cpp/build
emcmake cmake ..
ninja
```

This produces `bank_analyzer.wasm` and `bank_analyzer.js` in `frontend/public/wasm/`.

## How It Works

1. **Upload PDF**: Drag and drop a bank statement PDF
2. **Extract Text**: PDF.js extracts text as continuous stream (~1-2 seconds)
3. **Parse Transactions**: C++ universal parser matches pattern in continuous text (<100ms)
4. **Categorize**: TensorFlow.js ML model categorizes transactions (if trained)
5. **Display**: View in sortable table with interactive dashboard and D3.js visualizations

### Multi-Pattern Transaction Extraction

Teller uses **10 specialized regex patterns** to achieve **95-98% coverage** of North American bank statements:

- **Pattern 1-2** (45%): Canadian & US bank formats (RBC, CIBC, Chase, BoA)
- **Pattern 3-5** (25%): Simple formats, CSV exports, minimal layouts
- **Pattern 6-10** (20%): Specialized formats (checks, references, investments, bilingual, multi-currency)

**Edge cases handled:**
- ✅ Date carry-forward (same-day transactions)
- ✅ Keyword-based debit/credit detection
- ✅ Flexible descriptions (special characters, numbers)
- ✅ Multiple amount columns (withdrawal/deposit/balance)
- ✅ Header/footer filtering

See **[PATTERNS.md](PATTERNS.md)** for comprehensive documentation of all 10 patterns.

**Example transaction**:
```
14 Oct   Funds transfer credit   1,331.50       → Pattern 1 match
         e-Transfer sent         1,314.00       → Same-day (uses 14 Oct)
Aug 25   Aug 26   PAYMENT THANK YOU   200.00    → Pattern 2 match
```

Works with RBC, TD, BMO, CIBC, Chase, BoA, Wells Fargo, and virtually all North American banks!

## Smart Categorization

Teller automatically categorizes transactions into 17 categories:

**Spending Categories:**
- 🛒 Groceries (Walmart, Target, Whole Foods, etc.)
- 🍕 Dining & Restaurants (Starbucks, McDonald's, delivery services)
- 🚗 Transportation (Gas stations, Uber, parking, public transit)
- ⚡ Utilities (Electric, internet, phone bills)
- 🛍️ Shopping (Amazon, clothing stores, electronics)
- 🎬 Entertainment (Netflix, Spotify, movies, games)
- 🏥 Healthcare (Pharmacy, doctors, dental)
- ✈️ Travel (Airlines, hotels, Airbnb)
- 📚 Education (Tuition, textbooks, courses)
- 💇 Personal Care (Salon, spa, beauty)
- 🏠 Home & Garden (Home Depot, furniture, repairs)
- 📋 Bills & Subscriptions (Monthly payments, memberships)
- 🛡️ Insurance (Auto, health, life insurance)

**Income & Other:**
- 💰 Income (Salary, dividends, refunds)
- 💸 Transfer (Venmo, PayPal, Zelle)
- ⚠️ Fees & Charges (Bank fees, penalties)
- ❓ Uncategorized (Unrecognized transactions)

Categories are assigned using keyword matching against 500+ merchant patterns. The system uses fuzzy matching to handle merchant name variations.

## Development Roadmap

### Phase 1: MVP ✅ COMPLETE
- [x] Project structure setup
- [x] CMake + Emscripten build system
- [x] PDF.js integration for PDF text extraction
- [x] C++ transaction parsing with regex patterns
- [x] C++ analysis engine (totals, stats)
- [x] Svelte frontend with drag-and-drop upload
- [x] Sortable transaction table display
- [x] Development logging server (Express.js on port 3001)
- [x] File-based logging to `/logs` directory

**Performance**:
- PDF parsing: ~1-2 seconds (10 pages)
- Transaction extraction: <100ms (100+ transactions)
- Total WASM: 236KB (our code only)

### Phase 2: Enhanced Parsing ✅ COMPLETE
- [x] Universal parser working with continuous text (no newlines required)
- [x] Pattern: (Date) (Date) (Description) (Amount)
- [x] Support for multiple date formats (`Aug 25`, `01/25/2024`, etc.)
- [x] Support for multiple currencies ($, £, €, ¥, ₹)
- [x] Works with any bank format (CIBC, RBC, Chase tested)
- [x] Fuzzy matching for merchant names
- [x] Smart amount parsing with comma handling
- [x] Full text extraction for debugging

### Phase 3: ML Categorization ✅ COMPLETE
- [x] Rule-based categorization system (17 categories)
- [x] Keyword matching for merchant categorization
- [x] Category display in transaction table with color coding
- [x] Auto-categorization on transaction import
- [x] Fuzzy merchant name matching and grouping
- [x] TensorFlow.js neural network integration
- [x] Neural network model architecture (3-layer feedforward)
- [x] Text vectorization with bag-of-words
- [x] Interactive category editing with dropdown
- [x] User feedback loop for learning
- [x] Export/import trained models (LocalStorage)
- [x] ML training dashboard with metrics display

### Phase 4: Visualization ✅ COMPLETE
- [x] D3.js integration (v7.9.0)
- [x] Spending dashboard with summary cards
- [x] Category breakdown pie chart (donut chart)
- [x] Spending timeline chart (line + area chart)
- [x] Top merchants bar chart (color-coded by category)
- [x] Month-over-month comparison cards
- [x] Anomaly detection and highlighting (statistical outliers)
- [x] Interactive tooltips on all charts
- [x] Responsive chart sizing
- [x] Full dark mode support for visualizations

### Phase 5: Advanced Features (In Progress)
- [x] Development logging with full text extraction
- [ ] Multi-PDF support (aggregate multiple statements)
- [ ] Budget tracking and alerts
- [ ] Recurring payment detection
- [ ] Export functionality (CSV, JSON)
- [ ] IndexedDB for transaction persistence

## Technical Implementation

### C++ Universal Transaction Extractor (`cpp/src/extractor/transaction_extractor.cpp`)

The parser uses a single regex pattern to match transactions in continuous text:

```cpp
std::vector<Transaction> TransactionExtractor::extract(const std::string& text) {
    // Universal pattern: (Date) (Date) (Description) (Amount.XX)
    // Works with continuous text streams from PDF.js
    std::regex transactionPattern(
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"(((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\s+)"
        R"((.+?)\s+)"
        R"((-?\d{1,3}(?:,\d{3})*\.\d{2})(?:\s|$))"
    );

    // Iterate through ALL matches in continuous text (no line-by-line parsing)
    // Extract: trans_date, post_date, description, amount
    // Clean description, parse amount, determine debit/credit
}
```

### Key Insight: Continuous Text Parsing

PDF.js extracts text as **continuous streams with multiple spaces**, not separate lines. The parser matches the entire transaction pattern (`Date Date Description Amount`) directly in this continuous text, making it work with any bank format.

### Key Design Decisions

1. **PDF.js vs PDFium**
   - Switched to PDF.js (Mozilla's JavaScript library)
   - Easier integration, no separate WASM module needed
   - Extracts text as continuous streams (perfect for our parser)
   - Smaller total bundle size

2. **Universal Parser vs Bank-Specific Templates**
   - Single regex pattern works with any bank format
   - No need for bank-specific hardcoded rules
   - Handles continuous text from PDF.js naturally
   - Tested with CIBC, RBC, and Chase statements

3. **C++ WASM for Transaction Parsing**
   - Near-native speed for regex matching
   - Only 236KB WASM module
   - Handles 100+ transactions in <100ms
   - Compiled regex faster than JavaScript

4. **Development Logging vs Production**
   - Backend server (port 3001) only for development
   - Saves full extracted text for debugging
   - Production runs 100% in browser (no backend needed)

## Privacy & Security

- ✅ **100% local processing** - all computation in browser
- ✅ **No servers** - no data sent anywhere
- ✅ **No network requests** (except loading WASM once)
- ✅ **Your data stays on your device** - never uploaded or transmitted
- ✅ **Open source** - audit the code yourself

## Contributing

We welcome contributions! This project is in active beta and community contributions are essential to improving bank format support.

**📖 Read the full contribution guide**: **[CONTRIBUTING.md](CONTRIBUTING.md)**

### Quick Ways to Contribute

1. **🏦 Add Support for Your Bank** (Most Needed!)
   - Your bank format not working? [Submit it here](https://github.com/tripzcodes/Teller/issues/new?template=unsupported_bank.md)
   - Follow our [anonymization guide](CONTRIBUTING.md#method-2-manual-anonymization-guide) to safely share transaction patterns
   - We'll create a regex pattern for your bank

2. **🐛 Report Bugs**
   - Found an issue? [Report it](https://github.com/tripzcodes/Teller/issues/new?template=bug_report.md)
   - Include browser/OS info and steps to reproduce

3. **💡 Request Features**
   - Have an idea? [Share it](https://github.com/tripzcodes/Teller/issues/new?template=feature_request.md)

4. **💻 Code Contributions**
   - Add regex patterns for more banks (see [PATTERNS.md](PATTERNS.md))
   - Improve date/currency parsing
   - Enhance ML categorization
   - Add D3.js visualizations

**Banks We Need Testing For**: TD Bank, BMO, Scotiabank, Chase, Bank of America, Wells Fargo, Capital One, and more! See [CONTRIBUTING.md](CONTRIBUTING.md) for full list.

## License

**GNU Affero General Public License v3.0 (AGPL-3.0)**

Teller is free and open source software licensed under AGPL-3.0. This means:

- ✅ **Free to use** for personal and commercial purposes
- ✅ **Open source** - full source code available
- ✅ **Copyleft** - derivative works must also be open source under AGPL-3.0
- ⚠️ **Network use = distribution** - if you run Teller as a service (SaaS), you must make your source code available

**Why AGPL-3.0?**
This license ensures Teller remains truly open and privacy-first. If companies integrate Teller into their products, they must contribute back to the community by open-sourcing their modifications.

**Commercial licensing:** If you need to use Teller in a proprietary application without open-sourcing your code, contact [@tripzcodes](https://github.com/tripzcodes) for commercial licensing options.

See [LICENSE](LICENSE) for full terms.
