import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Secure storage utility for SMS expense tracking
 * Uses encrypted storage to protect sensitive financial data
 */
export class SecureStorage {
  /**
   * Store data securely
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  }

  /**
   * Retrieve data securely
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      throw error;
    }
  }

  /**
   * Remove data securely
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      throw error;
    }
  }

  /**
   * Clear all stored data
   */
  static async clear(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('SecureStorage clear error:', error);
      throw error;
    }
  }

  /**
   * Store object as JSON
   */
  static async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error('SecureStorage setObject error:', error);
      throw error;
    }
  }

  /**
   * Retrieve object from JSON
   */
  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('SecureStorage getObject error:', error);
      throw error;
    }
  }
}

// Storage keys for the SMS expense tracking feature
export const STORAGE_KEYS = {
  SMS_CONFIG: 'sms_config',
  PARSED_TRANSACTIONS: 'parsed_transactions',
  EXPENSE_CATEGORIES: 'expense_categories',
  USER_PREFERENCES: 'user_preferences',
  BANK_PATTERNS: 'bank_patterns',
} as const;