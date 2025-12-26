// Leqa © 2025 Mithula Chanthuka

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { ThemedView } from "../themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export interface BottomSheetProps {
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
  animationDuration = 250,
}) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(300)).current;
  const bgColor = useThemeColor({}, "background");

  const [renderModal, setRenderModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: animationDuration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 300,
          duration: animationDuration,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setRenderModal(false));
    }
  }, [visible, animationDuration]);

  if (!renderModal) return null;

  return (
    <Modal
      visible={renderModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {onOverlayClose && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            { transform: [{ translateY: sheetTranslateY }], backgroundColor: bgColor },
          ]}
        >
          {showCloseButton && (
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
                      <Text style={styles.sheetSubtitle}>{sheetSubtitle}</Text>
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    paddingHorizontal: 5,
  },
  sheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 5,
    maxHeight: "70%",
  },
  sheetHeader: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
