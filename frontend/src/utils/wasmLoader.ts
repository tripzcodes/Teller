/**
 * WASM Module Loader
 * Loads PDF.js (for PDF parsing) and our custom Bank Analyzer module (for transaction extraction/analysis)
 */
import * as pdfjsLib from 'pdfjs-dist';

// Our C++ WASM module for transaction extraction and analysis
let analyzerModule: any = null;
let analyzerLoading = false;
let analyzerPromise: Promise<any> | null = null;

// PDF.js initialization
let pdfjsInitialized = false;

/**
 * Dynamically load a script and return the global variable it creates
 */
function loadScript(src: string, globalName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any)[globalName]) {
      resolve((window as any)[globalName]);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      // Give it a moment for the module to initialize
      setTimeout(() => {
        if ((window as any)[globalName]) {
          resolve((window as any)[globalName]);
        } else {
          reject(new Error(`${globalName} not found after loading ${src}`));
        }
      }, 50);
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Load the Bank Analyzer WASM module (C++ transaction extraction/analysis)
 */
export async function loadAnalyzerModule(): Promise<any> {
  if (analyzerModule) return analyzerModule;
  if (analyzerLoading && analyzerPromise) return analyzerPromise;

  analyzerLoading = true;
  analyzerPromise = new Promise(async (resolve, reject) => {
    try {
      // Load the Emscripten-generated JS file
      // The global name is BankAnalyzerModule, not Module
      const ModuleFactory = await loadScript('/wasm/bank_analyzer.js', 'BankAnalyzerModule');

      // Initialize the WASM module
      analyzerModule = await ModuleFactory({
        locateFile: (file: string) => `/wasm/${file}`
      });

      console.log('Bank Analyzer WASM module loaded');
      analyzerLoading = false;
      resolve(analyzerModule);
    } catch (error) {
      console.error('Failed to load analyzer module:', error);
      analyzerLoading = false;
      reject(error);
    }
  });

  return analyzerPromise;
}

/**
 * Initialize PDF.js worker
 */
function initPDFjs() {
  if (pdfjsInitialized) return;

  // Set up PDF.js worker using local file from node_modules
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  pdfjsInitialized = true;
  console.log('PDF.js initialized');
}

/**
 * Parse a PDF file and extract text using PDF.js
 */
export async function parsePDF(pdfData: Uint8Array): Promise<string> {
  initPDFjs();

  try {
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error}`);
  }
}

/**
 * Extract transactions from text using our C++ module
 */
export async function extractTransactions(text: string): Promise<any[]> {
  const module = await loadAnalyzerModule();
  return module.extractTransactions(text);
}

/**
 * Analyze transactions using our C++ module
 */
export async function analyzeTransactions(transactions: any[]): Promise<any> {
  const module = await loadAnalyzerModule();
  return module.analyzeTransactions(transactions);
}

export function isWasmLoaded(): boolean {
  return analyzerModule !== null;
}
