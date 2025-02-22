import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getData, saveData } from '../utils/storage';
import { generateWeeklyOutfits, updateWardrobeAfterOutfits } from '../services/outfitEngine';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function OutfitGeneratorScreen({ navigation }) {
  const [wardrobe, setWardrobe] = useState([]);
  const [weeklyOutfits, setWeeklyOutfits] = useState({});

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    const data = await getData('wardrobe');
    if (data) {
      setWardrobe(data);
      const outfits = generateWeeklyOutfits(data);
      setWeeklyOutfits(outfits);
    }
  };

  const confirmOutfits = async () => {
    const updatedWardrobe = updateWardrobeAfterOutfits(wardrobe, weeklyOutfits);
    await saveData('wardrobe', updatedWardrobe);
    setWardrobe(updatedWardrobe);
    Alert.alert("Outfits Confirmed", "Used items have been updated.");
    navigation.navigate('Laundry');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Outfit Plan</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const outfit = weeklyOutfits[item];
          return (
            <View style={styles.outfitCard}>
              <Text style={styles.dayText}>{item}</Text>
              {outfit ? (
                <View>
                  <Text>Top: {outfit.top ? outfit.top.properties?.name || outfit.top.category : 'N/A'}</Text>
                  <Text>Bottom: {outfit.bottom ? outfit.bottom.properties?.name || outfit.bottom.category : 'N/A'}</Text>
                  <Text>Footwear: {outfit.footwear ? outfit.footwear.properties?.name || outfit.footwear.category : 'N/A'}</Text>
                </View>
              ) : (
                <Text>No outfit available</Text>
              )}
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={confirmOutfits}>
        <Text style={styles.buttonText}>Confirm Outfits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Wardrobe</Text>
      </TouchableOpacity>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  outfitCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
  dayText: { fontSize: 18, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#10B981', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  backButton: { backgroundColor: '#6B7280', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
