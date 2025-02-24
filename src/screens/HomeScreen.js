import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateOutfits = (items, outfitType) => {
  const available = items.filter(item => !item.laundryStatus && item.wearCount > 0);
  const styleFiltered = available.filter(item => item.properties?.dressStyle === outfitType);

  const categories = {
    top: styleFiltered.filter(item => item.category === 'top'),
    bottom: styleFiltered.filter(item => item.category === 'bottom'),
    inner: styleFiltered.filter(item => item.category === 'inner'),
    baniyan: styleFiltered.filter(item => item.category === 'baniyan'),
    socks: styleFiltered.filter(item => item.category === 'socks'),
    shorts: styleFiltered.filter(item => item.category === 'shorts')
  };

  const getRandomItem = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

  let outfits = {};
  days.forEach(day => {
    outfits[day] = {
      top: getRandomItem(categories.top),
      bottom: getRandomItem(categories.bottom),
      inner: outfitType === 'formal' ? getRandomItem(categories.inner) : null,
      baniyan: outfitType === 'formal' ? getRandomItem(categories.baniyan) : null,
      socks: outfitType === 'formal' ? getRandomItem(categories.socks) : null,
      shorts: outfitType === 'casual' ? getRandomItem(categories.shorts) : null,
    };
  });
  return outfits;
};

export default function HomeScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [outfitType, setOutfitType] = useState("formal");
  const [generatedOutfits, setGeneratedOutfits] = useState({});
  const [closet, setCloset] = useState([]);
  const [popupImageUri, setPopupImageUri] = useState(null);
  const [popupPart, setPopupPart] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [laundryItems, setLaundryItems] = useState([]);
  const [showLaundryPopup, setShowLaundryPopup] = useState(false);

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
        setGeneratedOutfits(generateOutfits(items, outfitType));
      }
    } catch (error) {
      console.error("Error loading closet:", error);
    }
  };

  const handleMoveToLaundry = () => {
    const currentOutfit = generatedOutfits[selectedDay];
    const items = Object.values(currentOutfit).filter(item => item);
    setLaundryItems(items);
    setShowLaundryPopup(true);
  };

  const handleLaundryAction = (item, action) => {
    const updatedCloset = closet.map(closetItem => {
      if (closetItem.id === item.id) {
        if (action === 'move') {
          closetItem.laundryStatus = true;
          closetItem.wearCount = Math.max(0, closetItem.wearCount - 1);
        } else if (action === 'restore') {
          closetItem.laundryStatus = false;
        }
      }
      return closetItem;
    });
    
    AsyncStorage.setItem('wardrobe', JSON.stringify(updatedCloset))
      .then(() => {
        loadCloset();
        setShowLaundryPopup(false);
      });
  };

  const openImagePopup = (uri, part) => {
    if (uri) {
      setPopupImageUri(uri);
      setPopupPart(part);
      setShowPopup(true);
    }
  };

  const replaceClothingItem = (part) => {
    // Implement replacement logic here
    console.log(`Replacing ${part}`);
    setShowPopup(false);
  };

  const currentOutfit = generatedOutfits[selectedDay] || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Wardrobe</Text>

      <View style={styles.mainContent}>
        {/* Outfit Preview Section */}
        <View style={styles.outfitSection}>
          <Text style={styles.sectionTitle}>{selectedDay}'s Outfit</Text>
          
          <View style={styles.outfitGrid}>
            {/* Main Clothing Items */}
            <View style={styles.mainItems}>
              <TouchableOpacity 
                style={styles.clothingBoxLarge}
                onPress={() => openImagePopup(currentOutfit.top?.image, 'top')}
              >
                {currentOutfit.top ? (
                  <Image source={{ uri: currentOutfit.top.image }} style={styles.clothingImage} />
                ) : (
                  <Text style={styles.placeholderText}>Top</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.clothingBoxLarge}
                onPress={() => openImagePopup(currentOutfit.bottom?.image, 'bottom')}
              >
                {currentOutfit.bottom ? (
                  <Image source={{ uri: currentOutfit.bottom.image }} style={styles.clothingImage} />
                ) : (
                  <Text style={styles.placeholderText}>Bottom</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Accessories Column */}
            <View style={styles.accessoriesColumn}>
              {['inner', 'baniyan', 'socks'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.accessoryBox}
                  onPress={() => openImagePopup(currentOutfit[type]?.image, type)}
                >
                  {currentOutfit[type] ? (
                    <Image source={{ uri: currentOutfit[type].image }} style={styles.accessoryImage} />
                  ) : (
                    <Text style={styles.placeholderText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Outfit Type Toggle */}
          <View style={styles.toggleContainer}>
            {['formal', 'casual'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.toggleButton,
                  outfitType === type && styles.activeToggle
                ]}
                onPress={() => setOutfitType(type)}
              >
                <Text style={styles.toggleText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Day Selection */}
        <ScrollView 
          horizontal
          contentContainerStyle={styles.daysContainer}
          showsHorizontalScrollIndicator={false}
        >
          {days.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDay
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText
              ]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.laundryButton]}
          onPress={handleMoveToLaundry}
        >
          <Text style={styles.buttonText}>Laundry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.generateButton]}
          onPress={loadCloset}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview Modal */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.imageModal}>
            <Image source={{ uri: popupImageUri }} style={styles.enlargedImage} />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.replaceButton]}
                onPress={() => replaceClothingItem(popupPart)}
              >
                <Text style={styles.buttonText}>Replace</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Laundry Modal */}
      <Modal visible={showLaundryPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.laundryModal}>
            <Text style={styles.modalTitle}>Laundry Management</Text>
            
            <FlatList
              data={laundryItems}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.laundryItem}>
                  <Image source={{ uri: item.image }} style={styles.laundryImage} />
                  <View style={styles.laundryActions}>
                    <TouchableOpacity 
                      style={[styles.laundryActionButton, styles.restoreButton]}
                      onPress={() => handleLaundryAction(item, 'restore')}
                    >
                      <Text style={styles.buttonText}>Keep</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.laundryActionButton, styles.confirmLaundryButton]}
                      onPress={() => handleLaundryAction(item, 'move')}
                    >
                      <Text style={styles.buttonText}>Wash</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowLaundryPopup(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
    marginVertical: 15,
  },
  mainContent: {
    flex: 1,
    marginBottom: 20,
  },
  outfitSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 15,
  },
  outfitGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mainItems: {
    flex: 2,
    marginRight: 10,
  },
  clothingBoxLarge: {
    height: 150,
    backgroundColor: '#dfe6e9',
    borderRadius: 15,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessoriesColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  accessoryBox: {
    height: 70,
    backgroundColor: '#dfe6e9',
    borderRadius: 10,
    marginVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clothingImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  accessoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#636e72',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleButton: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#dfe6e9',
  },
  activeToggle: {
    backgroundColor: '#0984e3',
  },
  toggleText: {
    color: '#2d3436',
    fontWeight: '500',
  },
  daysContainer: {
    paddingVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#dfe6e9',
    marginHorizontal: 5,
  },
  selectedDay: {
    backgroundColor: '#0984e3',
  },
  dayText: {
    color: '#2d3436',
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  laundryButton: {
    backgroundColor: '#d63031',
  },
  generateButton: {
    backgroundColor: '#00b894',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  enlargedImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  replaceButton: {
    backgroundColor: '#fdcb6e',
  },
  closeButton: {
    backgroundColor: '#636e72',
  },
  laundryModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  laundryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  laundryImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  laundryActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  laundryActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  restoreButton: {
    backgroundColor: '#00b894',
  },
  confirmLaundryButton: {
    backgroundColor: '#d63031',
  },
});