// Leqa © 2025 Mithula Chanthuka

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Modal,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { ThemedView } from "../themed-view";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  sheetTitle?: string;
  sheetSubtitle?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  onOverlayClose?: boolean;
  sheetStyle?: ViewStyle;
  closeButtonStyle?: ViewStyle;
  closeTextStyle?: TextStyle;
  animationDuration?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  sheetTitle,
  sheetSubtitle,
  children,
  showCloseButton = true,
  onOverlayClose = true,
  sheetStyle,
  closeButtonStyle,
  closeTextStyle,
  animationDuration = 300,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For overlay opacity
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // For sheet position

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.container}>
        {/* Animated Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {onOverlayClose && (
            <TouchableOpacity
              style={styles.flexFill}
              activeOpacity={1}
              onPress={onClose}
            />
          )}
        </Animated.View>

        {/* Animated Sheet */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedView style={[styles.sheet, sheetStyle]}>
            {(showCloseButton || sheetTitle || sheetSubtitle) && (
              <ThemedView style={styles.sheetHeader}>
                <ThemedView
                  style={[
                    styles.headerContent,
                    {
                      justifyContent:
                        sheetTitle || sheetSubtitle
                          ? "space-between"
                          : "flex-end",
                    },
                  ]}
                >
                  {(sheetTitle || sheetSubtitle) && (
                    <ThemedView style={styles.headerTextWrapper}>
                      {sheetTitle && (
                        <Text style={styles.sheetTitle}>{sheetTitle}</Text>
                      )}
                      {sheetSubtitle && (
                        <Text style={styles.sheetSubtitle}>
                          {sheetSubtitle}
                        </Text>
                      )}
                    </ThemedView>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={[styles.closeButton, closeButtonStyle]}
                      onPress={onClose}
                    >
                      <Text style={[styles.closeText, closeTextStyle]}>×</Text>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              </ThemedView>
            )}
            {children}
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  flexFill: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    width: "100%",
    paddingHorizontal: 5,
  },
  sheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 5,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  sheetHeader: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextWrapper: {
    flexDirection: "column",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 34,
    fontWeight: "300",
  },
});
