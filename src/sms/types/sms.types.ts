/**
 * Core SMS message interface
 */
export interface SMSMessage {
  sender: string;
  body: string;
  timestamp: Date;
  id: string;
}

/**
 * SMS receiver interface for monitoring incoming messages
 */
export interface SMSReceiver {
  startMonitoring(): Promise<void>;
  stopMonitoring(): void;
  onSMSReceived(callback: (sms: SMSMessage) => void): void;
}

/**
 * SMS parser service interface for filtering and classifying messages
 */
export interface SMSParserService {
  isExpenseRelated(sms: SMSMessage): boolean;
  isBankSender(sender: string): boolean;
  containsExpenseKeywords(body: string): boolean;
}

/**
 * Bank sender configuration
 */
export interface BankSenderConfig {
  bankName: string;
  senderPatterns: string[];
  isActive: boolean;
}
