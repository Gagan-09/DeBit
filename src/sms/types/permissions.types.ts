/**
 * Permission status enum
 */
export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  NEVER_ASK_AGAIN = 'never_ask_again',
}

/**
 * Permission manager interface for SMS permissions
 */
export interface PermissionManager {
  requestSMSPermissions(): Promise<PermissionStatus>;
  checkSMSPermissions(): Promise<PermissionStatus>;
  onPermissionChanged(callback: (status: PermissionStatus) => void): void;
}
