/**
 * Permission error types
 */
export interface PermissionError extends Error {
  type: 'permission_denied' | 'permission_revoked' | 'never_ask_again';
}

/**
 * Parsing error types
 */
export interface ParsingError extends Error {
  type:
    | 'regex_extraction_failed'
    | 'invalid_amount'
    | 'missing_required_fields';
  smsId: string;
}

/**
 * Database error types
 */
export interface DatabaseError extends Error {
  type: 'insert_failed' | 'duplicate_detection_failed' | 'connection_failed';
  operation: string;
}

/**
 * Error handler interface
 */
export interface ErrorHandler {
  handlePermissionError(error: PermissionError): void;
  handleParsingError(sms: any, error: ParsingError): void;
  handleDatabaseError(transaction: any, error: DatabaseError): void;
  retryFailedOperations(): Promise<void>;
}
