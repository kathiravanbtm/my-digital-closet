import AsyncStorage from '@react-native-async-storage/async-storage';

// Basic storage functions
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return { success: true };
  } catch (error) {
    console.error("Error saving data", error);
    return { success: false, error };
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data", error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error("Error removing data", error);
    return { success: false, error };
  }
};

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all keys", error);
    return [];
  }
};

// Digital Closet specific storage functions
export const saveClothingItem = async (item) => {
  const key = `clothing_${item.id}`;
  return await saveData(key, item);
};

export const getClothingItem = async (id) => {
  const key = `clothing_${id}`;
  return await getData(key);
};

export const getAllClothingItems = async () => {
  try {
    const keys = await getAllKeys();
    const clothingKeys = keys.filter(key => key.startsWith('clothing_'));
    const items = await Promise.all(
      clothingKeys.map(key => getData(key))
    );
    return items.filter(item => item !== null);
  } catch (error) {
    console.error("Error getting all clothing items", error);
    return [];
  }
};

export const removeClothingItem = async (id) => {
  const key = `clothing_${id}`;
  return await removeData(key);
};

export const saveOutfit = async (outfit) => {
  const key = `outfit_${outfit.id}`;
  return await saveData(key, outfit);
};

export const getOutfit = async (id) => {
  const key = `outfit_${id}`;
  return await getData(key);
};

export const getAllOutfits = async () => {
  try {
    const keys = await getAllKeys();
    const outfitKeys = keys.filter(key => key.startsWith('outfit_'));
    const outfits = await Promise.all(
      outfitKeys.map(key => getData(key))
    );
    return outfits.filter(outfit => outfit !== null);
  } catch (error) {
    console.error("Error getting all outfits", error);
    return [];
  }
};

export const removeOutfit = async (id) => {
  const key = `outfit_${id}`;
  return await removeData(key);
};

export const saveWornHistory = async (history) => {
  return await saveData('worn_history', history);
};

export const getWornHistory = async () => {
  return await getData('worn_history') || [];
};

export const addWornItem = async (itemId, date = new Date().toISOString()) => {
  try {
    const history = await getWornHistory();
    const newEntry = { itemId, date };
    history.push(newEntry);
    return await saveWornHistory(history);
  } catch (error) {
    console.error("Error adding worn item", error);
    return { success: false, error };
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return { success: true };
  } catch (error) {
    console.error("Error clearing all data", error);
    return { success: false, error };
  }
};

// Helper function to generate unique IDs
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};