import {SMSMessage} from './sms.types';
import {TransactionData} from './transaction.types';

/**
 * Expense interface with SMS metadata support
 */
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  source: 'manual' | 'sms';
  smsMetadata?: SMSMetadata;
}

/**
 * SMS metadata attached to expenses
 */
export interface SMSMetadata {
  originalSMS: SMSMessage;
  extractedData: TransactionData;
  isEdited: boolean;
}

/**
 * Expense manager interface for SMS-sourced expenses
 */
export interface ExpenseManager {
  createExpenseFromSMS(transaction: TransactionData): Promise<Expense>;
  isDuplicateTransaction(transaction: TransactionData): Promise<boolean>;
  getExpensesBySMSSource(): Promise<Expense[]>;
}
