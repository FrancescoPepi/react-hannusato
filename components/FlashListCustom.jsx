// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { RefreshControl , StatusBar, Dimensions, ScrollView, StyleSheet, View, Image, TouchableOpacity, useAnimatedValue , Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { useAnimatedScrollHandler, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, interpolate, withTiming} from 'react-native-reanimated';
// import * as AnimatedCustom from 'react-native-reanimated';
import Animated, { useSharedValue , useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
// import { useNavigation } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
const ITEM_SIZE = 220
// import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width, height } = Dimensions.get('screen');
// console.log("height",height)

const FlashListCustom = ({ data, logoMap }) => {
  const [refreshing, setRefreshing] = useState(false);
  const flashListRef = useRef(null);
  const fadeAnim = useSharedValue(0); // Initial value for opacity: 0
  const [isVisible, setIsVisible] = useState(false);

// QUESTO FA SI CHE QUANDO ISvISIBILE CABIA AVVIA LA'ANIMAZIONE
  // useEffect(() => {
  //   fadeAnim.value = withTiming(isVisible ? 1 : 0, { duration: 500 }); // 🔥 Avvia l'animazione
  // }, [isVisible]);
  
  useEffect(() => {
    fadeAnim.value = withTiming( 1 ,{ duration: 500 }); // 🔥 Avvia l'animazione
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value, 
  }));

  // Definiamo i range
  const lowThreshold = minPrice + (maxPrice - minPrice) * 0.33;
  const highThreshold = minPrice + (maxPrice - minPrice) * 0.66;
  // Troviamo il prezzo minimo e massimo
  const minPrice = data[0]?.price || 0;
  const maxPrice = data[data.length - 1]?.price || 0;
  // Funzione per andare subito in alto
  const scrollToPosition = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Funzione per determinare il colore
  const getPriceColor = (price) => {
    if (price <= lowThreshold) return "green"; // Fascia bassa
    if (price > lowThreshold && price <= highThreshold) return "orange"; // Fascia media
    return "red"; // Fascia alta
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simula un refresh di 2 secondi
  };
  
  return (
    <Animated.View style={[animatedStyle,{ minHeight: 2, width: width, height: height, padding: 7 }]}>
      {/* Indice della cella visibile */}
      <TouchableOpacity 
        style={styles.touchableUp} 
        onPress={scrollToPosition}
      >
      <ThemedText style={{ color: "white", fontWeight: "bold",padding:8,aspectRatio: 1/1, textAlign:"center" }}>↑</ThemedText>
      </TouchableOpacity>

      {/* FlashList */}
      <FlashList
        data={data}
        ref={flashListRef}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 15,
          paddingTop: StatusBar.currentHeight || 130,
          paddingBottom: StatusBar.currentHeight || 100,
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            progressViewOffset={300} // 🔥 Sposta l'indicatore più in basso
          />
        }
        ListHeaderComponent={
          <ThemedText style={[{
            display: "flex", alignContent: "center", justifyContent: "center", borderWidth: 1, borderColor: '#353738',
          borderRadius: 12, padding:5,
          backgroundColor: '#2d2f30',
        }]}>🛍️ {data.length} Articoli trovati</ThemedText>
        }
        renderItem={({ item, index }) => {
          return (
          <LinearGradient key={index} colors={['#242728', '#2d2f30']} style={[styles.card, styles.cardContainer]}>
           <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
            <Animated.View style={animatedStyle}>
             <View style={styles.cardContent}>
               <Image
                 source={item.picture ? { uri: item.picture } : require('@/assets/images/logo.png')}
                 resizeMode="cover"
                 style={styles.image}
               />
               <View style={styles.infoContainer}>
                 <View style={[styles.badge]}>
                   <ThemedText type="default" style={[styles.stylePrice, { color: getPriceColor(item.price) }]}>
                     € {item.price}
                   </ThemedText>
                 </View>
                 {logoMap[item.source?.toLowerCase()] && (
                   <Image source={logoMap[item.source.toLowerCase()]} resizeMode="contain" style={styles.badge} />
                 )}
               </View>
             </View>
             <ThemedText type="defaultSemiBold" style={styles.subCard}>{item.title}</ThemedText>
             </Animated.View>
           </TouchableOpacity>
         </LinearGradient>
        )}}
        estimatedItemSize={ITEM_SIZE}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .2,
    shadowRadius: 2,
    elevation: 5,
  },
  card: {
      height:ITEM_SIZE,
        padding: 6,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      infoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 20,
      },
    badge: {
        width: "auto",
        height: 40,
        minWidth: 80,
        padding: 2,
        // borderRadius: 25, 
        borderRadius: 12, 
        backgroundColor: '#2d2f30',
        borderWidth: 1, borderColor: '#353738',
    },
    subCard: {
        backgroundColor: '#2d2f30',
        color: '#eeeeee',
        padding: 5,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 3,
        height: "100%"
    },
    stylePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 'auto',
    },
    image: {
        width: "50%",
        aspectRatio: "1.5 / 1",
        borderRadius: 10,
  },
    touchableUp: {
      position: "absolute",
      bottom: 100,
      right: 10,
      backgroundColor: "#56a06f",
      padding: 10,
      borderRadius: 40,
      zIndex: 10,
      aspectRatio: 1 / 1,        
  },
  
});
export default FlashListCustom;
