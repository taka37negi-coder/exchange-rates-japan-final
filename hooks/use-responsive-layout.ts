import { useState, useEffect } from "react";
import { Dimensions, ScaledSize } from "react-native";

interface ResponsiveLayout {
  isLandscape: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Hook to detect screen orientation and device type
 * Optimized for iPad displays
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const [layout, setLayout] = useState<ResponsiveLayout>(() => {
    const { width, height } = Dimensions.get("window");
    return {
      isLandscape: width > height,
      isTablet: Math.min(width, height) >= 768,
      screenWidth: width,
      screenHeight: height,
    };
  });

  useEffect(() => {
    const updateLayout = ({ window }: { window: ScaledSize }) => {
      const { width, height } = window;
      setLayout({
        isLandscape: width > height,
        isTablet: Math.min(width, height) >= 768,
        screenWidth: width,
        screenHeight: height,
      });
    };

    const subscription = Dimensions.addEventListener("change", updateLayout);

    return () => {
      subscription?.remove();
    };
  }, []);

  return layout;
}
