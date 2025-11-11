// Transaction categorization using rule-based matching
// Can be enhanced with ML in the future

export interface CategoryRule {
  category: string;
  keywords: string[];
  patterns?: RegExp[];
}

export const CATEGORIES = {
  GROCERIES: 'Groceries',
  DINING: 'Dining & Restaurants',
  TRANSPORTATION: 'Transportation',
  UTILITIES: 'Utilities',
  SHOPPING: 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  HEALTHCARE: 'Healthcare',
  TRAVEL: 'Travel',
  INCOME: 'Income',
  TRANSFER: 'Transfer',
  BILLS: 'Bills & Subscriptions',
  EDUCATION: 'Education',
  PERSONAL: 'Personal Care',
  HOME: 'Home & Garden',
  INSURANCE: 'Insurance',
  FEES: 'Fees & Charges',
  UNCATEGORIZED: 'Uncategorized'
} as const;

// Rule-based categorization patterns
const CATEGORY_RULES: CategoryRule[] = [
  // Groceries
  {
    category: CATEGORIES.GROCERIES,
    keywords: [
      'walmart', 'target', 'costco', 'kroger', 'safeway', 'whole foods',
      'trader joe', 'aldi', 'publix', 'food lion', 'wegmans', 'heb',
      'sprouts', 'albertsons', 'giant', 'stop & shop', 'market', 'grocery',
      'supermarket', 'food mart', 'fresh market'
    ]
  },

  // Dining & Restaurants
  {
    category: CATEGORIES.DINING,
    keywords: [
      'restaurant', 'cafe', 'coffee', 'starbucks', 'dunkin', 'mcdonald',
      'burger king', 'wendy', 'taco bell', 'subway', 'chipotle', 'panera',
      'pizza', 'domino', 'papa john', 'kfc', 'chick-fil-a', 'popeyes',
      'five guys', 'shake shack', 'in-n-out', 'dining', 'food delivery',
      'doordash', 'uber eats', 'grubhub', 'postmates', 'bar & grill',
      'bistro', 'diner', 'eatery', 'bakery', 'deli'
    ]
  },

  // Transportation
  {
    category: CATEGORIES.TRANSPORTATION,
    keywords: [
      'shell', 'exxon', 'chevron', 'bp', 'mobil', 'texaco', 'gas station',
      'fuel', 'gasoline', 'parking', 'uber', 'lyft', 'taxi', 'metro',
      'transit', 'train', 'bus fare', 'subway', 'toll', 'car wash',
      'auto repair', 'mechanic', 'oil change', 'tire', 'dmv'
    ]
  },

  // Utilities
  {
    category: CATEGORIES.UTILITIES,
    keywords: [
      'electric', 'power', 'energy', 'water', 'gas company', 'utility',
      'internet', 'cable', 'phone', 'wireless', 'verizon', 'at&t',
      't-mobile', 'sprint', 'comcast', 'xfinity', 'spectrum', 'cox',
      'trash', 'waste management', 'recycling'
    ]
  },

  // Shopping
  {
    category: CATEGORIES.SHOPPING,
    keywords: [
      'amazon', 'ebay', 'etsy', 'best buy', 'apple store', 'microsoft',
      'department store', 'mall', 'outlet', 'retail', 'clothing',
      'fashion', 'shoes', 'nordstrom', 'macy', 'gap', 'old navy',
      'tj maxx', 'marshalls', 'ross', 'burlington', 'kohl', 'jcpenney',
      'sears', 'online shopping'
    ]
  },

  // Entertainment
  {
    category: CATEGORIES.ENTERTAINMENT,
    keywords: [
      'netflix', 'hulu', 'disney', 'spotify', 'apple music', 'youtube',
      'amazon prime', 'hbo', 'movie', 'theater', 'cinema', 'concert',
      'ticket', 'game', 'steam', 'playstation', 'xbox', 'nintendo',
      'entertainment', 'amusement', 'theme park', 'zoo', 'museum',
      'gym', 'fitness', 'sports'
    ]
  },

  // Healthcare
  {
    category: CATEGORIES.HEALTHCARE,
    keywords: [
      'pharmacy', 'cvs', 'walgreens', 'rite aid', 'medical', 'doctor',
      'hospital', 'clinic', 'urgent care', 'dental', 'dentist', 'vision',
      'optometry', 'health', 'prescription', 'rx', 'medicine', 'lab corp',
      'quest diagnostics'
    ]
  },

  // Travel
  {
    category: CATEGORIES.TRAVEL,
    keywords: [
      'airline', 'united', 'delta', 'american airlines', 'southwest',
      'jetblue', 'hotel', 'motel', 'marriott', 'hilton', 'hyatt',
      'holiday inn', 'airbnb', 'booking.com', 'expedia', 'travel',
      'vacation', 'rental car', 'hertz', 'enterprise', 'avis', 'budget'
    ]
  },

  // Income
  {
    category: CATEGORIES.INCOME,
    keywords: [
      'salary', 'payroll', 'direct deposit', 'wage', 'payment received',
      'dividend', 'interest', 'refund', 'reimbursement', 'paycheck',
      'income', 'deposit', 'transfer from'
    ]
  },

  // Transfers
  {
    category: CATEGORIES.TRANSFER,
    keywords: [
      'transfer to', 'transfer from', 'venmo', 'paypal', 'zelle',
      'cash app', 'apple pay', 'google pay', 'atm withdrawal',
      'withdrawal', 'internal transfer', 'savings transfer'
    ]
  },

  // Bills & Subscriptions
  {
    category: CATEGORIES.BILLS,
    keywords: [
      'subscription', 'monthly payment', 'autopay', 'bill pay',
      'insurance payment', 'loan payment', 'mortgage', 'rent',
      'lease', 'hoa', 'condo fee', 'membership', 'dues'
    ]
  },

  // Education
  {
    category: CATEGORIES.EDUCATION,
    keywords: [
      'school', 'university', 'college', 'tuition', 'student',
      'textbook', 'education', 'learning', 'course', 'class',
      'academy', 'institute', 'library', 'bookstore'
    ]
  },

  // Personal Care
  {
    category: CATEGORIES.PERSONAL,
    keywords: [
      'salon', 'spa', 'barber', 'haircut', 'nail', 'beauty',
      'cosmetic', 'skincare', 'massage', 'personal care'
    ]
  },

  // Home & Garden
  {
    category: CATEGORIES.HOME,
    keywords: [
      'home depot', 'lowes', 'menards', 'hardware', 'furniture',
      'ikea', 'bed bath', 'garden', 'nursery', 'plant', 'lawn',
      'home improvement', 'repair', 'contractor', 'plumber',
      'electrician', 'hvac'
    ]
  },

  // Insurance
  {
    category: CATEGORIES.INSURANCE,
    keywords: [
      'insurance', 'geico', 'state farm', 'allstate', 'progressive',
      'usaa', 'liberty mutual', 'nationwide', 'farmers insurance',
      'auto insurance', 'health insurance', 'life insurance'
    ]
  },

  // Fees & Charges
  {
    category: CATEGORIES.FEES,
    keywords: [
      'fee', 'charge', 'overdraft', 'late fee', 'annual fee',
      'service charge', 'maintenance fee', 'atm fee', 'penalty',
      'interest charge', 'finance charge'
    ]
  }
];

/**
 * Categorize a transaction based on its description
 * Uses rule-based keyword matching
 */
export function categorizeTransaction(description: string, type: string): string {
  const lowerDesc = description.toLowerCase();

  // Check for income-related keywords first (for credit transactions)
  if (type === 'credit') {
    const incomeRule = CATEGORY_RULES.find(rule => rule.category === CATEGORIES.INCOME);
    if (incomeRule && incomeRule.keywords.some(keyword => lowerDesc.includes(keyword))) {
      return CATEGORIES.INCOME;
    }
  }

  // Check all other rules
  for (const rule of CATEGORY_RULES) {
    // Skip income category for debit transactions (already checked above)
    if (rule.category === CATEGORIES.INCOME) continue;

    // Check keywords
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }

    // Check regex patterns if defined
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(lowerDesc)) {
          return rule.category;
        }
      }
    }
  }

  return CATEGORIES.UNCATEGORIZED;
}

/**
 * Get category color for UI display
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    [CATEGORIES.GROCERIES]: '#10b981',      // green
    [CATEGORIES.DINING]: '#f59e0b',         // amber
    [CATEGORIES.TRANSPORTATION]: '#3b82f6', // blue
    [CATEGORIES.UTILITIES]: '#8b5cf6',      // purple
    [CATEGORIES.SHOPPING]: '#ec4899',       // pink
    [CATEGORIES.ENTERTAINMENT]: '#f97316',  // orange
    [CATEGORIES.HEALTHCARE]: '#ef4444',     // red
    [CATEGORIES.TRAVEL]: '#06b6d4',         // cyan
    [CATEGORIES.INCOME]: '#22c55e',         // green
    [CATEGORIES.TRANSFER]: '#64748b',       // slate
    [CATEGORIES.BILLS]: '#a855f7',          // purple
    [CATEGORIES.EDUCATION]: '#0ea5e9',      // sky
    [CATEGORIES.PERSONAL]: '#d946ef',       // fuchsia
    [CATEGORIES.HOME]: '#84cc16',           // lime
    [CATEGORIES.INSURANCE]: '#6366f1',      // indigo
    [CATEGORIES.FEES]: '#dc2626',           // red
    [CATEGORIES.UNCATEGORIZED]: '#9ca3af'   // gray
  };

  return colors[category] || colors[CATEGORIES.UNCATEGORIZED];
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  return Object.values(CATEGORIES);
}
