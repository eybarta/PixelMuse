import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/pixel-muse-splash.mp4')}
        rate={1.0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={styles.videoWrap}
        videoStyle={styles.video}
      />
      {/* Your other splash screen content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrap: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    height: '100%',
    flex: 1,
    position: 'static',
    left: "auto"
  }
});

export default SplashScreen;
