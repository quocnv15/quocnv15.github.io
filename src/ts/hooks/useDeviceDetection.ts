/**
 * Hook for device detection
 */

import { BREAKPOINTS } from '../constants';
import type { DeviceType } from '../types';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  width: number;
  height: number;
}

/**
 * Detect current device type based on viewport and capabilities
 */
export function useDeviceDetection(): DeviceInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = width <= BREAKPOINTS.MOBILE || (isTouch && width <= 768);
  const isTablet = width > BREAKPOINTS.MOBILE && width <= BREAKPOINTS.TABLET;
  const isDesktop = width > BREAKPOINTS.TABLET;

  let type: DeviceType = 'desktop';
  if (isMobile) type = 'mobile';
  else if (isTablet) type = 'tablet';

  return {
    type,
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    width,
    height,
  };
}

/**
 * Check if device is mobile (alias for compatibility)
 */
export const isMobile = (): boolean => {
  const device = useDeviceDetection();
  return device.isMobile;
};

/**
 * Get current viewport size
 */
export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};