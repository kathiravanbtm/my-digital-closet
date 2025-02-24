import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClothingItem from "../components/ClothingItem";

export default function LaundryScreen() {
  const [laundry, setLaundry] = useState([]);

  useEffect(() => {
    loadLaundry();
  }, []);

  const loadLaundry = async () => {
    try {
      const storedLaundry = await AsyncStorage.getItem("laundry");
      if (storedLaundry) setLaundry(JSON.parse(storedLaundry));
    } catch (error) {
      console.error("Error loading laundry:", error);
    }
  };

  const deleteLaundryItem = async (itemId) => {
    const updatedLaundry = laundry.filter((item) => item.id !== itemId);
    setLaundry(updatedLaundry);
    await AsyncStorage.setItem("laundry", JSON.stringify(updatedLaundry));
  };

  const moveToLaundry = async (item) => {
    // Assuming you have a function to handle moving items to laundry
    // This function should remove the item from the wardrobe and add it to laundry
    // For example:
    // await addToLaundry(item);
    // await removeFromWardrobe(item.id);
    
    // After moving, refresh the laundry list
    loadLaundry();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laundry</Text>

      <FlatList
        data={laundry}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.laundryGrid}
        renderItem={({ item }) => (
          <ClothingItem item={item} onDelete={deleteLaundryItem} onMoveToLaundry={moveToLaundry} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});