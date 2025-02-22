// src/components/Closet/ImageUploader.js
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const ImageUploader = ({ onImageSelect }) => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant permission to access images.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      onImageSelect(result.assets[0].uri); // Pass image URI to parent component
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={40} color="#6200EE" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </>
        )}
      </TouchableOpacity>
      {imageUri && (
        <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  uploadBtn: {
    width: 150,
    height: 150,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  uploadText: {
    marginTop: 5,
    fontSize: 14,
    color: "#6200EE",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeBtn: {
    marginTop: 10,
    backgroundColor: "#FF5252",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeText: {
    color: "#FFF",
    fontSize: 14,
  },
});

export default ImageUploader;
