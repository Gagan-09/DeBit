/**
 * @format
 */

// Import Jest globals first
import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      READ_SMS: 'android.permission.READ_SMS',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    UNAVAILABLE: 'unavailable',
    LIMITED: 'limited',
  },
  request: jest.fn(),
  check: jest.fn(),
  openSettings: jest.fn(),
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  openSettings,
} from 'react-native-permissions';
import {PermissionManagerImpl} from '../../src/sms/services/permission-manager.service';
import {PermissionStatus} from '../../src/sms/types';

describe('PermissionManagerImpl', () => {
  let permissionManager: PermissionManagerImpl;
  const mockRequest = request as jest.MockedFunction<typeof request>;
  const mockCheck = check as jest.MockedFunction<typeof check>;
  const mockOpenSettings = openSettings as jest.MockedFunction<
    typeof openSettings
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS to android for each test
    (Platform as any).OS = 'android';
    permissionManager = new PermissionManagerImpl();
  });

  afterEach(() => {
    permissionManager.cleanup();
  });

  describe('requestSMSPermissions', () => {
    it('should request SMS permissions on Android and return GRANTED status', async () => {
      mockRequest.mockResolvedValue(RESULTS.GRANTED);

      const result = await permissionManager.requestSMSPermissions();

      expect(mockRequest).toHaveBeenCalledWith(PERMISSIONS.ANDROID.READ_SMS);
      expect(result).toBe(PermissionStatus.GRANTED);
    });

    it('should return DENIED status when permission is denied', async () => {
      mockRequest.mockResolvedValue(RESULTS.DENIED);

      const result = await permissionManager.requestSMSPermissions();

      expect(result).toBe(PermissionStatus.DENIED);
    });

    it('should return NEVER_ASK_AGAIN status when permission is blocked', async () => {
      mockRequest.mockResolvedValue(RESULTS.BLOCKED);

      const result = await permissionManager.requestSMSPermissions();

      expect(result).toBe(PermissionStatus.NEVER_ASK_AGAIN);
    });

    it('should return NEVER_ASK_AGAIN status when permission is blocked (BLOCKED result)', async () => {
      mockRequest.mockResolvedValue(RESULTS.BLOCKED);

      const result = await permissionManager.requestSMSPermissions();

      expect(result).toBe(PermissionStatus.NEVER_ASK_AGAIN);
    });

    it('should return DENIED status for unavailable permissions', async () => {
      mockRequest.mockResolvedValue(RESULTS.UNAVAILABLE);

      const result = await permissionManager.requestSMSPermissions();

      expect(result).toBe(PermissionStatus.DENIED);
    });

    it('should return DENIED status on iOS', async () => {
      (Platform as any).OS = 'ios';
      permissionManager = new PermissionManagerImpl();

      const result = await permissionManager.requestSMSPermissions();

      expect(mockRequest).not.toHaveBeenCalled();
      expect(result).toBe(PermissionStatus.DENIED);
    });

    it('should handle request errors gracefully', async () => {
      mockRequest.mockRejectedValue(new Error('Permission request failed'));
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await permissionManager.requestSMSPermissions();

      expect(result).toBe(PermissionStatus.DENIED);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error requesting SMS permissions:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should notify callbacks when permission status changes', async () => {
      const callback = jest.fn();
      permissionManager.onPermissionChanged(callback);
      mockRequest.mockResolvedValue(RESULTS.GRANTED);

      await permissionManager.requestSMSPermissions();

      expect(callback).toHaveBeenCalledWith(PermissionStatus.GRANTED);
    });

    it('should not notify callbacks when permission status remains the same', async () => {
      const callback = jest.fn();
      mockCheck.mockResolvedValue(RESULTS.DENIED);

      // Initialize with DENIED status
      await permissionManager.checkSMSPermissions();
      callback.mockClear();

      permissionManager.onPermissionChanged(callback);
      mockRequest.mockResolvedValue(RESULTS.DENIED);

      await permissionManager.requestSMSPermissions();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('checkSMSPermissions', () => {
    it('should check SMS permissions on Android and return GRANTED status', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      const result = await permissionManager.checkSMSPermissions();

      expect(mockCheck).toHaveBeenCalledWith(PERMISSIONS.ANDROID.READ_SMS);
      expect(result).toBe(PermissionStatus.GRANTED);
    });

    it('should return DENIED status when permission is denied', async () => {
      mockCheck.mockResolvedValue(RESULTS.DENIED);

      const result = await permissionManager.checkSMSPermissions();

      expect(result).toBe(PermissionStatus.DENIED);
    });

    it('should return DENIED status on iOS', async () => {
      (Platform as any).OS = 'ios';
      permissionManager = new PermissionManagerImpl();

      const result = await permissionManager.checkSMSPermissions();

      expect(mockCheck).not.toHaveBeenCalled();
      expect(result).toBe(PermissionStatus.DENIED);
    });

    it('should handle check errors gracefully', async () => {
      mockCheck.mockRejectedValue(new Error('Permission check failed'));
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await permissionManager.checkSMSPermissions();

      expect(result).toBe(PermissionStatus.DENIED);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error checking SMS permissions:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should notify callbacks when permission status changes during check', async () => {
      const callback = jest.fn();
      permissionManager.onPermissionChanged(callback);
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      await permissionManager.checkSMSPermissions();

      expect(callback).toHaveBeenCalledWith(PermissionStatus.GRANTED);
    });
  });

  describe('onPermissionChanged', () => {
    it('should register permission change callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      permissionManager.onPermissionChanged(callback1);
      permissionManager.onPermissionChanged(callback2);

      // Trigger a permission change
      mockRequest.mockResolvedValue(RESULTS.GRANTED);
      return permissionManager.requestSMSPermissions().then(() => {
        expect(callback1).toHaveBeenCalledWith(PermissionStatus.GRANTED);
        expect(callback2).toHaveBeenCalledWith(PermissionStatus.GRANTED);
      });
    });

    it('should handle callback errors gracefully', async () => {
      const errorCallback = jest.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      const normalCallback = jest.fn();
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      permissionManager.onPermissionChanged(errorCallback);
      permissionManager.onPermissionChanged(normalCallback);
      mockRequest.mockResolvedValue(RESULTS.GRANTED);

      await permissionManager.requestSMSPermissions();

      expect(errorCallback).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalledWith(PermissionStatus.GRANTED);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in permission callback:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('removePermissionCallback', () => {
    it('should remove specific permission callbacks', async () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      permissionManager.onPermissionChanged(callback1);
      permissionManager.onPermissionChanged(callback2);
      permissionManager.removePermissionCallback(callback1);

      mockRequest.mockResolvedValue(RESULTS.GRANTED);
      await permissionManager.requestSMSPermissions();

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith(PermissionStatus.GRANTED);
    });

    it('should handle removal of non-existent callbacks gracefully', () => {
      const callback = jest.fn();

      expect(() => {
        permissionManager.removePermissionCallback(callback);
      }).not.toThrow();
    });
  });

  describe('openPermissionSettings', () => {
    it('should open device permission settings', async () => {
      mockOpenSettings.mockResolvedValue();

      await permissionManager.openPermissionSettings();

      expect(mockOpenSettings).toHaveBeenCalled();
    });

    it('should handle settings open errors gracefully', async () => {
      mockOpenSettings.mockRejectedValue(new Error('Settings open failed'));
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await permissionManager.openPermissionSettings();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error opening permission settings:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentStatus', () => {
    it('should return current permission status without system call', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      // Initialize status
      await permissionManager.checkSMSPermissions();

      const status = permissionManager.getCurrentStatus();
      expect(status).toBe(PermissionStatus.GRANTED);
    });

    it('should return initial DENIED status before any checks', () => {
      const newManager = new PermissionManagerImpl();
      const status = newManager.getCurrentStatus();
      expect(status).toBe(PermissionStatus.DENIED);
      newManager.cleanup();
    });
  });

  describe('isPermissionGranted', () => {
    it('should return true when permission is granted', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      await permissionManager.checkSMSPermissions();

      expect(permissionManager.isPermissionGranted()).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      mockCheck.mockResolvedValue(RESULTS.DENIED);

      await permissionManager.checkSMSPermissions();

      expect(permissionManager.isPermissionGranted()).toBe(false);
    });

    it('should return false when permission is never ask again', async () => {
      mockCheck.mockResolvedValue(RESULTS.BLOCKED);

      await permissionManager.checkSMSPermissions();

      expect(permissionManager.isPermissionGranted()).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clear all permission callbacks', async () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      permissionManager.onPermissionChanged(callback1);
      permissionManager.onPermissionChanged(callback2);

      permissionManager.cleanup();

      mockRequest.mockResolvedValue(RESULTS.GRANTED);
      await permissionManager.requestSMSPermissions();

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('mapNativeStatusToPermissionStatus', () => {
    it('should correctly map all native permission results', async () => {
      const testCases = [
        {native: RESULTS.GRANTED, expected: PermissionStatus.GRANTED},
        {native: RESULTS.DENIED, expected: PermissionStatus.DENIED},
        {native: RESULTS.BLOCKED, expected: PermissionStatus.NEVER_ASK_AGAIN},
        {native: RESULTS.UNAVAILABLE, expected: PermissionStatus.DENIED},
        {native: RESULTS.LIMITED, expected: PermissionStatus.DENIED},
        {native: 'unknown_status', expected: PermissionStatus.DENIED},
      ];

      for (const testCase of testCases) {
        mockCheck.mockResolvedValue(testCase.native as any);
        const result = await permissionManager.checkSMSPermissions();
        expect(result).toBe(testCase.expected);
      }
    });
  });

  describe('Platform-specific behavior', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle Android platform correctly', async () => {
      (Platform as any).OS = 'android';
      permissionManager = new PermissionManagerImpl();
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      const result = await permissionManager.checkSMSPermissions();

      expect(mockCheck).toHaveBeenCalledWith(PERMISSIONS.ANDROID.READ_SMS);
      expect(result).toBe(PermissionStatus.GRANTED);
    });

    it('should handle iOS platform correctly', async () => {
      (Platform as any).OS = 'ios';
      permissionManager = new PermissionManagerImpl();

      const checkResult = await permissionManager.checkSMSPermissions();
      const requestResult = await permissionManager.requestSMSPermissions();

      expect(mockCheck).not.toHaveBeenCalled();
      expect(mockRequest).not.toHaveBeenCalled();
      expect(checkResult).toBe(PermissionStatus.DENIED);
      expect(requestResult).toBe(PermissionStatus.DENIED);
    });

    it('should handle unknown platforms correctly', async () => {
      (Platform as any).OS = 'web';
      permissionManager = new PermissionManagerImpl();

      const result = await permissionManager.checkSMSPermissions();

      expect(mockCheck).not.toHaveBeenCalled();
      expect(result).toBe(PermissionStatus.DENIED);
    });
  });
});
