// Leqa © 2025 Mithula Chanthuka

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";

import { AlertDialog, ThemedText } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Customer } from "@/types/customer";
import { formatText } from "@/utils/formatText";
import { useStock } from "@/contexts/StockContext";
import CustomerCardSkeleton from "./CustomerSkeleton";
import CustomerOptionsModal from "./CustomerOptionsModal";

export type CustomerAction = "view" | "edit" | "pin" | "delete";

const CustomerCard = ({ item }: { item: Customer }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const { loading, controller, refreshCustomers, refreshProducts } = useStock();

  const cardBg = useThemeColor({}, "sheet");
  const shadow = useThemeColor({}, "text");
  const bgSecondary = useThemeColor({}, "background-seconary");

  const goToCustomer = () => {
    router.push(`/(tabs)/products/customer/${item.id}`);
  };

  const confirmDelete = async () => {
    await controller.deleteCustomer(item.id);
    await refreshCustomers();
    await refreshProducts();
    setDeleteAlertVisible(false);
  };

  const handleAction = async (action: CustomerAction) => {
    switch (action) {
      case "view":
        goToCustomer();
        return;

      case "pin":
        await controller.toggleCustomerPin(item.id, item.is_pinned === 0);
        await refreshCustomers?.();
        return;

      case "delete":
        if (item.id === 1) {
          ToastAndroid.show(
            "Can't Delete the default Customer",
            ToastAndroid.SHORT
          );
          return;
        }
        setDeleteAlertVisible(true);
        return;
    }
  };

  if (loading) return <CustomerCardSkeleton />;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goToCustomer}
        style={[styles.card, { shadowColor: shadow, backgroundColor: cardBg }]}
      >
        {/* Avatar Section */}
        <View
          style={[styles.avatarContainer, { backgroundColor: bgSecondary }]}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <ThemedText style={styles.avatarPlaceholderText}>
              {item.name[0].toUpperCase()}
            </ThemedText>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <ThemedText
              numberOfLines={1}
              type="defaultSemiBold"
              style={styles.name}
            >
              {formatText(item.name, "title")}
            </ThemedText>
            {item.is_pinned === 1 && (
              <AntDesign
                name="pushpin"
                size={12}
                color={shadow}
                style={styles.pinIcon}
              />
            )}
          </View>

          <View style={styles.phoneRow}>
            <MaterialCommunityIcons
              name="phone"
              size={12}
              color={shadow}
              style={{ opacity: 0.5 }}
            />
            <ThemedText style={styles.phoneText}>
              {item.phone || "No phone number"}
            </ThemedText>
          </View>
        </View>

        {/* Options Button */}
        <TouchableOpacity
          style={styles.moreButton}
          onPress={(e) => {
            e.stopPropagation();
            setMenuVisible(true);
          }}
          hitSlop={15}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={shadow}
            style={{ opacity: 0.6 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <CustomerOptionsModal
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        customer={item}
        isPinned={item.is_pinned === 1}
        onAction={handleAction}
      />

      <AlertDialog
        isVisible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete ${item.name}? This cannot be undone.`}
        confirmText="Delete"
        isDestructive
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 16,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholderText: {
    fontSize: 20,
    fontWeight: "800",
    opacity: 0.3,
  },
  infoSection: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: { fontSize: 15 },
  pinIcon: { opacity: 0.7 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  phoneText: { fontSize: 13, opacity: 0.5 },
  moreButton: { padding: 8, marginLeft: 4 },
});

export default CustomerCard;
