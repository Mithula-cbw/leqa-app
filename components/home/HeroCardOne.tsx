// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { ThemedText } from "@/components/shared";

interface HeroCardProps {
  leftAmount: number;
}

const HeroCardOne = ({ leftAmount }: HeroCardProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/hero.jpg")}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.overlay}>
          {/* Content */}
          <View style={styles.Content}>
            <ThemedText style={styles.title}>Packets Left</ThemedText>
            <ThemedText style={styles.amountText}>{leftAmount}</ThemedText>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroCardOne;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 24
  },
  overlay: {
    flex: 1,    
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 15,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  Content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
    paddingLeft: 2,
  },
  amountText: {
    fontSize: 60,
    fontWeight: "400",
    color: "#fff",
    lineHeight: 56,
  },
});
