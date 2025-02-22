import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageUploader from "../components/Closet/ImageUploader";

const AddItemScreen = () => {
  const [image, setImage] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Clothing Item</Text>
      <ImageUploader onImageSelect={setImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default AddItemScreen;
