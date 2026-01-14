import { Stack } from "expo-router";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="[id]/index" options={{ title: "Product" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit Product" }} />
      <Stack.Screen name="customer/[id]" options={{ title: "Customer" }} />
    </Stack>
  );
}
