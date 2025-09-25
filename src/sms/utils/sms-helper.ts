import {useSmsUserConsent} from '@eabdullazyanov/react-native-sms-user-consent';

/**
 * SMS Helper utility for expense tracking using SMS User Consent API
 * This is the modern, privacy-compliant way to handle SMS on Android
 *
 * Note: The SMS User Consent API uses React hooks and must be used within React components.
 * This helper provides utility functions for SMS content processing.
 */
export class SMSHelper {
  /**
   * Note: This library uses React hooks and should be used within React components
   * The useSmsUserConsent hook provides: { requestSms, startListener, stopListener }
   *
   * This helper class provides utility functions for SMS processing
   * For actual SMS consent functionality, use the useSmsUserConsent hook in your components
   */

  /**
   * Get SMS User Consent hook reference
   * Use this in React components to access SMS functionality
   */
  static getSmsUserConsentHook() {
    return useSmsUserConsent;
  }

  /**
   * Check if SMS contains expense-related keywords
   */
  static isExpenseRelatedSMS(smsContent: string): boolean {
    const expenseKeywords = [
      'debited',
      'credited',
      'transaction',
      'payment',
      'purchase',
      'withdrawal',
      'deposit',
      'transfer',
      'balance',
      'account',
      'bank',
      'atm',
      'pos',
      'upi',
      'imps',
      'neft',
      'rtgs',
    ];

    const lowerContent = smsContent.toLowerCase();
    return expenseKeywords.some(keyword => lowerContent.includes(keyword));
  }

  /**
   * Extract amount from SMS content
   */
  static extractAmount(smsContent: string): number | null {
    // Common patterns for amount extraction
    const amountPatterns = [
      /(?:rs\.?|inr|₹)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rs\.?|inr|₹)/i,
      /amount\s*:?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    ];

    for (const pattern of amountPatterns) {
      const match = smsContent.match(pattern);
      if (match) {
        const amountStr = match[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount)) {
          return amount;
        }
      }
    }

    return null;
  }

  /**
   * Extract transaction type (debit/credit)
   */
  static extractTransactionType(
    smsContent: string,
  ): 'debit' | 'credit' | 'unknown' {
    const lowerContent = smsContent.toLowerCase();

    if (
      lowerContent.includes('debited') ||
      lowerContent.includes('withdrawn') ||
      lowerContent.includes('purchase') ||
      lowerContent.includes('payment')
    ) {
      return 'debit';
    }

    if (
      lowerContent.includes('credited') ||
      lowerContent.includes('deposit') ||
      lowerContent.includes('received')
    ) {
      return 'credit';
    }

    return 'unknown';
  }
}

// Bank sender patterns for filtering
export const BANK_SENDERS = [
  'HDFC',
  'ICICI',
  'SBI',
  'AXIS',
  'KOTAK',
  'PNB',
  'BOB',
  'CANARA',
  'UNION',
  'INDIAN',
  'CENTRAL',
  'SYNDICATE',
  'ALLAHABAD',
  'VIJAYA',
  'PAYTM',
  'PHONEPE',
  'GPAY',
  'AMAZONPAY',
  'MOBIKWIK',
] as const;
