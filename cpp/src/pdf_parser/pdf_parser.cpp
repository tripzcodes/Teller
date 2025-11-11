#include "pdf_parser.h"
#include <stdexcept>

namespace BankAnalyzer {

// NOTE: This PDF parser is not used in production.
// PDF parsing is handled by PDF.js in the browser frontend.
// This file is kept for reference but is not compiled into the WASM module.

PDFParser::PDFParser() {
    // Not used - PDF.js handles parsing
}

PDFParser::~PDFParser() {
    // Not used - PDF.js handles parsing
}

std::string PDFParser::extractText(const uint8_t* pdfData, size_t dataSize) {
    // Not implemented - PDF.js handles text extraction in the frontend
    return "PDF parsing not implemented in C++. Data size: " + std::to_string(dataSize);
}

} // namespace BankAnalyzer
