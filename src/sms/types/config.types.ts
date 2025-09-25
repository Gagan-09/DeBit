import {BankSenderConfig} from './sms.types';
import {ExtractionPattern} from './transaction.types';

/**
 * SMS tracking configuration
 */
export interface SMSTrackingConfig {
  isEnabled: boolean;
  customBankSenders: BankSenderConfig[];
  customExpenseKeywords: string[];
  notificationsEnabled: boolean;
  duplicateDetectionWindow: number; // hours
}

/**
 * Default bank senders configuration
 */
export interface DefaultBankSenders {
  [bankName: string]: {
    patterns: string[];
    extractionRules: ExtractionPattern[];
  };
}

/**
 * Retry configuration for error handling
 */
export interface RetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
}
