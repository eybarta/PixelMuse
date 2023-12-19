import React, { useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, KeyboardAvoidingView, Animated, Easing, ActivityIndicator, TouchableWithoutFeedback, Keyboard, StyleSheet, View, Text, TextInput, Button, Image, Alert, Platform, PermissionsAndroid, TouchableOpacity, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useEffect, useRef } from 'react';
import ImageGallery from '../components/ImageGallery'
import { optimizeAndSaveImage, generateImage, fetchInitialImage, fetchStoredImages } from '../services/imageServices';


interface ImageItem {
  secure_url: string;
  [key: string]: any;   // ... include other properties if there are any
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('');
  const [isFullScreen, toggleFullScreen] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState('https://res.cloudinary.com/webkit/image/upload/v1702749902/generated/jq3gn629brgtzw8rllyc.png');
  const [storedImages, updateStoredImages] = useState<ImageItem[]>([]);
  const [isGalleryActive, toggleGallery] = useState(false)

  const mappedImages = useMemo(() => {
    if (storedImages.length) {
      return storedImages.map(item => item?.secure_url);
    }
    return []
  }, [storedImages]);

// UI
  const imageFadeAnim = useRef(new Animated.Value(0)).current;
  const floatingBarFadeAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = (el: Animated.Value, duration: number = 369) => {
    Animated.timing(el, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = (el: Animated.Value, duration: number = 369) => {
    Animated.timing(el, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };

  // Set initial background image
  useEffect(() => {
    const initializeApp = async () => {
      const storedImages = await fetchStoredImages('generated')
      updateStoredImages(storedImages)
      const initialImage = await fetchInitialImage(storedImages)
      setBackgroundImage(initialImage)
    }
    // Promise.all([fetchStoredImages('generated'), setInitialImage()])
    // .catch(error => console.error('Failed to fetch and set initial images: ', error))
    Promise.resolve(initializeApp())
    .catch(error => console.error('Failed to fetch and set initial images: ', error))
  }, [])

  // Fade in background image
  useEffect(() => {
    fadeIn(imageFadeAnim);
  }, [backgroundImage]);

  const handleGenerateAndSetImage = async () => {
    setLoading(true)
    fadeOut(floatingBarFadeAnim)
    const generatedImg = await generateImage(inputText)
    if (generatedImg) {
      const imageUrl = await optimizeAndSaveImage(generatedImg)
      setBackgroundImage(imageUrl) 
   }
   setInputText('')
   setLoading(false)

  }

  // BG 
  const handleBackgroundPress = async () => {
    Keyboard.dismiss()
    console.log('1 isFullScreen: ', isFullScreen);
    await toggleFullScreen(!isFullScreen)
    if (isFullScreen) {
      fadeOut(floatingBarFadeAnim)
    } else {
      fadeIn(floatingBarFadeAnim)
    }
    console.log('2 isFullScreen: ', isFullScreen);

    // Code to save image and set as wallpaper
    // This will be platform-specific and may require additional libraries or native modules
    // Alert.alert('Success', 'Wallpaper has been set!');
  };

  const handleGalleryPress = (imageUrl: string) => {
    setBackgroundImage(imageUrl)
    toggleGallery(false)
  }
  const galleryIconClickHandler = () => {
    toggleGallery(!isGalleryActive)
  }
  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
    <View style={styles.container}>
      <Pressable onPress={() => handleBackgroundPress() } style={styles.container}>
        {loading ? (
          <ActivityIndicator color="#d0d0d0" style={styles.preloader} size="large"  />
        ) : (
          <Animated.Image
            source={{ uri: backgroundImage }}
            style={[
              styles.backgroundImage,
              { opacity: imageFadeAnim } // Apply the move animation, transform: [{ translateX: moveAnim }]
            ]}
            resizeMode="cover" 
          />
        )}
      </Pressable>
          
          <Animated.View style={[
            styles.overlay,
            { opacity: floatingBarFadeAnim } // Apply the move animation, transform: [{ translateX: moveAnim }]
          ]}>
            <TextInput
              style={styles.input}
              onChangeText={setInputText}
              value={inputText}
              placeholder="Enter a prompt"
              placeholderTextColor="rgba(255,255,255,0.8)"
            />
            <TouchableOpacity style={styles.button} onPress={handleGenerateAndSetImage}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
          </Animated.View>
    </View>
    {
      storedImages.length ? (
        <ImageGallery style={styles.overlayGallery} isActive={isGalleryActive} images={mappedImages} galleryPressHandler={ handleGalleryPress }></ImageGallery>
        ) : null
      }
      {
      storedImages.length ? (
        <Pressable  onPress={ galleryIconClickHandler } style={[styles.flexCenter, styles.galleryIcon]}>
          <MaterialCommunityIcons name={ isGalleryActive ? "window-close" :"image-search-outline"} size={24} color="white" />
        </Pressable>
        ) : null
      }
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    width: '100%'
  },
  backgroundImage: {
    height: '100%',
    width: "100%",
  },
  preloader: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: "#202020"
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    paddingVertical: 20
  },
  overlayGallery: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(11,11,11,0.2)'
  },
  galleryIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 1,
    padding: 2,
    backgroundColor: 'rgba(9,9,9,0.5)',
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 2,
    paddingHorizontal: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: 'rgba(11,11,11,0.5)',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});