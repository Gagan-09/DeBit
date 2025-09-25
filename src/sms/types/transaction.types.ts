import {SMSMessage} from './sms.types';

/**
 * Transaction data extracted from SMS
 */
export interface TransactionData {
  amount: number;
  merchant: string;
  date: Date;
  accountInfo: string;
  transactionType: 'debit' | 'credit';
  originalSMS: SMSMessage;
}

/**
 * Transaction extractor interface
 */
export interface TransactionExtractor {
  extractTransaction(sms: SMSMessage): TransactionData | null;
}

/**
 * Extraction pattern configuration for different SMS formats
 */
export interface ExtractionPattern {
  name: string;
  amountRegex: RegExp;
  merchantRegex: RegExp;
  dateRegex: RegExp;
  accountRegex: RegExp;
}
