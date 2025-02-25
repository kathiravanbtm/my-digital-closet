// src/screens/ClosetScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ClosetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Closet Screen</Text>
      {/* Display list of all saved clothing items or categories */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
