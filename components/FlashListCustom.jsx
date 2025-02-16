// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { RefreshControl , Platform, StatusBar, Dimensions, ScrollView, StyleSheet, View, Image, TouchableOpacity, useAnimatedValue , Linking, Switch  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { useAnimatedScrollHandler, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, interpolate, withTiming} from 'react-native-reanimated';
// import * as AnimatedCustom from 'react-native-reanimated';
import Animated, { useSharedValue , useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
// import { useNavigation } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
// import Slider from '@react-native-community/slider';
const ITEM_SIZE = 220
// import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 50 : 60;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width, height } = Dimensions.get('screen');
// console.log("height",height)

const FlashListCustom = ({ data, logoMap, searchQuery }) => {
  const searchQuery2 = searchQuery || null;
  console.log("searchQuery",searchQuery)
  console.log("searchQuery2",searchQuery2)
  const [refreshing, setRefreshing] = useState(false);
  const flashListRef = useRef(null);
  const fadeAnim = useSharedValue(0); // Initial value for opacity: 0
  // const [isVisible, setIsVisible] = useState(false);
  // Definiamo i range
  // Troviamo il prezzo minimo e massimo
  const minPrice = data[0]?.price || 0;
  const maxPrice = data[data.length - 1]?.price || 0;
  const maxPriceSlide = Math.ceil(maxPrice);
  const lowThreshold = minPrice + (maxPrice - minPrice) * 0.33;
  const highThreshold = minPrice + (maxPrice - minPrice) * 0.66;
  // filter
  const [selectedSource, setSelectedSource] = useState(null);
  const [isTitleFilterActive, setIsTitleFilterActive] = useState(false); // 🔥 Attiva/disattiva il filtro per titolo
  // const [priceRange, setPriceRange] = useState([minPrice, maxPriceSlide]);

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

  // 🔥 Filtriamo i dati in base ai filtri attivi
  const filteredData = data.filter(item => {
    const matchesTitle = isTitleFilterActive ? searchQuery2 ? item.title.toLowerCase().includes(searchQuery2.toLowerCase()) : true : true;
    const matchesSource = selectedSource ? item.source === selectedSource : true;
    // const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

    return matchesTitle && matchesSource;
  });
  
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

     {/* 🌍 Filtri per fonte (Subito, Vinted, ecc.) */}
      <View style={styles.filterButtons}>
       {/* 🔍 Switch per attivare/disattivare il filtro per titolo */}
      <View style={styles.switchContainer}>
        <ThemedText>Filtra per titolo</ThemedText>
          <Switch style={{flex: 1, margin:"auto"}}
          value={isTitleFilterActive}
          onValueChange={setIsTitleFilterActive}
        />
      </View>
        {['SUBITO', 'VESTIAIRE', 'EBAY'].map(source => (
          <TouchableOpacity
            key={source}
            style={[styles.button, selectedSource === source && styles.activeButton]}
            onPress={() => setSelectedSource(selectedSource === source ? null : source)}
          >
            <ThemedText style={styles.buttonText}>{source}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>


      {/* 💰 Slider per il range di prezzo */}
      {/* <ThemedText style={styles.sliderContainer}> */}
        {/* <ThemedText>Prezzo: {priceRange[0]}€ - {priceRange[1]}€</ThemedText> */}
        {/* <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          step={10}
          value={priceRange[0]}
          onValueChange={value => setPriceRange([value, priceRange[1]])}
        />
        <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          step={10}
          value={priceRange[1]}
          onValueChange={value => setPriceRange([priceRange[0], value])}
        /> */}
      {/* </ThemedText> */}

      {/* FlashList */}
      <FlashList
        data={filteredData}
        ref={flashListRef}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 15,
          paddingTop: STATUSBAR_HEIGHT + 170|| 200,
          paddingBottom: STATUSBAR_HEIGHT +60 || 100,
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
          }]}>
              🛍️ {selectedSource==null?data.length:filteredData.length} Articoli trovati
          </ThemedText>
        }
        renderItem={({ item, index }) => {
          return (
          <LinearGradient key={index} colors={['#242728', '#2d2f30']} style={[styles.card]}>
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
             <ThemedText type="defaultSemiBold" numberOfLines={2} ellipsizeMode="tail" style={styles.subCard}>{item.title}</ThemedText>
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
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#2d2f30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
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
        // height: "100%"
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
  button: {
    marginTop:"auto",
    marginBottom: "auto",
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#444',
  },
  activeButton: {
    backgroundColor: '#56a06f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  card: {
    height: ITEM_SIZE,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterButtons: {
    position: 'absolute',
    top: 130,
    right: 10,
    left: 10,
    zIndex: 10,
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});
export default FlashListCustom;
