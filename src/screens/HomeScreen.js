import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { Rect } from "react-native-svg";

// Get screen height for better layout
const screenHeight = Dimensions.get("window").height;

// Outfit Data (Formal & Casual)
const outfits = {
  Monday: {
    formal: { top: "Blue Shirt", bottom: "Black Trousers", colorTop: "#3B82F6", colorBottom: "#1E293B" },
    casual: { top: "T-Shirt", bottom: "Shorts", colorTop: "#FACC15", colorBottom: "#A16207" },
  },
  Tuesday: {
    formal: { top: "White Shirt", bottom: "Navy Pants", colorTop: "#F1F5F9", colorBottom: "#334155" },
    casual: { top: "Hoodie", bottom: "Joggers", colorTop: "#4F46E5", colorBottom: "#64748B" },
  },
  Wednesday: {
    formal: { top: "Grey Suit", bottom: "Black Pants", colorTop: "#6B7280", colorBottom: "#1E293B" },
    casual: { top: "Polo Shirt", bottom: "Jeans", colorTop: "#10B981", colorBottom: "#475569" },
  },
  Thursday: {
    formal: { top: "Black Shirt", bottom: "Khaki Trousers", colorTop: "#1E293B", colorBottom: "#D1A054" },
    casual: { top: "Sweater", bottom: "Track Pants", colorTop: "#D946EF", colorBottom: "#7C3AED" },
  },
  Friday: {
    formal: { top: "Striped Shirt", bottom: "Jeans", colorTop: "#F97316", colorBottom: "#3B82F6" },
    casual: { top: "Tank Top", bottom: "Shorts", colorTop: "#DC2626", colorBottom: "#A16207" },
  },
  Saturday: {
    formal: { top: "Formal Blazer", bottom: "Dress Pants", colorTop: "#2563EB", colorBottom: "#1E293B" },
    casual: { top: "Graphic Tee", bottom: "Cargo Pants", colorTop: "#9333EA", colorBottom: "#065F46" },
  },
  Sunday: {
    formal: { top: "Casual Shirt", bottom: "Chinos", colorTop: "#D97706", colorBottom: "#78350F" },
    casual: { top: "Loose T-Shirt", bottom: "Sweatpants", colorTop: "#A78BFA", colorBottom: "#334155" },
  },
};

const days = Object.keys(outfits); // ["Monday", "Tuesday", ..., "Sunday"]

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState("Monday"); // Default selected day
  const [outfitType, setOutfitType] = useState("formal"); // Default outfit type

  return (
    <View style={styles.container}>
      {/* Outfit Display */}
      <View style={styles.outfitContainer}>
        <Text style={styles.outfitTitle}>Outfit for {selectedDay}</Text>

        {/* Mannequin-like Outfit */}
        <Svg height="280" width="160">
          {/* Shirt / Top */}
          <Rect
            x="30"
            y="30"
            width="100"
            height="80"
            fill={outfits[selectedDay][outfitType].colorTop}
            rx="10"
          />
          {/* Pants / Bottom */}
          <Rect
            x="40"
            y="120"
            width="80"
            height="130"
            fill={outfits[selectedDay][outfitType].colorBottom}
            rx="10"
          />
        </Svg>

        <Text style={styles.outfitText}>
          Top: {outfits[selectedDay][outfitType].top}
        </Text>
        <Text style={styles.outfitText}>
          Bottom: {outfits[selectedDay][outfitType].bottom}
        </Text>

        {/* Outfit Type Selector */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              outfitType === "formal" && styles.activeButton,
            ]}
            onPress={() => setOutfitType("formal")}
          >
            <Text style={styles.buttonText}>Formal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              outfitType === "casual" && styles.activeButton,
            ]}
            onPress={() => setOutfitType("casual")}
          >
            <Text style={styles.buttonText}>Casual</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Day Selector (Fixed at Right Side Center) */}
      <View style={styles.daySelector}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDay,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText,
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  outfitContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  outfitTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#374151",
  },
  outfitText: {
    fontSize: 16,
    marginTop: 8,
    color: "#4B5563",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#6200EE",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  daySelector: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  dayButton: {
    width: 90,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
    borderRadius: 10,
  },
  selectedDay: {
    backgroundColor: "#6200EE",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  selectedDayText: {
    color: "#fff",
  },
});
