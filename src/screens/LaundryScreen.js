import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet, 
  Alert, 
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function LaundryScreen({ navigation }) {
  const [laundryItems, setLaundryItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadLaundryItems();
  }, []);

  const loadLaundryItems = async () => {
    try {
      const data = await AsyncStorage.getItem('wardrobe');
      if (data) {
        const items = JSON.parse(data);
        // Filter items that are in laundry
        const laundry = items.filter(item => item.laundryStatus);
        setLaundryItems(laundry);
      }
    } catch (error) {
      console.error('Error loading laundry items:', error);
    }
  };

  // Toggle selection for an item
  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // When done with laundry, update the items: reset laundryStatus and restore wearCount
  const doneLaundry = async () => {
    try {
      const data = await AsyncStorage.getItem('wardrobe');
      if (data) {
        const items = JSON.parse(data);
        const updatedItems = items.map(item => {
          if (selectedIds.includes(item.id)) {
            return { 
              ...item, 
              laundryStatus: false,
              // Reset wearCount using initialWearCount if available, else keep current
              wearCount: item.initialWearCount ? item.initialWearCount : item.wearCount 
            };
          }
          return item;
        });
        await AsyncStorage.setItem('wardrobe', JSON.stringify(updatedItems));
        setSelectedIds([]);
        loadLaundryItems();
        Alert.alert("Laundry Completed", "Selected items have been moved back to your wardrobe.");
      }
    } catch (error) {
      console.error('Error updating laundry items:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity 
        style={[styles.itemContainer, isSelected && styles.itemSelected]} 
        onPress={() => toggleSelection(item.id)}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
        <Text style={styles.itemText}>{item.properties.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laundry</Text>
      <FlatList 
        data={laundryItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
      {laundryItems.length > 0 && (
        <TouchableOpacity style={styles.doneButton} onPress={doneLaundry}>
          <Text style={styles.doneButtonText}>Done Laundry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 100,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8,
    width: (screenWidth - 40) / 3,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  itemText: {
    marginTop: 5,
    fontSize: 14,
    color: '#374151',
  },
  doneButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
