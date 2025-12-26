// Leqa © 2025 Mithula Chanthuka

import { Animated, ViewStyle, DimensionValue } from "react-native";
import { useEffect, useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";

interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonBox = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
}: SkeletonBoxProps) => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  const bgColor = useThemeColor({}, "background-muted");

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        
        {
          width,
          height,
          borderRadius,
          opacity,
          backgroundColor: bgColor,
        },
      ]}
    />
  );
};

export default SkeletonBox;