import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  onAdd: () => void;
  onRemove: () => void;
};

export default function FloatingActionButtons({ onAdd, onRemove }: Props) {
  const tintColor = useThemeColor({}, "tint");
  const bgMuted = useThemeColor({}, "background-muted");

  return (
    <View style={styles.container}>
      {/* Add Button */}
      <Pressable
        style={[styles.fab, styles.add, { backgroundColor: tintColor }]}
        onPress={onAdd}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      {/* Remove Button */}
      <Pressable style={[styles.fab, styles.remove, { backgroundColor: bgMuted }]} onPress={onRemove}>
        <Ionicons name="remove" size={32} color={tintColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 104,
    alignItems: "center",
  },
  fab: {
    
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  remove: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 16,
  },
  add: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginTop: 16,
  },
});
