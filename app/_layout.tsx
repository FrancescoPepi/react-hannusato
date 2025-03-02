// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }


import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, Image, StyleSheet } from 'react-native';
import  Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import "../global.css"

// Impedisce che la splash screen si chiuda automaticamente
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Animazioni
  const opacity = useSharedValue(0);
  // const scale = useSharedValue(1.5); //originale
  const scale = useSharedValue(2);

  useEffect(() => {
    if (loaded) {
      // console.log("Font caricati, avvio animazione...");

      // opacity.value = withTiming(1, { duration: 1500 }); // originale
      // scale.value = withTiming(1, { duration: 1500 }); // originale
      opacity.value = withTiming(1, { duration: 1500 });
      scale.value = withTiming(1, { duration: 1500 });

      setTimeout(() => {
        // console.log("Animazione terminata, carico l'app...");
        setAppReady(true);
      }, 2000);
    } else {
      
      // SplashScreen.hideAsync(); // Nasconde la splash di Expo dopo l'animazione
    }
  }, [loaded]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!appReady) {
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
  

  // Quando l'app è pronta, mostra la navigazione
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgba(0, 0, 0, 0)' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  logo: {
    width: 150,
    height: 150,
  },
});
