import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get("window").height;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Example outfit generation function (replace with your dynamic logic)
const generateOutfits = (items, outfitType) => {
  const available = items.filter(item => !item.laundryStatus && item.wearCount > 0);
  const styleFiltered = available.filter(item => item.properties && item.properties.dressStyle === outfitType);
  const tops = styleFiltered.filter(item => item.category.toLowerCase() === 'top');
  const inners = styleFiltered.filter(item => item.category.toLowerCase() === 'inner');
  const bottoms = styleFiltered.filter(item => item.category.toLowerCase() === 'bottom');
  
  let outfits = {};
  days.forEach((day, index) => {
    const top = tops.length ? tops[index % tops.length] : null;
    const inner = inners.length ? inners[index % inners.length] : null;
    const bottom = bottoms.length ? bottoms[index % bottoms.length] : null;
    outfits[day] = { top, inner, bottom };
  });
  return outfits;
};

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [outfitType, setOutfitType] = useState("formal");
  const [generatedOutfits, setGeneratedOutfits] = useState({});
  const [closet, setCloset] = useState([]);

  useEffect(() => {
    loadCloset();
  }, [outfitType]);

  const loadCloset = async () => {
    try {
      const data = await AsyncStorage.getItem('wardrobe');
      if (data) {
        const items = JSON.parse(data);
        setCloset(items);
        const outfits = generateOutfits(items, outfitType);
        setGeneratedOutfits(outfits);
      }
    } catch (error) {
      console.error("Error loading closet:", error);
    }
  };

  const onGenerateOutfits = () => {
    loadCloset();
  };

  const onMoveToLaundry = () => {
    // Implement your move-to-laundry functionality here
    console.log("Move to Laundry pressed");
  };

  const currentOutfit = generatedOutfits[selectedDay];

  return (
    <View style={styles.container}>
      {/* Outfit Preview Container */}
      <View style={styles.outfitContainer}>
        <Text style={styles.outfitTitle}>Outfit for {selectedDay}</Text>
        
        {currentOutfit ? (
          <View style={styles.outfitPreview}>
            {/* Top Image */}
            <View style={styles.clothingItemContainer}>
              {currentOutfit.top && currentOutfit.top.image ? (
                <Image source={{ uri: currentOutfit.top.image }} style={styles.clothingImage} />
              ) : (
                <Text style={styles.outfitText}>No Top Selected</Text>
              )}
            </View>
            {/* Inner Image */}
            <View style={styles.clothingItemContainer}>
              {currentOutfit.inner && currentOutfit.inner.image ? (
                <Image source={{ uri: currentOutfit.inner.image }} style={styles.clothingImage} />
              ) : (
                <Text style={styles.outfitText}>No Inner Selected</Text>
              )}
            </View>
            {/* Bottom Image */}
            <View style={styles.clothingItemContainer}>
              {currentOutfit.bottom && currentOutfit.bottom.image ? (
                <Image source={{ uri: currentOutfit.bottom.image }} style={styles.clothingImage} />
              ) : (
                <Text style={styles.outfitText}>No Bottom Selected</Text>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.outfitText}>No outfit generated yet.</Text>
        )}

        <Text style={styles.outfitText}>
          Top: {currentOutfit?.top ? currentOutfit.top.properties.name : "N/A"}
        </Text>
        <Text style={styles.outfitText}>
          Inner: {currentOutfit?.inner ? currentOutfit.inner.properties.name : "N/A"}
        </Text>
        <Text style={styles.outfitText}>
          Bottom: {currentOutfit?.bottom ? currentOutfit.bottom.properties.name : "N/A"}
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.toggleButton, outfitType === "formal" && styles.activeButton]}
            onPress={() => { setOutfitType("formal"); loadCloset(); }}
          >
            <Text style={styles.buttonText}>Formal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, outfitType === "casual" && styles.activeButton]}
            onPress={() => { setOutfitType("casual"); loadCloset(); }}
          >
            <Text style={styles.buttonText}>Casual</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelector}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Generate Outfits Button at bottom right corner */}
      <TouchableOpacity style={styles.generateButton} onPress={onGenerateOutfits}>
        <Text style={styles.generateButtonText}>Generate Outfits</Text>
      </TouchableOpacity>

      {/* Move to Laundry Button at bottom left corner */}
      <TouchableOpacity style={styles.laundryButton} onPress={onMoveToLaundry}>
        <Text style={styles.generateButtonText}>Move to Laundry</Text>
      </TouchableOpacity>
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
    padding: 25,
    borderRadius: 20,
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
  outfitPreview: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  clothingItemContainer: {
    marginVertical: 5,
  },
  clothingImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
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
  generateButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  laundryButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
