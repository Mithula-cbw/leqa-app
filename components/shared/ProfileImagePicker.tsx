import React from "react";
import { View, Image, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@/contexts/UserContext";

const ProfileImagePicker = () => {
  const { user, updateProfilePicture } = useUser();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await updateProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
    

      <Button title="Choose Profile Picture" onPress={pickImage} />
    </View>
  );
};

export default ProfileImagePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
});
