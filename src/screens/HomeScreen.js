import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Modal, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Example outfit generation function (adjust as needed)
const generateOutfits = (items, outfitType) => {
  const available = items.filter(item => !item.laundryStatus && item.wearCount > 0);
  const styleFiltered = available.filter(item => item.properties && item.properties.dressStyle === outfitType);
  
  if (outfitType === "formal") {
    const tops = styleFiltered.filter(item => item.category.toLowerCase() === 'top');
    const inners = styleFiltered.filter(item => item.category.toLowerCase() === 'inner');
    const bottoms = styleFiltered.filter(item => item.category.toLowerCase() === 'bottom');
    const baniyans = styleFiltered.filter(item => item.category.toLowerCase() === 'baniyan');
    const socks = styleFiltered.filter(item => item.category.toLowerCase() === 'socks');
    
    let outfits = {};
    days.forEach((day, index) => {
      outfits[day] = {
        top: tops.length ? tops[index % tops.length] : null,
        inner: inners.length ? inners[index % inners.length] : null,
        bottom: bottoms.length ? bottoms[index % bottoms.length] : null,
        baniyan: baniyans.length ? baniyans[index % baniyans.length] : null,
        socks: socks.length ? socks[index % socks.length] : null,
      };
    });
    return outfits;
  } else {
    // For casual outfits, you might only use top, bottom, and shorts (or trouser)
    const tops = styleFiltered.filter(item => item.category.toLowerCase() === 'top');
    const bottoms = styleFiltered.filter(item => item.category.toLowerCase() === 'bottom');
    const shorts = styleFiltered.filter(item => item.category.toLowerCase() === 'shorts' || item.category.toLowerCase() === 'trouser');
    
    let outfits = {};
    days.forEach((day, index) => {
      outfits[day] = {
        top: tops.length ? tops[index % tops.length] : null,
        bottom: bottoms.length ? bottoms[index % bottoms.length] : null,
        shorts: shorts.length ? shorts[index % shorts.length] : null,
      };
    });
    return outfits;
  }
};

export default function HomeScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [outfitType, setOutfitType] = useState("formal");
  const [generatedOutfits, setGeneratedOutfits] = useState({});
  const [closet, setCloset] = useState([]);
  const [popupImageUri, setPopupImageUri] = useState(null);
  const [popupPart, setPopupPart] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Reload wardrobe whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadCloset();
    }, [outfitType])
  );

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
    console.log("Move to Laundry pressed");
  };

  // Popup modal handler
  const openPopup = (uri, part) => {
    if (uri) {
      setPopupImageUri(uri);
      setPopupPart(part);
      setShowPopup(true);
    }
  };

  const replaceDress = (part) => {
    console.log(`Replace dress for: ${part}`);
    setShowPopup(false);
  };

  const currentOutfit = generatedOutfits[selectedDay];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>

      {/* Outfit Preview and Day Selector */}
      <View style={styles.previewAndDayContainer}>
        {/* Left: Outfit Preview */}
        <View style={styles.outfitContainer}>
          <Text style={styles.outfitTitle}>Outfit for {selectedDay}</Text>
          {currentOutfit ? (
            <View style={styles.outfitPreviewContainer}>
              {/* Left Column: Accessory Boxes */}
              <View style={styles.accessoryContainer}>
                {outfitType === "formal" ? (
                  <>
                    <TouchableOpacity style={styles.accessoryBox} onPress={() => openPopup(currentOutfit.inner?.image, "inner")}>
                      {currentOutfit.inner ? (
                        <Image source={{ uri: currentOutfit.inner.image }} style={styles.accessoryImage} />
                      ) : (
                        <Text style={styles.outfitText}>Blank</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.accessoryBox} onPress={() => openPopup(currentOutfit.baniyan?.image, "baniyan")}>
                      {currentOutfit.baniyan ? (
                        <Image source={{ uri: currentOutfit.baniyan.image }} style={styles.accessoryImage} />
                      ) : (
                        <Text style={styles.outfitText}>Blank</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.accessoryBox} onPress={() => openPopup(currentOutfit.socks?.image, "socks")}>
                      {currentOutfit.socks ? (
                        <Image source={{ uri: currentOutfit.socks.image }} style={styles.accessoryImage} />
                      ) : (
                        <Text style={styles.outfitText}>Blank</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.accessoryBox} onPress={() => openPopup(currentOutfit.shorts?.image, "shorts")}>
                    {currentOutfit.shorts ? (
                      <Image source={{ uri: currentOutfit.shorts.image }} style={styles.accessoryImage} />
                    ) : (
                      <Text style={styles.outfitText}>Blank</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
              {/* Right Column: Main Outfit Boxes (Centered) */}
              <View style={styles.mainContainer}>
                <TouchableOpacity style={styles.outfitBox} onPress={() => openPopup(currentOutfit.top?.image, "top")}>
                  {currentOutfit.top ? (
                    <Image source={{ uri: currentOutfit.top.image }} style={styles.outfitBoxImage} />
                  ) : (
                    <Text style={styles.outfitText}>No Top</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.outfitBox} onPress={() => openPopup(currentOutfit.bottom?.image, "bottom")}>
                  {currentOutfit.bottom ? (
                    <Image source={{ uri: currentOutfit.bottom.image }} style={styles.outfitBoxImage} />
                  ) : (
                    <Text style={styles.outfitText}>No Bottom</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.outfitText}>No outfit generated yet.</Text>
          )}
          <View style={styles.toggleRow}>
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

        {/* Right: Day Selector */}
        <View style={styles.daySelectorContainer}>
          <ScrollView contentContainerStyle={styles.dayScroll} showsVerticalScrollIndicator={false}>
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
      </View>

      {/* Generate Outfits Button */}
      <TouchableOpacity style={styles.generateButton} onPress={onGenerateOutfits}>
        <Text style={styles.generateButtonText}>Generate Outfits</Text>
      </TouchableOpacity>

      {/* Move to Laundry Button */}
      <TouchableOpacity style={styles.laundryButton} onPress={onMoveToLaundry}>
        <Text style={styles.generateButtonText}>Move to Laundry</Text>
      </TouchableOpacity>

      {/* Popup Modal for Enlarged Image */}
      <Modal transparent visible={showPopup} animationType="fade">
        <TouchableOpacity style={styles.popupOverlay} onPress={() => setShowPopup(false)}>
          {popupImageUri && (
            <View style={styles.popupContent}>
              <Image source={{ uri: popupImageUri }} style={styles.popupImage} />
              <TouchableOpacity style={styles.replaceButton} onPress={() => replaceDress(popupPart)}>
                <Text style={styles.replaceButtonText}>Replace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowPopup(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  previewAndDayContainer: {
    flexDirection: "row",
    flex: 1,
  },
  outfitContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  outfitTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#374151",
  },
  outfitText: {
    fontSize: 16,
    color: "#4B5563",
  },
  outfitPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  accessoryContainer: {
    width: 60,
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  accessoryBox: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginVertical: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  accessoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  outfitBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  outfitBoxImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  daySelectorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  dayScroll: {
    justifyContent: "center",
    alignItems: "center",
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
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  selectedDay: {
    backgroundColor: "#6200EE",
  },
  selectedDayText: {
    color: "#fff",
  },
  toggleRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#6200EE",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    alignItems: "center",
  },
  popupImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  replaceButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  replaceButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
