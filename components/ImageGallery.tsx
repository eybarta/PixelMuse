import { Text, View } from './Themed';
import { Dimensions, FlatList, StyleSheet, Animated, Easing } from 'react-native'

import ImageGalleryItem from './ImageGalleryItem'
import { useEffect, useRef, useState } from 'react';

interface ImageGalleryProps {
  style: object;
  images: string[];
  isActive: boolean;
  galleryPressHandler: (image: string) => void
}


export default function ImageGallery({ images, isActive, style, galleryPressHandler }: ImageGalleryProps) {
  const screenHeight = Dimensions.get('window').height;
  console.log('screenHeight: ', screenHeight);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeGalleryIn = (duration: number = 369) => {
    console.log('fadeGalleryIn opacity: ', opacity);
    // Will change imagefadeGalleryAnim value to 1 in 500ms
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true, // Add this line
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      easing: Easing.elastic(0.9),
      useNativeDriver: true, // Add this line
    }).start();

  };
  const fadeGalleryOut = ( duration: number = 369) => {
    // Will change el value to 1 in 500ms
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: Easing.elastic(0.9),
      useNativeDriver: true, // Add this line
    }).start();
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration,
      easing: Easing.bounce,
      useNativeDriver: true, // Add this line
    }).start();
  };
  useEffect(() => {
    if (isActive) {
      fadeGalleryIn(633);
    } else {
      fadeGalleryOut(633);

    }
  }, [isActive]);
  return (
    <Animated.View style={[{ ...style }, { opacity, transform: [{ translateY }] }]}>
      <FlatList
        data={images}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.column}
        numColumns={2}
        renderItem={({ item }) => <ImageGalleryItem imagePressHandler={ () =>galleryPressHandler(item) } uri={ item } key={ item } />}
      />
    </Animated.View>
  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  box: {
    backgroundColor: '#F9EDE3',
    flex: 1,
    aspectRatio: 1,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9b4521',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: 10,
    padding: 10,
  },
  column: {
    gap: 10,
  },
});