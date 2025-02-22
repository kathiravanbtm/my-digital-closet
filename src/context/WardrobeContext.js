import React, { createContext, useState } from 'react';

export const WardrobeContext = createContext();

export const WardrobeProvider = ({ children }) => {
  // State to hold an array of clothing items
  const [clothingItems, setClothingItems] = useState([]);

  // Function to add a new clothing item to the wardrobe
  const addClothingItem = (item) => {
    setClothingItems((prevItems) => [...prevItems, item]);
  };

  // Function to remove a clothing item by its id
  const removeClothingItem = (itemId) => {
    setClothingItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  // Function to update an existing clothing item
  const updateClothingItem = (updatedItem) => {
    setClothingItems((prevItems) =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  return (
    <WardrobeContext.Provider
      value={{ clothingItems, addClothingItem, removeClothingItem, updateClothingItem }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};
