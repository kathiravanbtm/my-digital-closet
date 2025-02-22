import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function WardrobeScreen({ navigation }) {
  // Wardrobe items and tags
  const [wardrobe, setWardrobe] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  // Predefined tags
  const [tags, setTags] = useState([
    'Shirt',
    'T-Shirt',
    'Trousers',
    'Pant',
    'Track Pant',
  ]);

  // States for adding a new dress
  const [pendingImageUri, setPendingImageUri] = useState(null);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  // Dress properties
  const [category, setCategory] = useState('');
  const [dressStyle, setDressStyle] = useState('casual'); // "casual" or "formal"
  const [count, setCount] = useState('');
  const [dressName, setDressName] = useState('');
  const [modalTag, setModalTag] = useState(tags[0] || '');

  // States for editing an existing dress
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDressStyle, setEditDressStyle] = useState('casual');
  const [editCount, setEditCount] = useState('');
  const [editDressName, setEditDressName] = useState('');
  const [editModalTag, setEditModalTag] = useState(tags[0] || '');

  // State for adding a new tag
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Load existing wardrobe from AsyncStorage
  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      const storedWardrobe = await AsyncStorage.getItem('wardrobe');
      if (storedWardrobe) {
        setWardrobe(JSON.parse(storedWardrobe));
      }
    } catch (error) {
      console.error('Error loading wardrobe:', error);
    }
  };

  const saveWardrobe = async (updatedWardrobe) => {
    try {
      await AsyncStorage.setItem('wardrobe', JSON.stringify(updatedWardrobe));
      setWardrobe(updatedWardrobe);
    } catch (error) {
      console.error('Error saving wardrobe:', error);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.assets || result.assets.length === 0) return;

    setPendingImageUri(result.assets[0].uri);
    // Reset fields for new item
    setCategory('');
    setDressStyle('casual');
    setCount('');
    setDressName('');
    setModalTag(tags[0] || '');
    setShowPropertiesModal(true);
  };

  // Launch camera directly
  const handleLaunchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      setPendingImageUri(result.assets[0].uri);
      // Reset fields for new item
      setCategory('');
      setDressStyle('casual');
      setCount('');
      setDressName('');
      setModalTag(tags[0] || '');
      setShowPropertiesModal(true);
    }
  };

  // Confirm new dress properties and add the item
  const confirmNewProperties = () => {
    const properties = {
      dressStyle,
      count: parseInt(count) || 0,
      name: dressName,
      tag: modalTag,
    };
    const newItem = {
      id: Date.now(),
      image: pendingImageUri,
      // Save the explicit category
      category: category.toLowerCase().trim(),
      wearCount: parseInt(count) || 1,
      laundryStatus: false,
      properties,
    };
    const updatedWardrobe = [...wardrobe, newItem];
    saveWardrobe(updatedWardrobe);
    setShowPropertiesModal(false);
    setPendingImageUri(null);
  };

  // Edit existing item
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditDressStyle(item.properties.dressStyle);
    setEditCount(item.properties.count.toString());
    setEditDressName(item.properties.name);
    setEditModalTag(item.properties.tag);
    setShowEditModal(true);
  };

  const confirmEditProperties = () => {
    const updatedProperties = {
      dressStyle: editDressStyle,
      count: parseInt(editCount) || 0,
      name: editDressName,
      tag: editModalTag,
    };
    const updatedItem = {
      ...editingItem,
      // You could let the user edit category if needed
      category: editingItem.category,
      tag: editModalTag,
      properties: updatedProperties,
    };
    const updatedWardrobe = wardrobe.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveWardrobe(updatedWardrobe);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const deleteClothingItem = async (itemId) => {
    const updatedWardrobe = wardrobe.filter((item) => item.id !== itemId);
    saveWardrobe(updatedWardrobe);
    setShowEditModal(false);
    setEditingItem(null);
  };

  // Filter wardrobe by selected tag if one is selected
  const filteredWardrobe = selectedTag
    ? wardrobe.filter((item) => item.properties?.tag === selectedTag)
    : wardrobe;

  // For displaying items in a grid (3 columns)
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>

      {/* Horizontal tag selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagContainer}
      >
        <View style={{ width: 10 }} />
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tagButton, selectedTag === tag && styles.selectedTag]}
            onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
          >
            <Text style={[styles.tagText, selectedTag === tag && styles.selectedTagText]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Add Tag Button */}
        <TouchableOpacity style={styles.addTagButton} onPress={() => setShowAddTagModal(true)}>
          <Text style={styles.addTagButtonText}>+</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
      </ScrollView>

      {/* Wardrobe grid (3 columns) */}
      <FlatList
        data={filteredWardrobe}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.wardrobeGrid}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.clothingImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Buttons (Gallery and Camera) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={pickImage}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={handleLaunchCamera}>
          <Text style={styles.fabText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding new dress properties */}
      <Modal transparent visible={showPropertiesModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Dress Properties</Text>

            {/* Category Input */}
            <Text style={styles.inputLabel}>Category (top, inner, bottom)</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Enter category (e.g., top)"
            />

            {/* Dress Style Toggle */}
            <Text style={styles.inputLabel}>Dress Style</Text>
            <View style={styles.styleSelector}>
              <TouchableOpacity
                style={[styles.styleButton, dressStyle === 'casual' && styles.selectedStyleButton]}
                onPress={() => setDressStyle('casual')}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    dressStyle === 'casual' && styles.selectedStyleButtonText,
                  ]}
                >
                  Casual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.styleButton, dressStyle === 'formal' && styles.selectedStyleButton]}
                onPress={() => setDressStyle('formal')}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    dressStyle === 'formal' && styles.selectedStyleButtonText,
                  ]}
                >
                  Formal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Count Input */}
            <Text style={styles.inputLabel}>Count</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={count}
              onChangeText={setCount}
              placeholder="Enter wear count"
            />

            {/* Dress Name Input */}
            <Text style={styles.inputLabel}>Dress Name</Text>
            <TextInput
              style={styles.input}
              value={dressName}
              onChangeText={setDressName}
              placeholder="Enter dress name"
            />

            {/* Tag Selector */}
            <Text style={styles.inputLabel}>Select Tag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagButton, modalTag === tag && styles.selectedTag]}
                  onPress={() => setModalTag(tag)}
                >
                  <Text style={[styles.tagText, modalTag === tag && styles.selectedTagText]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowPropertiesModal(false);
                  setPendingImageUri(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={confirmNewProperties}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for editing an existing dress */}
      <Modal transparent visible={showEditModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Dress Properties</Text>

            {/* Dress Style Toggle */}
            <Text style={styles.inputLabel}>Dress Style</Text>
            <View style={styles.styleSelector}>
              <TouchableOpacity
                style={[
                  styles.styleButton,
                  editDressStyle === 'casual' && styles.selectedStyleButton,
                ]}
                onPress={() => setEditDressStyle('casual')}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    editDressStyle === 'casual' && styles.selectedStyleButtonText,
                  ]}
                >
                  Casual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.styleButton,
                  editDressStyle === 'formal' && styles.selectedStyleButton,
                ]}
                onPress={() => setEditDressStyle('formal')}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    editDressStyle === 'formal' && styles.selectedStyleButtonText,
                  ]}
                >
                  Formal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Count Input */}
            <Text style={styles.inputLabel}>Count</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={editCount}
              onChangeText={setEditCount}
              placeholder="Enter wear count"
            />

            {/* Dress Name Input */}
            <Text style={styles.inputLabel}>Dress Name</Text>
            <TextInput
              style={styles.input}
              value={editDressName}
              onChangeText={setEditDressName}
              placeholder="Enter dress name"
            />

            {/* Tag Selector */}
            <Text style={styles.inputLabel}>Select Tag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagButton, editModalTag === tag && styles.selectedTag]}
                  onPress={() => setEditModalTag(tag)}
                >
                  <Text style={[styles.tagText, editModalTag === tag && styles.selectedTagText]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (editingItem) deleteClothingItem(editingItem.id);
                }}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={confirmEditProperties}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for adding a new tag */}
      <Modal transparent visible={showAddTagModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Tag</Text>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Enter new tag"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAddTagModal(false);
                  setNewTag('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (newTag.trim() !== '') {
                    setTags([...tags, newTag.trim()]);
                  }
                  setShowAddTagModal(false);
                  setNewTag('');
                }}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================
// STYLES
// =====================
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // Minimizing top/bottom padding so tags and images start near the top
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  // Tag row at the top
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#DDD',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTag: {
    backgroundColor: '#6200EE',
  },
  tagText: {
    fontSize: 16,
    color: '#000',
  },
  selectedTagText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  addTagButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  addTagButtonText: {
    fontSize: 20,
    color: '#000',
  },
  // Wardrobe grid
  wardrobeGrid: {
    paddingBottom: 100,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8,
    // 3 images per row
    width: (screenWidth - 40) / 3,
  },
  clothingImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  // Floating Action Buttons
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
  fab: {
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  styleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  styleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  selectedStyleButton: {
    backgroundColor: '#6200EE',
  },
  styleButtonText: {
    fontSize: 14,
    color: '#000',
  },
  selectedStyleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
