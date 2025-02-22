import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { WardrobeContext } from '../App';

const OutfitPicker = () => {
  const [selectedOutfit, setSelectedOutfit] = useState([]);
  const { clothingItems } = useContext(WardrobeContext);

  const generateOutfit = () => {
    // Filter available items (not in laundry)
    const availableItems = clothingItems.filter(
      (item) => item.inLaundry === false
    );

    // Implement your random outfit selection logic here
    // For example, select one top, one bottom, and one accessory randomly
    // Make sure to handle cases where there might not be enough items in a category
    const randomOutfit = []; // Your outfit selection logic

    setSelectedOutfit(randomOutfit);
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Outfit" onPress={generateOutfit} />
      {/* Display the selectedOutfit here */}
      {selectedOutfit.length > 0 && (
        <View>
          <Text>Your Outfit:</Text>
          {selectedOutfit.map((item) => (
            <Text key={item.id}>{item.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OutfitPicker;
