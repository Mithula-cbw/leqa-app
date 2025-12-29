// Leqa © 2025 Mithula Chanthuka

import { StyleSheet } from "react-native";
import { useUser } from "@/contexts/UserContext";
import SkeletonBox from "@/components/ui/SkeletonBox";
import { Avatar, ThemedText, ThemedView } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

const HomeHeader = () => {
  const { user } = useUser();
  const titleColor = useThemeColor({}, "text-title");
  const subTitleColor = useThemeColor({}, "text-subtitle");

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <ThemedView style={styles.container}>
      {!user ? (
        <ThemedView style={[styles.row, styles.skelton]}>
          <SkeletonBox width={50} height={50} borderRadius={25} />
          <ThemedView style={styles.textContainer}>
            <SkeletonBox width={140} height={20} />
            <SkeletonBox width={220} height={16} style={{ marginTop: 6 }} />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.row}>
          <Avatar size={64} />

          <ThemedView style={styles.textContainer}>
            <ThemedText
              type="title"
              numberOfLines={1}
              style={{ color: titleColor }}
            >
              Hi, {firstName}
            </ThemedText>

            <ThemedText
              type="default"
              style={[styles.subtitle, { color: subTitleColor }]}
            >
              Welcome back to your dashboard
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  skelton: {
    opacity: 0.35,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
    paddingTop: 4,
  },
  subtitle: {
    marginTop: 0,
    opacity: 0.9,
    fontSize: 14,
  },
});
