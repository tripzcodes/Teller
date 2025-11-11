const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logs directory
const LOGS_DIR = path.join(__dirname, '..', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// POST endpoint to save logs
app.post('/api/log', (req, res) => {
  try {
    const logEntry = req.body;

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = logEntry.fileName ?
      logEntry.fileName.replace('.pdf', '').replace(/[^a-zA-Z0-9]/g, '_') :
      'unknown';
    const logFileName = `analysis-${fileName}-${timestamp}.json`;
    const logPath = path.join(LOGS_DIR, logFileName);

    // Write log to file
    fs.writeFileSync(logPath, JSON.stringify(logEntry, null, 2));

    // Also save full extracted text to separate file for debugging
    if (logEntry.fullText) {
      const fullTextFileName = logFileName.replace('.json', '_fulltext.txt');
      const fullTextPath = path.join(LOGS_DIR, fullTextFileName);
      fs.writeFileSync(fullTextPath, logEntry.fullText);
      console.log(`✓ Full text saved: ${fullTextFileName}`);
    }

    console.log(`✓ Log saved: ${logFileName}`);
    res.json({ success: true, file: logFileName });
  } catch (error) {
    console.error('Failed to save log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET endpoint to retrieve all logs
app.get('/api/logs', (req, res) => {
  try {
    const files = fs.readdirSync(LOGS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const content = fs.readFileSync(path.join(LOGS_DIR, f), 'utf-8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(files);
  } catch (error) {
    console.error('Failed to read logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', logsDir: LOGS_DIR });
});

app.listen(PORT, () => {
  console.log(`🚀 Teller logging server running on http://localhost:${PORT}`);
  console.log(`📁 Logs directory: ${LOGS_DIR}`);
});
