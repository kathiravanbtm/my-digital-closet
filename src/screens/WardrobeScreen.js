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

const screenWidth = Dimensions.get("window").width;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Example outfit generation function (replace with your dynamic logic)

export default function WardrobeScreen({ navigation }) {
  // Global wardrobe and filtering tags (for the grid)
  const [wardrobe, setWardrobe] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  // User-editable tags (for filtering the grid)
  const [tags, setTags] = useState(["tshirt", "shirt", "pant", "shorts", "trackpant", "lungi"]);

  // ---- Properties Modal (Add & Edit) States ----
  // For Add mode:
  const [pendingImageUri, setPendingImageUri] = useState(null);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [dressName, setDressName] = useState('');
  const [dressStyle, setDressStyle] = useState('casual'); // "casual" or "formal"
  const [count, setCount] = useState('');
  // Fixed Categories (cannot be created by user)
  const fixedCategories = ["top", "bottom", "inner", "shorts", "baniyan", "socks"];
  const [modalCategory, setModalCategory] = useState("top"); // default fixed category
  // Tag selection from user-editable tags
  const [modalTag, setModalTag] = useState(tags[0] || "tshirt");

  // For Edit mode:
  const [editingItem, setEditingItem] = useState(null);
  const [editDressName, setEditDressName] = useState('');
  const [editDressStyle, setEditDressStyle] = useState('casual');
  const [editCount, setEditCount] = useState('');
  const [editCategory, setEditCategory] = useState("top");
  const [editTag, setEditTag] = useState("tshirt");

  // Popup Modal for enlarged image preview
  const [popupImageUri, setPopupImageUri] = useState(null);
  const [popupPart, setPopupPart] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // (Optional) Generated outfits state if needed later
  const [generatedOutfits, setGeneratedOutfits] = useState({});

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
    // Reset fields for Add mode
    setDressName('');
    setDressStyle('casual');
    setCount('');
    setModalCategory("top");
    setModalTag(tags[0] || "tshirt");
    setEditingItem(null);
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
      // Reset fields for Add mode
      setDressName('');
      setDressStyle('casual');
      setCount('');
      setModalCategory("top");
      setModalTag(tags[0] || "tshirt");
      setEditingItem(null);
      setShowPropertiesModal(true);
    }
  };

  // Confirm new dress properties (Add mode)
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
      // Use custom category input if provided; otherwise, use fixed category selection
      category: modalCategory.toLowerCase().trim(),
      wearCount: parseInt(count) || 1,
      laundryStatus: false,
      properties,
    };
    const updatedWardrobe = [...wardrobe, newItem];
    saveWardrobe(updatedWardrobe);
    setShowPropertiesModal(false);
    setPendingImageUri(null);
  };

  // Open Edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditDressName(item.properties.name);
    setEditDressStyle(item.properties.dressStyle);
    setEditCount(item.properties.count.toString());
    setEditCategory(item.category);
    setEditTag(item.properties.tag);
    setShowPropertiesModal(true);
  };

  // Confirm update (Edit mode)
  const confirmEditProperties = () => {
    const updatedProperties = {
      dressStyle: editDressStyle,
      count: parseInt(editCount) || 0,
      name: editDressName,
      tag: editTag,
    };
    const updatedItem = {
      ...editingItem,
      category: editCategory.toLowerCase().trim(),
      properties: updatedProperties,
    };
    const updatedWardrobe = wardrobe.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveWardrobe(updatedWardrobe);
    setShowPropertiesModal(false);
    setEditingItem(null);
  };

  const deleteClothingItem = async (itemId) => {
    const updatedWardrobe = wardrobe.filter((item) => item.id !== itemId);
    saveWardrobe(updatedWardrobe);
    setShowPropertiesModal(false);
    setEditingItem(null);
  };

  // Filter wardrobe for grid display based on tag (from tag selector at top)
  const filteredWardrobe = selectedTag
    ? wardrobe.filter((item) => item.properties?.tag === selectedTag)
    : wardrobe;

  // Popup handler for enlarged image preview
  const openPopup = (uri, part) => {
    if (uri) {
      setPopupImageUri(uri);
      setPopupPart(part);
      setShowPopup(true);
    }
  };

  // Placeholder replace function
  const replaceDress = (part) => {
    console.log(`Replace dress for: ${part}`);
    setShowPopup(false);
  };

  // (Optional) generatedOutfits state if needed
  // const currentOutfit = generatedOutfits[selectedDay];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>

      {/* Horizontal Tag Selector for Filtering */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagContainer}>
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
        <TouchableOpacity style={styles.addTagButton} onPress={() => setShowAddTagModal(true)}>
          <Text style={styles.addTagButtonText}>+</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
      </ScrollView>

      {/* Wardrobe Grid */}
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

      {/* Floating Action Buttons for Gallery and Camera */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={pickImage}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={handleLaunchCamera}>
          <Text style={styles.fabText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Adding/Editing Dress Properties */}
      <Modal transparent visible={showPropertiesModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingItem ? "Edit Dress Properties" : "Enter Dress Properties"}</Text>

            {/* Dress Name Input */}
            <Text style={styles.inputLabel}>Dress Name</Text>
            <TextInput
              style={styles.input}
              value={editingItem ? editDressName : dressName}
              onChangeText={editingItem ? setEditDressName : setDressName}
              placeholder="Enter dress name"
            />

            {/* Dress Style Toggle */}
            <Text style={styles.inputLabel}>Dress Style</Text>
            <View style={styles.styleSelector}>
              <TouchableOpacity
                style={[styles.styleButton, (editingItem ? editDressStyle : dressStyle) === 'casual' && styles.selectedStyleButton]}
                onPress={() => editingItem ? setEditDressStyle('casual') : setDressStyle('casual')}
              >
                <Text style={[styles.styleButtonText, (editingItem ? editDressStyle : dressStyle) === 'casual' && styles.selectedStyleButtonText]}>
                  Casual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.styleButton, (editingItem ? editDressStyle : dressStyle) === 'formal' && styles.selectedStyleButton]}
                onPress={() => editingItem ? setEditDressStyle('formal') : setDressStyle('formal')}
              >
                <Text style={[styles.styleButtonText, (editingItem ? editDressStyle : dressStyle) === 'formal' && styles.selectedStyleButtonText]}>
                  Formal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Count Input */}
            <Text style={styles.inputLabel}>Count</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={editingItem ? editCount : count}
              onChangeText={editingItem ? setEditCount : setCount}
              placeholder="Enter wear count"
            />

            {/* Category Selector (Fixed Values) */}
            <Text style={styles.inputLabel}>Select Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {["top", "bottom", "inner", "socks", "baniyan", "shorts"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.tagButton, (editingItem ? editCategory : modalCategory) === cat && styles.selectedTag]}
                  onPress={() => editingItem ? setEditCategory(cat) : setModalCategory(cat)}
                >
                  <Text style={[styles.tagText, (editingItem ? editCategory : modalCategory) === cat && styles.selectedTagText]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tag Selector (User Editable) */}
            <Text style={styles.inputLabel}>Select Tag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagButton, (editingItem ? editTag : modalTag) === tag && styles.selectedTag]}
                  onPress={() => editingItem ? setEditTag(tag) : setModalTag(tag)}
                >
                  <Text style={[styles.tagText, (editingItem ? editTag : modalTag) === tag && styles.selectedTagText]}>
                    {tag.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              {editingItem && (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => { if (editingItem) deleteClothingItem(editingItem.id); }}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => { editingItem ? confirmEditProperties() : confirmNewProperties(); }}
              >
                <Text style={styles.modalButtonText}>{editingItem ? "Update" : "Confirm"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => { setShowPropertiesModal(false); setEditingItem(null); setPendingImageUri(null); }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Popup Modal for Enlarged Image with Replace and Close Buttons */}
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
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#DDD",
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTag: {
    backgroundColor: "#6200EE",
  },
  tagText: {
    fontSize: 16,
    color: "#000",
  },
  selectedTagText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  addTagButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
  },
  addTagButtonText: {
    fontSize: 20,
    color: "#000",
  },
  wardrobeGrid: {
    paddingBottom: 100,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    padding: 8,
    width: (screenWidth - 40) / 3,
  },
  clothingImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
  },
  fab: {
    backgroundColor: "#6200EE",
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
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
  outfitPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  accessoryContainer: {
    // Accessory boxes on far left
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  styleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  styleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#DDD",
  },
  selectedStyleButton: {
    backgroundColor: "#6200EE",
  },
  styleButtonText: {
    fontSize: 14,
    color: "#000",
  },
  selectedStyleButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#6200EE",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
