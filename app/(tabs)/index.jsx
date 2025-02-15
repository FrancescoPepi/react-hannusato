import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Linking, View, ActivityIndicator, Button, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
const HEADER_HEIGHT = 250;

import { HelloWave } from '@/components/HelloWave';
import SearchBarComponent from '@/components/SearchBar';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AnimatedPhrase  from '@/components/AnimatedPhrase';
import CardList  from '@/components/CardList';
import FlashListCustom  from '@/components/FlashListCustom';
import { SearchBar } from 'react-native-screens';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import Animated, { useSharedValue, withSpring, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// console.log("AnimatedPhrase:", AnimatedPhrase);
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // const searchBarPosition = useSharedValue(0);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  const logoMap = {
    subito: require('@/assets/images/logo/subito.png'),
    ebay: require('@/assets/images/logo/ebay.png'),
    vestiaire: require('@/assets/images/logo/vestiaire.png'),
  };

  let test = 'red';

  const fetchData = async (term) => {
    //  console.log("isLoading,loading",isLoading,loading)
    if (!term) return; // Evita chiamate API se il termine è vuoto
    setLoading(true);
    try {
      setIsLoading(true);
      const response = await fetch(`https://hannusato-express.onrender.com/crawl?term=${term}`);
      const result = await response.json();

      // console.log("result",result);
      // setData(result.filter(item => item.brand === 'subito'));
      // setData(result.filter(item => item.brand === 'ebay'));
      // setData(result.filter(item => item.brand === 'vestiaire'));
      
      // function per pulire il prezzo
      const cleanPrice = (price) => {
        // 🔥 Se il valore è nullo, restituisce 0
        if (price === undefined || price === null) return 0;
        // 🔥 Se è già un numero, lo mantiene
        if (typeof price === "number") return price;
      
        if (typeof price === "string") {
          // 🔥 Trova tutti i numeri validi nel testo (sia con "." che con ",")
          const numbers = price.match(/\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:\.\d+)?/g);
          // 🔥 Se non ci sono numeri, restituisce 0
          if (!numbers) return 0; 
          // 🔥 Prende il primo numero trovato (il più basso)
          let firstPrice = numbers[0]; 
          
          // 🔥 Rimuove i separatori delle migliaia e converte la virgola in punto decimale
          return parseFloat(
            firstPrice.replace(/\.(?=\d{3}(,|$))/g, "").replace(",", ".")
          ) || 0;
        }
      
        return 0;
      };   
      // 🔥 Converte e sovrascrive price
      const updatedData = result.map(item => ({
        ...item,
        price: cleanPrice(item.price)
      }));
      // 🔥 Ordina i dati in base al prezzo
      const sortedUpdatedData = updatedData.sort((a, b) => a.price - b.price);
      // console.log("sortedData", sortedUpdatedData);
      setData(sortedUpdatedData);
    } catch (error) {
      console.error('Errore nella chiamata API:', error);
      setData([]); // Pulisce la lista in caso di errore
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

// ANIMAZIONE SPOSTA SEARCH BAR
  // React.useEffect(() => {
    // if (isLoading) {
    //   searchBarPosition.value = withTiming(-HEADER_HEIGHT, { duration: 300 }); // Sposta in basso
    //   console.log(searchBarPosition);
    // }
    // else {
    //   searchBarPosition.value = withTiming(0, { duration: 300 }); // Rimane in alto
    //   console.log(searchBarPosition);
    //   // console.log(withTiming(HEADER_HEIGHT));
    // }
  // }, [isLoading]);

  // const searchBarAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: searchBarPosition.value }],
  //   };
  // });

  return (
    <>
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#56a06f', dark: '#56a06f' }}
      headerImage={
        <Image
        source={require('@/assets/images/logo.png')}
        style={styles.reactLogo}
        />
      }
      stickyHeader={ // 🔥 Mantiene la barra di ricerca fissa mentre scrolli
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={fetchData}
        />
      }
        isLoading={isLoading}
        loading={loading}
    >
      
      {isLoading ? <ActivityIndicator size="large" color="#56a06f" /> : null}
      
        {loading ? (
          <View style={styles.boxContainer}>
            <ThemedView style={[styles.titleContainer]}>
              <ThemedText type="title">Welcome Back</ThemedText>
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemedText type="defaultSemiBold">Project Hannusato</ThemedText>
                <HelloWave />
              </ThemedView>
            </ThemedView>
            <AnimatedPhrase />
          </View>
        
        ) : (null)}

      </ParallaxScrollView>
      {loading ? (
      null
        
      ) : (
          <ThemedView>                          
            <ThemedView type="title" 
              style={styles.stickyHeader}
              lightColor="transparent" darkColor="transparent"
              >
              <SearchBarComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={fetchData}
                />
            </ThemedView>
              <FlashListCustom data={data} logoMap={logoMap} />
              {/* <CardList data={data} logoMap={logoMap} /> */}
          </ThemedView>
      )}
</>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stickyHeader: { // 🔥 Stile per mantenere il componente sticky
    display: 'flex',
    flex: 1,
    position: "absolute",
    // display: "fixed",
    top: 10,
    left: 0,
    right: 0,
    zIndex:10,
    // backgroundColor: "transparent",
    // backgroundColor: "#ffffff0",
    paddingTop: 50,
    paddingHorizontal: 20,
    // height: 50,

    elevation: 5, // Effetto ombra su Android
    shadowColor: "#000", // Effetto ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    backgroundColor: '#56a06f5f',
    textAlign: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  boxContainer: {
    padding: "15",
    backgroundColor: '#',
    borderRadius: 20,
    gap: 8,
  },
  reactLogo: {
    width: "90%",
    objectFit: "contain",
  },
  subCard: {
    backgroundColor: '#2d2f30',
    color: '#eeeeee',
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  card: {
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: "50%",
    aspectRatio: "1.5 / 1",
    borderRadius: 10,
  },
  badge: {
    width: "auto",
    height: 40,
    minWidth: 80,
    padding: 2,
    borderRadius: 30, 
    backgroundColor: '#2d2f30',
    borderWidth: 1, borderColor: '#353738',
  },
  stylePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 'auto',
  },
});
