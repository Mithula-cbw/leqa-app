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
  Dimensions,
  Easing,
  BackHandler,
  ToastAndroid,
  Platform,
} from "react-native";
import { ThemedText, ThemedView } from "../shared";
import { useThemeColor } from "@/hooks/use-theme-color";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const lastBackPressed = useRef<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const sheetBg = useThemeColor({}, "sheet");

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

  const handleRequestClose = () => {
    if (showCloseButton) {
      onClose();
      return;
    }

    // Double tap to exit logic
    const now = Date.now();
    if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
      BackHandler.exitApp();
    } else {
      lastBackPressed.current = now;
      triggerTooltip();
    }
  };

  const triggerTooltip = () => {
    if (Platform.OS === "android") {
      ToastAndroid.show("Press back again to exit Leqa", ToastAndroid.SHORT);
    } else {
      setShowTooltip(true);
      Animated.sequence([
        Animated.timing(tooltipOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowTooltip(false));
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleRequestClose}
      animationType="none"
    >
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          {onOverlayClose && showCloseButton && (
            <TouchableOpacity
              style={styles.flexFill}
              activeOpacity={1}
              onPress={onClose}
            />
          )}
        </Animated.View>

        {/* Custom Tooltip for non-android/UI consistency */}
        {showTooltip && (
          <Animated.View style={[styles.tooltip, { opacity: tooltipOpacity }]}>
            <ThemedText style={styles.tooltipText}>Press back again to exit</ThemedText>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ThemedView
            style={[styles.sheet, sheetStyle, { backgroundColor: sheetBg }]}
          >
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
                        <ThemedText style={styles.sheetTitle}>{sheetTitle}</ThemedText>
                      )}
                      {sheetSubtitle && (
                        <ThemedText style={styles.sheetSubtitle}>
                          {sheetSubtitle}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={[styles.closeButton, closeButtonStyle]}
                      onPress={onClose}
                    >
                      <ThemedText style={[styles.closeText, closeTextStyle]}>×</ThemedText>
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
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  tooltip: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 9999,
  },
  tooltipText: {
    color: "white",
    fontSize: 14,
  },
  sheetContainer: {
    width: "100%",
    paddingHorizontal: 0,
  },
  sheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 5,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  sheetHeader: {
    marginBottom: 10,
    padding:5,
    paddingTop: 25
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextWrapper: {
    flexDirection: "column",
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  sheetSubtitle: {
    maxWidth: "90%",
    fontSize: 15,
    opacity: 0.6,
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 34,
    fontWeight: "300",
  },
});
