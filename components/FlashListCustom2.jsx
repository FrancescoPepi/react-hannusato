// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Text, RefreshControl , Platform, StatusBar, Dimensions, ScrollView, StyleSheet, View, PixelRatio, Image, TouchableOpacity, useAnimatedValue , Linking, Switch  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingActionButton from '@/components/FloatingActionButton';
import DropdownFilter from '@/components/DropdownFilter';
import { Ionicons } from '@expo/vector-icons';
import CardCustom  from '@/components/CardCustom';
import CardCustomV2  from '@/components/CardCustomV2';
import SearchBarComponent from '@/components/SearchBar';
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
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const FlashListCustom = ({ data, logoMap, searchQuery, setSearchQuery, onSearch }) => {
  const searchQuery2 = (searchQuery.length > 0 && searchQuery) ;
  // console.log("searchQuery2",searchQuery2)
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
  // Stato filtro: array di source selezionate (in lowercase)
  const [selectedSources, setSelectedSources] = useState([]);
  const [isTitleFilterActive, setIsTitleFilterActive] = useState(false);
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

  // // 🔥 Filtriamo i dati in base ai filtri attivi
  // const filteredData = data.filter(item => {
  //   // const matchesTitle = isTitleFilterActive ? searchQuery2 ? item.title.toLowerCase().includes(searchQuery2.toLowerCase()) : true : true;
  //   const matchesSource = selectedSource ? selectedSource.includes(item.source) : true;
  //   // const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

  //   // return matchesTitle && matchesSource;
  //   return matchesSource;
  // });

  // Filtriamo i dati: se selectedSources è vuoto, mostriamo tutto;
  // altrimenti, mostriamo solo le card con item.source (in lowercase) presente nell'array.
  const filteredData = data.filter(item => {
    const matchesTitle = isTitleFilterActive 
      ? (searchQuery2 ? item.title.toLowerCase().includes(searchQuery2.toLowerCase()) : true)
      : true;
    const matchesSource = selectedSources.length > 0 
      ? selectedSources.includes(item.source.toLowerCase())
      : true;
    return matchesTitle && matchesSource;
  });
  
  // Funzione per andare subito in alto
  const scrollToPosition = () => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Funzione per determinare il colore
  const getPriceColor = (price) => {
    if (price <= lowThreshold) return "#189e18a5"; // Fascia bassa
    if (price > lowThreshold && price <= highThreshold) return "#db9614b6"; // Fascia media
    return "#e20c0c96"; // Fascia alta
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simula un refresh di 2 secondi
  };
  
  return (
    <LinearGradient colors={['#56a06f', '#002f06']}>
      <View style={[{ minHeight: 2, width: width, height: height}]}>
      {/* Indice della cella visibile */}
      <TouchableOpacity 
        style={[styles.touchableUp, styles.shadow]} 
        onPress={scrollToPosition}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold", padding: 8, aspectRatio: 1 / 1, textAlign: "center" }}>
        <Ionicons name={"arrow-up-circle-sharp"} size={24} color="white" />
        </ThemedText>
      </TouchableOpacity>

     {/* 🌍 Filtri per fonte (Subito, Vinted, ecc.) */}
        <View className='z-20 w-full flex-row items-center px-1 gap-2' style={[styles.stickyHeader,{height:50, top: Platform.OS === 'ios' ? 45 : 35,}]}>
          <View className='flex-1'>
            <SearchBarComponent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={onSearch}
            />
          </View>
          <View>
            {/* <FloatingActionButton
              logoMap={logoMap} 
              selectedSources={selectedSources} 
              onFilterChange={setSelectedSources}
              titleFilterActive={isTitleFilterActive}
              onTitleFilterToggle={setIsTitleFilterActive}
            /> */}
            <DropdownFilter
              logoMap={logoMap} 
              selectedSources={selectedSources} 
              onFilterChange={setSelectedSources}
              titleFilterActive={isTitleFilterActive}
              onTitleFilterToggle={setIsTitleFilterActive}
            />
          </View>
       {/* 🔍 Switch per attivare/disattivare il filtro per titolo */}
      {/* <View style={styles.switchContainer}> */}
        {/* <ThemedText>Filtra per titolo</ThemedText>
          <Switch style={{flex: 1, margin:"auto"}}
          value={isTitleFilterActive}
          onValueChange={setIsTitleFilterActive}
        /> */}
      {/* </View> */}
        {/* {['SUBITO', 'VESTIAIRE', 'EBAY'].map(source => (
          <TouchableOpacity
            key={source}
            style={[styles.button, selectedSource === source && styles.activeButton]}
            onPress={() => setSelectedSource(selectedSource === source ? null : source)}
          >
            <ThemedText style={styles.buttonText}>{source}</ThemedText>
          </TouchableOpacity>
        ))} */}
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
          padding: 10,
          paddingTop: STATUSBAR_HEIGHT + 70,
          paddingBottom: STATUSBAR_HEIGHT +65,
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            progressViewOffset={300} // 🔥 Sposta l'indicatore più in basso
          />
        }
        ListHeaderComponent={          
          <LinearGradient colors={['#007280', '#56a06f']} style={{ borderRadius: 10, marginTop:10 }}>
            <Text className='text-2xl font-normal' style={[{
              display: "flex", alignContent: "center", justifyContent: "center",
              borderRadius: 12, padding:5, color: 'white', fontWeight:'bold'
            }]}>
                🛍️ {selectedSources==null?data.length:filteredData.length} Articoli trovati
            </Text>
          </LinearGradient>
        }
        renderItem={({ item, index }) => {
          return (
            // <CardCustom item={item} logoMap={logoMap} getPriceColor={getPriceColor}></CardCustom>
            <CardCustomV2 item={item} logoMap={logoMap} getPriceColor={getPriceColor}></CardCustomV2>
        )}}
        estimatedItemSize={ITEM_SIZE}
      />
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: .2,
    shadowRadius: 10,
    elevation: 2,
  },
    touchableUp: {
      position: "absolute",
      bottom: 30,
      right: 10,
      backgroundColor: "#56a06f",
      padding: 10,
      borderRadius: 40,
      zIndex: 10,
      aspectRatio: 1 / 1,
      opacity: 0.9
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
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterButtons: {
    position: 'absolute',
    top:Platform.OS ==='ios'?115:110,
    right: 0,
    // left: 10,
    // zIndex: 100,
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginBottom: 10,
  },
  stickyHeader: { // 🔥 Stile per mantenere il componente sticky
    display: 'flex',
    flex: 1,
    position: "absolute",

    elevation: 5, // Effetto ombra su Android
    shadowColor: "#000", // Effetto ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
export default FlashListCustom;
