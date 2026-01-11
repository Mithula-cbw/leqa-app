import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  ToastAndroid,
} from "react-native";
import ThemedText from "./themed-text";

export interface ToastRef {
  show: (message: string) => void;
}

const Toast = forwardRef<ToastRef, {}>((props, ref) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  useImperativeHandle(ref, () => ({
    show: (msg: string) => {
      if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        setMessage(msg);
        setVisible(true);
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      }
    },
  }));

  if (Platform.OS === "android" || !visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.toast}>
        <ThemedText style={styles.text}>{message}</ThemedText>
      </View>
    </Animated.View>
  );
});

Toast.displayName = "Toast";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  text: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default Toast;
