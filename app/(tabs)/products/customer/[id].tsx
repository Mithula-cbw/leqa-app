// app/(tabs)/products/customer/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { ThemedView, ThemedText, EditableField } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Customer } from "@/types/customer";
import { useStock } from "@/contexts/StockContext";

export default function CustomerDetailsPage() {
  const params = useLocalSearchParams<{ id: string }>();
  const customerId = Number(params.id);

  const { controller, refreshCustomers } = useStock();

  const bgSecondary = useThemeColor({}, "background-seconary");
  const bgPrimary = useThemeColor({}, "background-muted");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        // You should have something like this:
        const data = await controller.getCustomerById(customerId);
        if (!mounted) return;
        setCustomer(data || null);
      } catch (e) {
        console.error("Failed to load customer:", e);
        if (mounted) setCustomer(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [customerId]);

  const initialLetter = useMemo(() => {
    const n = customer?.name?.trim();
    return n ? n[0].toUpperCase() : "?";
  }, [customer?.name]);

  const phoneAvailable = !!customer?.phone && customer.phone.trim().length > 0;

  const handleCall = async () => {
    if (!customer?.phone) return;

    // Keep digits/+ only (safe basic sanitize)
    const cleaned = customer.phone.replace(/[^\d+]/g, "");
    const url = `tel:${cleaned}`;

    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("Can't place call", "Your device can't open the dialer.");
      return;
    }
    Linking.openURL(url);
  };

  const saveField = async (field: keyof Customer, value: any) => {
    if (!customer) return;

    try {
      // Update in DB
      await controller.updateCustomerField(customer.id, field, value);

      // Update local UI
      setCustomer((prev) => (prev ? { ...prev, [field]: value } : prev));

      // Refresh list screens
      await refreshCustomers();
    } catch (e) {
      console.error("Customer update failed:", e);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.screen}>
        <Stack.Screen options={{ title: "Customer" }} />
        <ThemedText style={{ opacity: 0.6 }}>Loading…</ThemedText>
      </ThemedView>
    );
  }

  if (!customer) {
    return (
      <ThemedView style={styles.screen}>
        <Stack.Screen options={{ title: "Customer" }} />
        <ThemedText style={{ opacity: 0.6 }}>Customer not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: "Customer" }} />

      {/* HEADER CARD */}
      <ThemedView style={[styles.headerCard, { backgroundColor: bgSecondary }]}>
        <View style={styles.avatarWrap}>
          {customer.image ? (
            <Image source={{ uri: customer.image }} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: bgPrimary }]}>
              <ThemedText style={styles.avatarLetter}>{initialLetter}</ThemedText>
            </View>
          )}
        </View>

        <View style={{ flex: 1, gap: 6 }}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <EditableField
            value={customer.name}
            onSave={(val) => saveField("name", val)}
            textStyle={styles.valueText}
          />

          <ThemedText style={styles.label}>Email</ThemedText>
          <EditableField
            value={customer.email || "Add email"}
            onSave={(val) => saveField("email", val)}
            textStyle={styles.valueText}
          />
        </View>
      </ThemedView>

      {/* PHONE CARD */}
      <ThemedView style={[styles.card, { backgroundColor: bgSecondary }]}>
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title}>Phone</ThemedText>
            <ThemedText style={styles.sub}>
              {phoneAvailable ? "Tap call to dial" : "No phone number yet"}
            </ThemedText>
          </View>

          <TouchableOpacity
            disabled={!phoneAvailable}
            onPress={handleCall}
            style={[
              styles.callBtn,
              {
                backgroundColor: phoneAvailable ? bgPrimary : "rgba(0,0,0,0.08)",
              },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={18}
              color={phoneAvailable ? "#fff" : "rgba(0,0,0,0.35)"}
            />
            <ThemedText
              style={[
                styles.callText,
                { color: phoneAvailable ? "#fff" : "rgba(0,0,0,0.35)" },
              ]}
            >
              Call
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* phone field separated from call button */}
        <View style={styles.phoneRow}>
          <Ionicons name="phone-portrait-outline" size={18} color={bgPrimary} />
          <EditableField
            value={customer.phone || "Add phone number"}
            onSave={(val) => saveField("phone", val)}
            textStyle={styles.phoneValue}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 64, gap: 16 },

  headerCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  avatarWrap: { width: 72, height: 72, borderRadius: 36, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
  },
  avatarLetter: { fontSize: 28, fontWeight: "800", color: "#fff" },

  label: { fontSize: 13, fontWeight: "700", opacity: 0.5, marginTop: 2 },
  valueText: { fontSize: 16, fontWeight: "700", opacity: 0.9 },

  card: {
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 12, opacity: 0.55 },

  callBtn: {
    height: 44,
    paddingHorizontal: 24,
    paddingRight: 34,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  callText: { fontWeight: "800" },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  phoneValue: { fontSize: 14, fontWeight: "700", opacity: 0.85 },
});
