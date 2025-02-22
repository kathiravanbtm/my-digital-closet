import React, { useState, useContext } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { WardrobeContext } from '../App';

const ClothingItem = ({ item }) => {
  const { supabase, clothingItems, setClothingItems } =
    useContext(WardrobeContext);

  const handleLaundryToggle = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .update({ inLaundry: !item.inLaundry })
        .eq('id', item.id);

      if (error) {
        console.log(error);
      } else {
        // Update the item in the local state
        setClothingItems(
          clothingItems.map((clothingItem) =>
            clothingItem.id === item.id
              ? { ...clothingItem, inLaundry: !item.inLaundry }
              : clothingItem
          )
        );
      }
    } catch (error) {
      console.log('Error updating laundry status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text>{item.name}</Text>
      <Button
        title={item.inLaundry ? 'Mark as Available' : 'Send to Laundry'}
        onPress={handleLaundryToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});

export default ClothingItem;
