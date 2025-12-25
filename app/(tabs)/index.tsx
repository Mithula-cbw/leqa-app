import BottomSheet from "@/components/ui/BottomSheet";
import React, { useState } from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";

export default function Index() {
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Sheet" onPress={() => setSheetVisible(true)} />

      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Hello from the sheet!
        </Text>
        <Text>Put any React Node here.</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Hello from the sheet!
        </Text>
        <Text>Put any React Node here.</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Hello from the sheet!
        </Text>
        <Text>Put any React Node here.</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Hello from the sheet!
        </Text>
        <Text>Put any React Node here.</Text>
      </BottomSheet>
    </View>
  );
}