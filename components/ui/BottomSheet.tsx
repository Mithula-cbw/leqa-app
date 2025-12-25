// Leqa © 2025 Mithula Chanthuka

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Modal,
} from "react-native";

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
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {onOverlayClose && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        <View style={[styles.sheet, sheetStyle]}>
          {showCloseButton && (
            <View style={styles.sheetHeader}>
              <View
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
                  <View style={styles.headerTextWrapper}>
                    {sheetTitle && (
                      <Text style={styles.sheetTitle}>{sheetTitle}</Text>
                    )}
                    {sheetSubtitle && (
                      <Text style={styles.sheetSubtitle}>{sheetSubtitle}</Text>
                    )}
                  </View>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    style={[styles.closeButton, closeButtonStyle]}
                    onPress={onClose}
                  >
                    <Text style={[styles.closeText, closeTextStyle]}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          {children}
        </View>
      </View>
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
    backgroundColor: "white",
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
