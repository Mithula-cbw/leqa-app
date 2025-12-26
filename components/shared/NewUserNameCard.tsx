// Leqa © 2025 Mithula Chanthuka

import { TouchableOpacity, StyleSheet, View, TextInput } from "react-native";
import { ThemedText } from "../themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

interface Props {
  name: string;
  onChangeName: (v: string) => void;
  onNext: () => void;
}

const NewUserNameCard = ({ name, onChangeName, onNext }: Props) => {
  const tintColor = useThemeColor({}, "tint");
  const tintMutedColor = useThemeColor({}, "tint-muted");
  const text = useThemeColor({}, "text");
  const textMuted = useThemeColor({}, "text-muted");

  return (
    <View>
      <ThemedText style={styles.title}>Welcome 👋</ThemedText>
      <ThemedText style={styles.subtitle}>
        Please tell us your name to continue.
      </ThemedText>

      <TextInput
        placeholder="Your name"
        placeholderTextColor={textMuted}
        value={name}
        onChangeText={onChangeName}
        autoFocus
        style={[styles.input, { borderColor: textMuted, color: text }]}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: name.trim() ? tintColor : tintMutedColor },
        ]}
        onPress={onNext}
        disabled={!name.trim()}
      >
        <ThemedText style={styles.buttonText}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default NewUserNameCard;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
