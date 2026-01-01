import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";

const CustomerCard = ({ item }: { item: any }) => {
  const bg = useThemeColor({}, "background-seconary");
  const tint = useThemeColor({}, "background-muted");

  const handlePress = () => {
    // Navigate to customer details (you can create this later)
    // router.push({ pathname: "/(customers)/[id]", params: { id: item.id } });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: bg }]} 
      onPress={handlePress}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.avatar} />
      ) : (
        <View style={[styles.initialContainer, { backgroundColor: tint + "20" }]}>
          <ThemedText style={[styles.initialText, { color: tint }]}>
            {item.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.info}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {item.name}
        </ThemedText>
        {item.phone && (
          <ThemedText style={styles.phone} numberOfLines={1}>
            {item.phone}
          </ThemedText>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </TouchableOpacity>
  );
};

export default CustomerCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  initialContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  phone: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
  },
});