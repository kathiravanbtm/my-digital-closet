import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { WardrobeContext } from "../../context/WardrobeContext";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const { supabase } = useContext(WardrobeContext);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    try {
      const fileName = image.split('/').pop();
      const response = await fetch(image);
      const blob = await response.blob();

      let { error } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, blob, {
          upsert: true,
        });

      if (error) {
        console.log(error);
      } else {
        // Image uploaded successfully
        alert('Image uploaded!');
        setImage(null); // Clear the image preview
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Button title="Upload Image" onPress={uploadImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});

export default ImageUploader;
