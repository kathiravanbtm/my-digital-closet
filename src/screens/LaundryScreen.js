// src/screens/LaundryScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LaundryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laundry Screen</Text>
      {/* Display items that are marked as 'sent to laundry' */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
