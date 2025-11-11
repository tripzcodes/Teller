// Bank-specific templates for transaction parsing
// This allows customization for different bank statement formats

export interface BankTemplate {
  id: string;
  name: string;
  country: string;
  dateFormats: string[];  // Preferred date formats for this bank
  currencySymbol: string;
  patterns: {
    transactionLine?: RegExp;  // Custom regex for this bank
    dateFormat?: string;       // Specific date format pattern
  };
  indicators?: string[];  // Text indicators to auto-detect this bank
}

export const BANK_TEMPLATES: BankTemplate[] = [
  // US Banks
  {
    id: 'chase',
    name: 'Chase Bank',
    country: 'USA',
    dateFormats: ['MM/DD/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['chase', 'jpmorgan chase']
  },
  {
    id: 'bank_of_america',
    name: 'Bank of America',
    country: 'USA',
    dateFormats: ['MM/DD/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['bank of america', 'boa']
  },
  {
    id: 'wells_fargo',
    name: 'Wells Fargo',
    country: 'USA',
    dateFormats: ['MM/DD/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['wells fargo']
  },
  {
    id: 'citi',
    name: 'Citibank',
    country: 'USA',
    dateFormats: ['MM/DD/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['citibank', 'citi']
  },
  {
    id: 'capital_one',
    name: 'Capital One',
    country: 'USA',
    dateFormats: ['MM/DD/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['capital one']
  },

  // UK Banks
  {
    id: 'hsbc_uk',
    name: 'HSBC UK',
    country: 'UK',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '£',
    patterns: {},
    indicators: ['hsbc']
  },
  {
    id: 'barclays',
    name: 'Barclays',
    country: 'UK',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '£',
    patterns: {},
    indicators: ['barclays']
  },
  {
    id: 'lloyds',
    name: 'Lloyds Bank',
    country: 'UK',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '£',
    patterns: {},
    indicators: ['lloyds']
  },
  {
    id: 'natwest',
    name: 'NatWest',
    country: 'UK',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '£',
    patterns: {},
    indicators: ['natwest', 'national westminster']
  },

  // European Banks
  {
    id: 'deutsche_bank',
    name: 'Deutsche Bank',
    country: 'Germany',
    dateFormats: ['DD.MM.YYYY'],
    currencySymbol: '€',
    patterns: {},
    indicators: ['deutsche bank']
  },
  {
    id: 'bnp_paribas',
    name: 'BNP Paribas',
    country: 'France',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '€',
    patterns: {},
    indicators: ['bnp paribas']
  },
  {
    id: 'ing',
    name: 'ING Bank',
    country: 'Netherlands',
    dateFormats: ['DD-MM-YYYY'],
    currencySymbol: '€',
    patterns: {},
    indicators: ['ing bank', 'ing']
  },

  // Canadian Banks
  {
    id: 'rbc',
    name: 'Royal Bank of Canada',
    country: 'Canada',
    dateFormats: ['YYYY-MM-DD'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['royal bank', 'rbc']
  },
  {
    id: 'td_canada',
    name: 'TD Canada Trust',
    country: 'Canada',
    dateFormats: ['YYYY-MM-DD'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['td canada', 'td trust']
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank',
    country: 'Canada',
    dateFormats: ['YYYY-MM-DD'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['scotiabank']
  },

  // Australian Banks
  {
    id: 'commonwealth',
    name: 'Commonwealth Bank',
    country: 'Australia',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['commonwealth bank', 'commbank']
  },
  {
    id: 'anz',
    name: 'ANZ Bank',
    country: 'Australia',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['anz bank', 'anz']
  },
  {
    id: 'nab',
    name: 'National Australia Bank',
    country: 'Australia',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['national australia', 'nab']
  },

  // Asian Banks
  {
    id: 'dbs',
    name: 'DBS Bank',
    country: 'Singapore',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['dbs bank', 'dbs']
  },
  {
    id: 'ocbc',
    name: 'OCBC Bank',
    country: 'Singapore',
    dateFormats: ['DD/MM/YYYY'],
    currencySymbol: '$',
    patterns: {},
    indicators: ['ocbc']
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    country: 'India',
    dateFormats: ['DD-MM-YYYY'],
    currencySymbol: '₹',
    patterns: {},
    indicators: ['icici']
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    country: 'India',
    dateFormats: ['DD-MM-YYYY'],
    currencySymbol: '₹',
    patterns: {},
    indicators: ['hdfc']
  }
];

/**
 * Auto-detect bank from PDF text
 * Looks for bank name indicators in the first few lines
 */
export function detectBank(pdfText: string): BankTemplate | null {
  const firstLines = pdfText.toLowerCase().split('\n').slice(0, 10).join(' ');

  for (const template of BANK_TEMPLATES) {
    if (template.indicators) {
      for (const indicator of template.indicators) {
        if (firstLines.includes(indicator.toLowerCase())) {
          return template;
        }
      }
    }
  }

  return null;
}

/**
 * Get bank template by ID
 */
export function getBankTemplate(id: string): BankTemplate | undefined {
  return BANK_TEMPLATES.find(t => t.id === id);
}

/**
 * Get all banks for a specific country
 */
export function getBanksByCountry(country: string): BankTemplate[] {
  return BANK_TEMPLATES.filter(t => t.country === country);
}

/**
 * Get unique list of countries
 */
export function getCountries(): string[] {
  const countries = BANK_TEMPLATES.map(t => t.country);
  return Array.from(new Set(countries)).sort();
}
