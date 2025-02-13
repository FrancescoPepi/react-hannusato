import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  // Valori animati
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1.5);

  useEffect(() => {
    // Avvia animazione
    opacity.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
    scale.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });

    // Naviga alla home dopo 2s
    setTimeout(() => {
      router.replace('/home'); // Assumi che la tua home sia in /home
    }, 2000);
  }, []);

  // Stile animato
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

//  if (!appReady) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <Animated.Image
          source={require('../assets/images/logo/logoMini.png')}
          style={[styles.logo, animatedStyle]}
          resizeMode="contain"
        />
      </View>
    );
  }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Cambia il colore di sfondo
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
