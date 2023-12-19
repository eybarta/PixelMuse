// import { Text, View } from './Themed';
import { Pressable, Image, StyleSheet } from 'react-native'

interface ImageGalleryItemProps {
  uri: string;
  imagePressHandler?: () => void;
}

const handlePress = () => {
  console.log('pressed')
}

export default function ImageGalleryItem({ uri, imagePressHandler }: ImageGalleryItemProps) {
  return (
    <Pressable style={ [styles.box, styles.boxWrap] } onPress={() => imagePressHandler ? imagePressHandler() : false }>
        <Image style={ styles.box } source={{ uri }} />
      </Pressable>
  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  boxWrap: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 3.3,
    borderColor: 'rgba(0,0,0,0.01)',
    borderRadius: 20,
    overflow: 'hidden'
  },
  box: {
    flex: 1,
    aspectRatio: 1,
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