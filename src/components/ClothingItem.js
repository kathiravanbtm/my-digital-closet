import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ClothingItem = ({ item = {}, onDelete }) => {
  // Prevent rendering if item is missing
  if (!item || !item.image) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Tag Selector - Fixed at the Top */}
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{item.tag || "No Tag"}</Text>
      </View>

      {/* Clothing Image */}
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 180,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    position: "relative",
  },
  tagContainer: {
    position: "absolute",
    top: 5,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "#6200EE",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 10,
  },
  tagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 30,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ClothingItem;
