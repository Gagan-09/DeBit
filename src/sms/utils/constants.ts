/**
 * Default expense keywords for SMS classification
 */
export const DEFAULT_EXPENSE_KEYWORDS = [
  'debit',
  'debited',
  'spent',
  'purchase',
  'transaction',
  'payment',
  'charged',
  'withdrawn',
  'paid',
  'bill',
  'transfer',
  'atm',
  'pos',
  'online',
  'merchant',
];

/**
 * Default bank sender patterns
 */
export const DEFAULT_BANK_SENDERS = {
  'State Bank of India': {
    patterns: ['SBI', 'SBIATM', 'SBICARD'],
    extractionRules: [],
  },
  'HDFC Bank': {
    patterns: ['HDFC', 'HDFCBK', 'HDFCCARD'],
    extractionRules: [],
  },
  'ICICI Bank': {
    patterns: ['ICICI', 'ICICIB', 'ICICIC'],
    extractionRules: [],
  },
  'Axis Bank': {
    patterns: ['AXIS', 'AXISBK', 'AXISCARD'],
    extractionRules: [],
  },
  'Kotak Mahindra Bank': {
    patterns: ['KOTAK', 'KOTAKB', 'KOTAKC'],
    extractionRules: [],
  },
  'Punjab National Bank': {
    patterns: ['PNB', 'PNBSMS', 'PNBCARD'],
    extractionRules: [],
  },
  'Bank of Baroda': {
    patterns: ['BOB', 'BOBSMS', 'BOBCARD'],
    extractionRules: [],
  },
  'Canara Bank': {
    patterns: ['CANARA', 'CANARAB', 'CANARAC'],
    extractionRules: [],
  },
};

/**
 * SMS processing status constants
 */
export const SMS_PROCESSING_STATUS = {
  PROCESSED: 'processed',
  IGNORED: 'ignored',
  FAILED: 'failed',
} as const;

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelay: 1000, // 1 second
};

/**
 * Default SMS tracking configuration
 */
export const DEFAULT_SMS_CONFIG = {
  isEnabled: false,
  customBankSenders: [],
  customExpenseKeywords: [],
  notificationsEnabled: true,
  duplicateDetectionWindow: 24, // 24 hours
};

/**
 * Android permissions required for SMS access
 */
export const REQUIRED_PERMISSIONS = {
  READ_SMS: 'android.permission.READ_SMS',
  RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
} as const;

/**
 * Common regex patterns for transaction extraction
 */
export const COMMON_REGEX_PATTERNS = {
  // Amount patterns - matches various currency formats
  AMOUNT: /(?:rs\.?|inr|₹)\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  
  // Date patterns - matches various date formats
  DATE: /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{2,4}[-\/]\d{1,2}[-\/]\d{1,2})/,
  
  // Time patterns
  TIME: /(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)/i,
  
  // Account number patterns (last 4 digits)
  ACCOUNT: /(?:a\/c|account|card).*?(\d{4})/i,
  
  // Merchant/description patterns
  MERCHANT: /(?:at|to|from)\s+([a-zA-Z0-9\s&.-]+?)(?:\s+on|\s+at|\s*$)/i,
}; 

/**
 * Database table names
 */
export const DB_TABLES = {
  EXPENSES: 'expenses',
  SMS_METADATA: 'sms_metadata',
  BANK_SENDERS: 'bank_senders',
  SMS_PROCESSING_LOG: 'sms_processing_log',
} as const;