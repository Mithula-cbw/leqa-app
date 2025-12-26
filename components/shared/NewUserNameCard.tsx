// Leqa © 2025 Mithula Chanthuka

import { TouchableOpacity, StyleSheet, View, TextInput } from "react-native";
import { ThemedText } from "../themed-text";

const NewUserNameCard = ({
  name,
  onChangeName,
  onNext,
  tintColor,
  borderColor,
}: {
  name: string;
  onChangeName: (v: string) => void;
  onNext: () => void;
  tintColor: string;
  borderColor: string;
}) => {
  return (
    <View>
      <ThemedText style={styles.title}>Welcome 👋</ThemedText>
      <ThemedText style={styles.subtitle}>
        Please tell us your name to continue.
      </ThemedText>

      <TextInput
        placeholder="Your name"
        placeholderTextColor={borderColor}
        value={name}
        onChangeText={onChangeName}
        autoFocus
        style={[styles.input, { borderColor }]}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: name.trim() ? tintColor : borderColor },
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
  container: {
    paddingVertical: 20,
    paddingHorizontal: 2,
    overflow: "hidden",
  },
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
  themeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  themeButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  backButton: {
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
