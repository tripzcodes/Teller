/**
 * Logging utility for bank statement analysis
 * Saves logs to backend server's /logs directory
 */

export interface AnalysisLogEntry {
  timestamp: string;
  fileName: string;
  fileSize: number;
  textLength: number;
  transactionCount: number;
  categories: string[];
  dateRange: { start: string; end: string } | null;
  processingTime: number;
  success: boolean;
  error?: string;
  extractedText?: string; // Sample for JSON log
  fullText?: string; // Full text for separate file
}

const BACKEND_URL = 'http://localhost:3001';

/**
 * Save a new log entry to backend
 */
export async function saveLog(entry: AnalysisLogEntry): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`Failed to save log: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✓ Log saved to file: ${result.file}`);
  } catch (error) {
    console.error('Failed to save log to backend:', error);
    // Fail silently - don't break the app if logging fails
  }
}

/**
 * Get all logs from backend
 */
export async function getLogs(): Promise<AnalysisLogEntry[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/logs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load logs from backend:', error);
    return [];
  }
}
