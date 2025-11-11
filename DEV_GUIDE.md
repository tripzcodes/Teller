# Development Guide

## Quick Start

### Prerequisites Checklist
- [x] Node.js v18+ installed
- [x] Emscripten SDK 4.0.19 installed at `C:\Users\tripz\Desktop\emsdk`
- [x] PDFium WASM pre-built binaries in `third_party/pdfium/`

### Development Workflow

#### 1. First Time Setup

```bash
# Install frontend dependencies
cd frontend
npm install
```

Emscripten and PDFium are already set up! The WASM modules are ready to use.

#### 2. Run the Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

#### 3. Build C++ → WASM (only if you modify C++ code)

```bash
cd cpp/build
python /c/Users/tripz/Desktop/emsdk/upstream/emscripten/emcmake.py cmake ..
python /c/Users/tripz/Desktop/emsdk/upstream/emscripten/emmake.py ninja
```

The WASM files are automatically output to `frontend/public/wasm/bank_analyzer.{wasm,js}`.

### Project Architecture

```
PDF Upload (User)
     ↓
FileUpload.svelte (frontend/src/lib/)
     ↓
wasmLoader.ts loads TWO WASM modules:
     ├─► PDFium WASM (pdfium.wasm - 3.9MB)
     │        ↓
     │   Extracts text from PDF
     │        ↓
     └─► Bank Analyzer WASM (bank_analyzer.wasm - 236KB)
              ↓
         TransactionExtractor (C++ regex)
              ↓
         Analyzer (C++ statistics)
              ↓
     Results returned to JavaScript
              ↓
     transactionStore.ts (Svelte store)
              ↓
     TransactionTable.svelte displays data
```

## Current Architecture (Dual WASM)

### Why Two WASM Modules?

1. **PDFium WASM** (pre-built, 3.9MB)
   - Chrome's production-grade PDF library
   - Handles all PDF text extraction
   - Pre-built binaries (no need to compile)
   - Can be upgraded independently

2. **Bank Analyzer WASM** (our C++ code, 236KB)
   - Transaction extraction (regex patterns)
   - Statistical analysis
   - Lightweight and fast
   - Full control over the code

### File Locations

**C++ Source:**
- `cpp/src/extractor/transaction_extractor.cpp` - Regex-based transaction parsing
- `cpp/src/analyzer/analyzer.cpp` - Statistical analysis (totals, trends)
- `cpp/src/bindings/main.cpp` - Emscripten JavaScript bindings

**WASM Output:**
- `frontend/public/wasm/pdfium.wasm` (3.9MB) - PDF parsing
- `frontend/public/wasm/pdfium.js` (260KB) - PDFium glue code
- `frontend/public/wasm/bank_analyzer.wasm` (236KB) - Our C++ code
- `frontend/public/wasm/bank_analyzer.js` (43KB) - Analyzer glue code

**Frontend:**
- `frontend/src/utils/wasmLoader.ts` - Loads both WASM modules
- `frontend/src/lib/FileUpload.svelte` - PDF upload component
- `frontend/src/lib/TransactionTable.svelte` - Transaction display
- `frontend/src/stores/transactionStore.ts` - State management

## Making Changes

### Adding a new C++ function:

1. **Write the C++ code** in the appropriate module (e.g., `cpp/src/analyzer/`)

2. **Expose it in bindings** (`cpp/src/bindings/main.cpp`):
   ```cpp
   EMSCRIPTEN_BINDINGS(bank_analyzer) {
     function("yourNewFunction", &yourNewFunction);
   }
   ```

3. **Rebuild WASM**:
   ```bash
   cd cpp/build
   python /c/Users/tripz/Desktop/emsdk/upstream/emscripten/emcmake.py cmake ..
   python /c/Users/tripz/Desktop/emsdk/upstream/emscripten/emmake.py ninja
   ```

4. **Call from TypeScript** (`frontend/src/utils/wasmLoader.ts`):
   ```typescript
   export async function yourNewFunction(params: any): Promise<any> {
     const module = await loadAnalyzerModule();
     return module.yourNewFunction(params);
   }
   ```

### Adding Transaction Extraction Patterns

Edit `cpp/src/extractor/transaction_extractor.cpp`:

```cpp
std::vector<std::regex> patterns = {
    // Add new pattern here
    std::regex(R"((YOUR_PATTERN_HERE))"),

    // Existing patterns...
    std::regex(R"((\d{1,2}/\d{1,2}/\d{4})\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})\s+\$?([\d,]+\.\d{2}))"),
};
```

Then rebuild the WASM module.

### Adding a new Svelte component:

1. Create component in `frontend/src/lib/`
2. Import and use in `App.svelte` or other components
3. No rebuild needed - Vite will hot-reload

## Testing

### Manual Testing
1. Run the frontend: `cd frontend && npm run dev`
2. Upload a sample PDF bank statement
3. Check browser console for any errors
4. Verify transactions are extracted and displayed

### Testing with Custom PDFs
- Create test PDFs in `test_data/` directory
- Try different bank statement formats
- Check regex pattern matching in C++ code

### Unit Testing (TODO - Future Enhancement)
- C++: Use Google Test or Catch2
- TypeScript: Use Vitest or Jest
- Svelte Components: Svelte Testing Library

## Debugging

### C++ / WASM Debugging

**Add console logs:**
```cpp
#include <emscripten.h>

// In your C++ function:
EM_ASM({ console.log('Debug message from C++'); });

// With variables:
EM_ASM({
    console.log('Transaction count:', $0);
}, transactions.size());
```

**Build with debug symbols:**
Edit `cpp/CMakeLists.txt` and add `-g` flag:
```cmake
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g")
```

**Use browser debugging:**
1. Open DevTools → Sources
2. Find WASM module in source tree
3. Set breakpoints (limited support)
4. Use console.log extensively

### Frontend Debugging
- Use browser DevTools console
- Install Svelte DevTools extension
- Check Network tab for WASM loading issues
- Use `console.log()` in TypeScript code

### Common Issues

**Issue**: "Module not found: /wasm/bank_analyzer.js"
- **Solution**: WASM module not built. Rebuild C++ code (see above)

**Issue**: "Failed to fetch pdfium.wasm"
- **Solution**: PDFium files not in `frontend/public/wasm/`. Copy from `third_party/pdfium/`

**Issue**: "No transactions found"
- **Solution**: PDF format doesn't match regex patterns. Add new patterns in `transaction_extractor.cpp`

**Issue**: TypeScript errors about WASM module
- **Solution**: This is expected. WASM types are dynamic. Already handled with `// @ts-ignore`.

## Performance Tips

### C++ Optimization

**Current settings** (in `cpp/CMakeLists.txt`):
- Using `-O2` optimization
- Emscripten `--bind` for C++/JS bridge

**For even better performance:**
```cmake
# Use -O3 for maximum optimization
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")

# Enable Link Time Optimization
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -flto")

# Optimize for size (if bundle size matters)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Os")
```

### Frontend Optimization
- WASM modules are loaded on-demand (already implemented)
- Use Web Workers for heavy operations (future enhancement)
- Consider streaming WASM compilation (future enhancement)

## Current Implementation Status

### ✅ Complete
- [x] PDF parsing with PDFium WASM
- [x] Transaction extraction with C++ regex
- [x] Statistical analysis (totals, mean, std dev)
- [x] Svelte UI with drag-and-drop
- [x] Sortable transaction table
- [x] Dual WASM architecture
- [x] 100% local processing

### 🚧 In Progress / Planned

#### Phase 2: Enhanced Parsing
- [ ] More bank-specific patterns (Chase, BoA, Wells Fargo, etc.)
- [ ] Template system for different banks
- [ ] Fuzzy matching for descriptions
- [ ] Multi-line transaction handling

#### Phase 3: ML Categorization
- [ ] Integrate ONNX Runtime or TensorFlow.js
- [ ] Train initial classification model
- [ ] User feedback loop for corrections
- [ ] Category suggestions

#### Phase 4: Visualization
- [ ] D3.js integration (library already installed)
- [ ] Spending trends chart
- [ ] Category breakdown pie chart
- [ ] Month-over-month comparison

#### Phase 5: Advanced Features
- [ ] Multi-PDF support
- [ ] Budget tracking
- [ ] Recurring payment detection
- [ ] Export to CSV/JSON
- [ ] IndexedDB persistence

## Code Style

### C++
- Use modern C++17 features
- Follow Google C++ Style Guide
- Use meaningful variable names
- Comment complex regex patterns
- Prefer `std::vector` over raw arrays
- Use `const` and references appropriately

Example:
```cpp
std::vector<Transaction> TransactionExtractor::extract(const std::string& text) {
    std::vector<Transaction> transactions;

    // Clear comment explaining the regex
    std::regex pattern(R"((\d{1,2}/\d{1,2}/\d{4})\s+(.+?)\s+(-?\$?[\d,]+\.\d{2}))");

    // Extract transactions...
    return transactions;
}
```

### TypeScript/Svelte
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use functional programming patterns
- Keep components small and focused
- Use Svelte stores for shared state

Example:
```typescript
export async function extractTransactions(text: string): Promise<Transaction[]> {
  const module = await loadAnalyzerModule();
  return module.extractTransactions(text);
}
```

## Resources

- [Emscripten Documentation](https://emscripten.org/docs/) - C++ to WASM compilation
- [Svelte Documentation](https://svelte.dev/docs) - Frontend framework
- [WebAssembly MDN](https://developer.mozilla.org/en-US/docs/WebAssembly) - WASM spec
- [CMake Documentation](https://cmake.org/documentation/) - Build system
- [PDFium Documentation](https://pdfium.googlesource.com/pdfium/) - PDF library

## Contributing

### Workflow
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly (manual testing for now)
4. Update documentation if needed
5. Create a pull request
6. Code review and merge

### Areas for Contribution
- **Regex patterns**: Add support for more banks
- **ML categorization**: Implement transaction classification
- **Visualizations**: Create D3.js charts
- **Performance**: Optimize C++ code
- **UI/UX**: Improve frontend design
- **Testing**: Add unit tests and integration tests

## Project Status

**Current Phase:** MVP Complete ✅

**What's Working:**
- Full PDF → Text → Transactions → Analysis pipeline
- Modern Svelte UI with drag-and-drop
- 100% local processing (privacy-first)
- Fast performance (PDF: ~1-2s, extraction: <100ms)

**Next Milestone:** Enhanced parsing with more bank formats

---

**Questions?** Check `README.md`, `QUICKSTART.md`, or `STATUS.md` for more details.
