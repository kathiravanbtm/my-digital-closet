// src/screens/RandomOutfitScreen.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function RandomOutfitScreen() {
  const [outfit, setOutfit] = useState([]);

  const handleRandomOutfit = () => {
    // Placeholder logic: pick random items from a stored list
    const random = ["Shirt A", "Pants B"];
    setOutfit(random);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Outfit Screen</Text>
      <Button title="Pick Random Outfit" onPress={handleRandomOutfit} />
      {outfit.length > 0 && (
        <View style={styles.outfitContainer}>
          {outfit.map((item, idx) => (
            <Text key={idx} style={styles.outfitItem}>{item}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  outfitContainer: { marginTop: 20 },
  outfitItem: { fontSize: 16, marginVertical: 5 },
});
