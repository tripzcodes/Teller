#pragma once
#include <string>
#include <vector>

namespace BankAnalyzer {

/**
 * NOTE: This PDF parser is not used in production.
 * PDF parsing is handled by PDF.js in the browser frontend.
 * This class is kept for reference but is not compiled into the WASM module.
 */
class PDFParser {
public:
    PDFParser();
    ~PDFParser();

    /**
     * Parse a PDF file and extract text content
     * @param pdfData Raw PDF file data
     * @param dataSize Size of the PDF data in bytes
     * @return Extracted text content
     */
    std::string extractText(const uint8_t* pdfData, size_t dataSize);

private:
    // Not used - PDF.js handles PDF parsing in the frontend
};

} // namespace BankAnalyzer
