// Leqa © 2025 Mithula Chanthuka

import { StyleSheet } from "react-native";
import { useUser } from "@/contexts/UserContext";
import SkeletonBox from "@/components/ui/SkeletonBox";
import { ThemedText, ThemedView } from "@/components/shared";
import { useThemeColor } from "@/hooks/use-theme-color";

const HomeHeader = () => {
  const { user } = useUser();
  const titleColr = useThemeColor({}, "text-title");
  const subTitleColr = useThemeColor({}, "text-subtitle");

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <ThemedView style={styles.container}>
      {!user ? (
        <SkeletonBox height={60} width={"80%"} />
      ) : (
        <>
          <ThemedText
            type="title"
            numberOfLines={1}
            style={{ color: titleColr }}
          >
            Hi, {firstName}
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.subtitle, { color: subTitleColr, fontSize: 16 }]}
          >
            Welcome back to your dashboard
          </ThemedText>
        </>
      )}
    </ThemedView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
});
