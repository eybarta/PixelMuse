import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.variables.netlifyBaseUrl;
const OPENAI_API_KEY = Constants.variables.openaiApiKey;
const GENERATE_API = Constants.variables.openaiGenerateApi;
const DEFAULT_BG = "/assets/images/default-muse-bg.jpg"
// Function to save the image URL to image array in local cache
async function saveImageUrlToLocalCache(imageUrl: string) {
  try {
    const existingData = await AsyncStorage.getItem('bgImages');
    let newData = existingData ? JSON.parse(existingData) : {};
    const newKey = `bg-${Object.keys(newData).length + 1}`;
    newData[newKey] = imageUrl;
    await AsyncStorage.setItem('bgImages', JSON.stringify(newData));
    const updatedItems = await AsyncStorage.getItem('bgImages');
    return updatedItems
  } catch (error) {
    console.error('Error saving image URL:', error);
  }
}

// OPTIMIZE AND SAVE TO CLOUDINARY (Using Netlify function)
export const optimizeAndSaveImage = async(imgUrl: string) => {
  const response = await fetch(`${API_URL}/cloudinary-save?imageUrl=${imgUrl}`)
  const data = await response.json()
  saveImageUrlToLocalCache(data.imageUrl)
  return data?.imageUrl;
}

export const generateImage = async (inputText: string) => {
  try {
    const response = await axios.post(GENERATE_API,
      {
        prompt: inputText,
        n: 1,
        size: "1024x1792",
        model: "dall-e-3"
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const imageUrl = response.data.data[0].url; // Modify according to the actual response structure
    console.log('##home imageUrl: ', imageUrl);
    return imageUrl
  } catch (e) {
    console.error("Error generating image: >> ", e)
  }
};

export const fetchInitialImage = async (storedImages: string[]) => {
  try {
    const bgItems = await AsyncStorage.getItem('bgImages');
    if (bgItems) {
      const parsedItems = JSON.parse(bgItems)
      const itemKey = `bg-${Object.keys(parsedItems).length}`;
      return parsedItems[itemKey]
    } 
    else if (storedImages.length) {
      const randomIndex = Math.floor(Math.random() * storedImages.length)
      return storedImages[randomIndex]
    }
    return DEFAULT_BG
  }
  catch (error) {
    console.error("Error fetching initial image: ", error)
    return DEFAULT_BG
  }
}
export const fetchStoredImages = async (folder?: string) => {
  const response = await fetch(`${API_URL}/cloudinary-fetch-images?${folder ? `folder=${folder}` : ''}`)
  const data = await response.json()
  return data?.images || [];
}
