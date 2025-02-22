import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const ClosetScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Closet</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ClosetScreen;
