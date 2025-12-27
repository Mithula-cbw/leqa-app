

import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";

const HeroCardOne = () => {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/hero-1.jpg")}
        style={[styles.imageBackground]}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <View style={styles.subtitleBox}>
              <View style={styles.subtitleDot} />
              <View style={styles.subtitleLine} />
            </View>
            <View style={styles.titleBox}>
              <View style={styles.titleLine} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroCardOne;

const styles = StyleSheet.create({
  imageBackground: {
    height: 140,
    justifyContent: "flex-end",
  },
  overlay: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  textContainer: {
    flexDirection: "column",
    gap: 4,
  },
  subtitleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subtitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
  subtitleLine: {
    height: 10,
    width: 40,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  titleBox: {
    marginTop: 4,
  },
  titleLine: {
    height: 20,
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});


