# Teller - Frontend

Svelte + TypeScript frontend for Teller, the privacy-first bank statement analyzer.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Stack

- **Framework**: Svelte 5
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: CSS (custom, no framework)
- **Data Viz**: D3.js (installed, not yet used)

## Project Structure

```
frontend/
├── src/
│   ├── lib/                    # Svelte components
│   │   ├── FileUpload.svelte   # PDF upload with drag-and-drop
│   │   └── TransactionTable.svelte  # Sortable transaction table
│   ├── stores/                 # Svelte stores (state management)
│   │   └── transactionStore.ts
│   ├── utils/                  # Utilities
│   │   └── wasmLoader.ts       # WASM module loader
│   ├── App.svelte             # Main app component
│   └── main.ts                # Entry point
├── public/
│   └── wasm/                  # WebAssembly modules (4.1MB total)
│       ├── pdfium.wasm        # 3.9MB - PDF parsing
│       ├── pdfium.js          # 260KB - PDFium glue code
│       ├── bank_analyzer.wasm # 236KB - C++ transaction extraction
│       └── bank_analyzer.js   # 43KB - Analyzer glue code
└── package.json
```

## Key Files

### `src/utils/wasmLoader.ts`
Manages loading and communication with the dual WASM architecture:
- **PDFium WASM**: Extracts text from PDF files
- **Bank Analyzer WASM**: Parses transactions using C++ regex

```typescript
// Load both WASM modules
await loadPDFiumModule();
await loadAnalyzerModule();

// Parse PDF
const text = await parsePDF(pdfData);

// Extract transactions
const transactions = await extractTransactions(text);

// Analyze transactions
const analysis = await analyzeTransactions(transactions);
```

### `src/lib/FileUpload.svelte`
Handles PDF file uploads:
- Drag-and-drop interface
- File validation (PDF only)
- Passes data to WASM loader
- Updates transaction store

### `src/lib/TransactionTable.svelte`
Displays transactions:
- Sortable columns (date, description, amount, balance)
- Clean, minimal design
- Type indicators (debit/credit)

### `src/stores/transactionStore.ts`
Svelte writable store for transaction data:
```typescript
export const transactions = writable<Transaction[]>([]);
export const analysis = writable<Analysis | null>(null);
```

## Development

### Running Dev Server

```bash
npm run dev
```

Hot module reloading is enabled. Changes to `.svelte` or `.ts` files will auto-reload.

### Building for Production

```bash
npm run build
```

Output goes to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Component Communication

```
User uploads PDF
     ↓
FileUpload.svelte
     ↓
wasmLoader.parsePDF() → PDFium WASM
     ↓
wasmLoader.extractTransactions() → Bank Analyzer WASM
     ↓
Update transactionStore
     ↓
TransactionTable.svelte (reactive to store changes)
```

## Styling

Custom CSS with:
- CSS Grid for layouts
- Modern colors and typography
- Minimal, clean design
- No CSS framework (keeping it lightweight)

## Type Safety

TypeScript strict mode is enabled:
- All props typed
- WASM module types handled with `// @ts-ignore` where needed (dynamic WASM loading)
- Interface definitions for transactions, analysis results

## Future Enhancements

### Phase 2
- [ ] Loading states and error handling UI
- [ ] Transaction filtering and search
- [ ] Category badges

### Phase 3
- [ ] Category selector for ML feedback
- [ ] User preference settings

### Phase 4
- [ ] D3.js charts and visualizations
- [ ] Spending trends graphs
- [ ] Category breakdowns

### Phase 5
- [ ] Multi-PDF management UI
- [ ] Budget tracking dashboard
- [ ] Export functionality

## IDE Setup

**Recommended**: [VS Code](https://code.visualstudio.com/) with:
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [TypeScript + JavaScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

## Debugging

### Browser DevTools
- Console for JavaScript errors
- Network tab for WASM loading issues
- Sources tab for setting breakpoints

### Svelte DevTools
Install the [Svelte DevTools](https://github.com/sveltejs/svelte-devtools) browser extension for component inspection.

## Performance

- **WASM loading**: On-demand (only when needed)
- **Bundle size**: Minimal (Svelte compiles to vanilla JS)
- **Total WASM**: 4.1MB (acceptable for modern browsers)
- **Cold start**: ~500ms to load both WASM modules

## Scripts

- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - TypeScript type checking

## Dependencies

### Production
- `svelte` - Frontend framework
- `d3` - Data visualization (future use)
- `@types/d3` - D3 TypeScript types

### Development
- `@sveltejs/vite-plugin-svelte` - Svelte + Vite integration
- `vite` - Build tool
- `typescript` - Type checking
- `svelte-check` - Svelte type checker

## Notes

- No backend server needed - everything runs in the browser
- WASM files are served as static assets from `public/wasm/`
- All data processing is local (privacy-first)
- No network requests except initial page/WASM load

---

For more information, see the main [README.md](../README.md) in the project root.
