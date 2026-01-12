import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

export type TransactionType = "sale" | "expense";

interface TransactionFormProps {
  onSave: (transaction: any) => void;
  onClose: () => void;
}

const TransactionForm = ({ onSave, onClose }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>("sale"); // Sale = Income
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const accent = useThemeColor({}, "accent");
  const cardBg = useThemeColor({}, "background-seconary");
  const textColor = useThemeColor({}, "text");

  const incomeColor = "#487d55";
  const expenseColor = "#ef4444";
  const activeColor = type === "sale" ? incomeColor : expenseColor;

  const handleSave = () => {
    if (!amount) return;

    onSave({
      type,
      amount: parseFloat(amount),
      description: description || null,
      created_at: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Type Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: cardBg }]}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            type === "sale" && { backgroundColor: incomeColor },
          ]}
          onPress={() => setType("sale")}
        >
          <Ionicons
            name="trending-up"
            size={18}
            color={type === "sale" ? "#fff" : "#888"}
          />
          <ThemedText
            style={[styles.toggleText, type === "sale" && styles.activeTabText]}
          >
            Income
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            type === "expense" && { backgroundColor: expenseColor },
          ]}
          onPress={() => setType("expense")}
        >
          <Ionicons
            name="trending-down"
            size={18}
            color={type === "expense" ? "#fff" : "#888"}
          />
          <ThemedText
            style={[
              styles.toggleText,
              type === "expense" && styles.activeTabText,
            ]}
          >
            Expense
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <View
          style={[
            styles.amountInputWrapper,
            { borderBottomColor: activeColor + "40" },
          ]}
        >
          <ThemedText style={[styles.currency, { color: activeColor }]}>
            LKR
          </ThemedText>
          <TextInput
            style={[styles.amountInput, { color: textColor }]}
            placeholder="0.00"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Note (Optional)</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: textColor }]}
          placeholder="Add details..."
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: activeColor }]}
        onPress={handleSave}
      >
        <ThemedText style={styles.submitText}>
          Add {type === "sale" ? "Income" : "Expense"}
        </ThemedText>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  toggleContainer: {
    flexDirection: "row",
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 25,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
  },
  activeTabText: {
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  currency: {
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
  },
  input: {
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
  },
  submitBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransactionForm;
