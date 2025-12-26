// Leqa © 2025 Mithula Chanthuka

import { StyleSheet } from "react-native";
import { useUser } from "@/contexts/UserContext";
import SkeletonBox from "@/components/ui/SkeletonBox";
import { ThemedText, ThemedView } from "@/components/shared";

const HomeHeader = () => {
  const { user } = useUser();

  const limitWords = (text: string, maxWords = 2) => {
    return text.split(" ").slice(0, maxWords).join(" ");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="default" style={styles.greeting}>
        Hello,
      </ThemedText>

      {!user ? (
        <SkeletonBox height={40} width={"70%"} />
      ) : (
        <ThemedText type="title" numberOfLines={1}>
          {limitWords(user.name, 2)}
        </ThemedText>
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
  greeting: {
    marginBottom: 4,
  },
});
