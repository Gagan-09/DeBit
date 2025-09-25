import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  openSettings,
} from 'react-native-permissions';
import {PermissionManager, PermissionStatus} from '../types';

/**
 * Implementation of PermissionManager for handling SMS permissions
 */
export class PermissionManagerImpl implements PermissionManager {
  private permissionCallbacks: Array<(status: PermissionStatus) => void> = [];
  private currentStatus: PermissionStatus = PermissionStatus.DENIED;

  constructor() {}

  /**
   * Request SMS permissions from the user
   */
  async requestSMSPermissions(): Promise<PermissionStatus> {
    if (Platform.OS !== 'android') {
      // iOS doesn't support programmatic SMS access
      return PermissionStatus.DENIED;
    }

    try {
      const result = await request(PERMISSIONS.ANDROID.READ_SMS);
      const status = this.mapNativeStatusToPermissionStatus(result);

      // Update current status and notify callbacks if changed
      if (status !== this.currentStatus) {
        this.currentStatus = status;
        this.notifyPermissionChanged(status);
      }

      return status;
    } catch (error) {
      console.error('Error requesting SMS permissions:', error);
      return PermissionStatus.DENIED;
    }
  }

  /**
   * Check current SMS permission status
   */
  async checkSMSPermissions(): Promise<PermissionStatus> {
    if (Platform.OS !== 'android') {
      // iOS doesn't support programmatic SMS access
      return PermissionStatus.DENIED;
    }

    try {
      const result = await check(PERMISSIONS.ANDROID.READ_SMS);
      const status = this.mapNativeStatusToPermissionStatus(result);

      // Update current status and notify callbacks if changed
      if (status !== this.currentStatus) {
        this.currentStatus = status;
        this.notifyPermissionChanged(status);
      }

      return status;
    } catch (error) {
      console.error('Error checking SMS permissions:', error);
      return PermissionStatus.DENIED;
    }
  }

  /**
   * Register callback for permission status changes
   */
  onPermissionChanged(callback: (status: PermissionStatus) => void): void {
    this.permissionCallbacks.push(callback);
  }

  /**
   * Remove permission change callback
   */
  removePermissionCallback(callback: (status: PermissionStatus) => void): void {
    const index = this.permissionCallbacks.indexOf(callback);
    if (index > -1) {
      this.permissionCallbacks.splice(index, 1);
    }
  }

  /**
   * Open device settings for manual permission management
   */
  async openPermissionSettings(): Promise<void> {
    try {
      await openSettings();
    } catch (error) {
      console.error('Error opening permission settings:', error);
    }
  }

  /**
   * Get current permission status without making a system call
   */
  getCurrentStatus(): PermissionStatus {
    return this.currentStatus;
  }

  /**
   * Check if SMS permissions are granted
   */
  isPermissionGranted(): boolean {
    return this.currentStatus === PermissionStatus.GRANTED;
  }

  /**
   * Map native permission result to our PermissionStatus enum
   */
  private mapNativeStatusToPermissionStatus(result: string): PermissionStatus {
    switch (result) {
      case RESULTS.GRANTED:
        return PermissionStatus.GRANTED;
      case RESULTS.DENIED:
        return PermissionStatus.DENIED;
      case RESULTS.BLOCKED:
        return PermissionStatus.NEVER_ASK_AGAIN;
      case RESULTS.UNAVAILABLE:
      case RESULTS.LIMITED:
      default:
        return PermissionStatus.DENIED;
    }
  }

  /**
   * Notify all registered callbacks about permission status change
   */
  private notifyPermissionChanged(status: PermissionStatus): void {
    this.permissionCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in permission callback:', error);
      }
    });
  }

  /**
   * Clean up all callbacks (useful for testing and cleanup)
   */
  cleanup(): void {
    this.permissionCallbacks = [];
  }
}
