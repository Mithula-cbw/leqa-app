import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  onAdd: () => void;
  onRemove: () => void;
};

export default function FloatingActionButtons({ onAdd, onRemove }: Props) {
  const textColor = useThemeColor({}, "text");
  const bgMuted = useThemeColor({}, "background-muted");
  const accent = useThemeColor({}, "accent");

  return (
    <View style={styles.container}>
      {/* Add Button */}
      <Pressable
        style={[styles.fab, styles.add, { backgroundColor: accent }]}
        onPress={onAdd}
      >
        <Ionicons name="add" size={40} color={textColor} />
      </Pressable>

      {/* Remove Button */}
      <Pressable style={[styles.fab, styles.remove, { backgroundColor: bgMuted }]} onPress={onRemove}>
        <Ionicons name="remove" size={32} color={textColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    bottom: 114,
    alignItems: "center",
  },
  fab: {
    
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  remove: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 18,
  },
  add: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginTop: 18,
  },
});
