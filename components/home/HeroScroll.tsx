// Leqa © 2025 Mithula Chanthuka

import React from "react";
import { StyleSheet, FlatList, View, Dimensions } from "react-native";
import { ThemedView } from "../shared";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 200;
const CARD_WIDTH = width * 0.78;
const SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

interface Props {
  children: React.ReactElement[];
}

const HeroScroll = ({ children }: Props) => {
  return (
    <ThemedView
      style={[
        styles.container,
        {
          height: HERO_HEIGHT,
        },
      ]}
    >
      <FlatList
        data={children}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={{
              width: CARD_WIDTH,
              marginRight: SPACING,
            }}
          >
            {item}
          </View>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  listContent: { paddingLeft: 15 },
});

export default HeroScroll;
