import React, { useEffect, useState } from 'react';
import { StatusBar , Image, StyleSheet, Linking, View, ActivityIndicator, Button, Dimensions , PixelRatio, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {CustomFadeInUp, CustomFadeOutUp } from '@/animations/customAnimations';
import { useRouter } from 'expo-router';
import Animated, {
} from 'react-native-reanimated';

import { HelloWave } from '@/components/HelloWave';
import SearchBarComponent from '@/components/SearchBar';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AnimatedPhrase  from '@/components/AnimatedPhrase';
import FlashListCustom2  from '@/components/FlashListCustom2';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import Animated, { useSharedValue, withSpring, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// console.log("AnimatedPhrase:", AnimatedPhrase);
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;


export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearchFromHome = (term) => {
    if (!term) return;
    setSearchQuery('');
    router.push({ pathname: '/search', params: { initialQuery: term } });
  };
  // const searchBarPosition = useSharedValue(0);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  const logoMap = {
    subito: require('@/assets/images/logo/subito.png'),
    vinted: require('@/assets/images/logo/vinted.png'),
    ebay: require('@/assets/images/logo/ebay.png'),
    wallapop: require('@/assets/images/logo/wallapop.png'),
    // vestiaire: require('@/assets/images/logo/vestiaire.png'),
  };

  let test = 'red';

  const fetchData = async (term) => {
    const baseUrl = 'https://hannusato-express.onrender.com'
    // const baseUrlTest = Platform.OS === 'ios' 
    // ? 'http://192.168.1.60:5000'  // iOS usa 'localhost'
    //   : 'http://10.0.2.2:5000';
    //   // : 'http://192.168.1.60:5000';
    // const baseUrlTest ='https://104.248.20.26:5000'
    // const baseUrlTest ='https://hannusato-backend.duckdns.org:5000' //old
    const baseUrlTest ='https://hannusato-backendv2.ddns.net:5000'
    
    if (!term) return; // Evita chiamate API se il termine è vuoto
    setLoading(true);
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrlTest}/crawl?term=${term}`);
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
      setData(updatedData);
    } catch (error) {
      console.error('Errore nella chiamata API:', error);
      setData([]); // Pulisce la lista in caso di errore
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };


  return (
    <>
      {Platform.OS === 'ios' ? <StatusBar style="light" hidden={false} /> : <StatusBar style="light" hidden={true} />}
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
          // onSearch={fetchData}
          onSearch={handleSearchFromHome}
        />
      }
        isLoading={isLoading}
        loading={loading}
    >
      
      {isLoading ? <ActivityIndicator size="large" color="#56a06f" /> : null}
      
        {loading ? (
          <View style={styles.boxContainer}>
             {/* <ThemedView lightColor='#002f06' darkColor='#002f06' style={[styles.titleContainer]}> */}
              {/* <ThemedView lightColor='#002f06' darkColor='#002f06' style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}> */}
              {/* <ThemedText type="title" style={{color:'#fff'}}>Welcome Back</ThemedText> */}
                {/* <ThemedText type="defaultSemiBold">Project Hannusato</ThemedText> */}
                {/* <HelloWave /> */}
              {/* </ThemedView> */}
            {/* </ThemedView> */}
            <AnimatedPhrase /> 

            {Object.keys(logoMap).map((source) => {
              // const isActive = selectedSources.includes(source.toLowerCase());
              return (
                // <TouchableOpacity
                //   key={source}
                //   style={[styles.filterOption, isActive && styles.activeFilterOption]}
                //   onPress={() => toggleFilter(source)}
                // >
                // </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Image 
                    source={logoMap[source.toLowerCase()]} 
                    resizeMode="contain" 
                    style={styles.filterIcon} 
                  />
                  <View style={{justifyContent:'space-between'}} className='flex flex-row w-full'>
                    <Text style={styles.filterText}>
                      Facilità d’uso
                    </Text>
                    <Text style={styles.filterText}>
                      ⭐⭐⭐⭐⭐
                    </Text>
                  </View>
                  <View style={{justifyContent:'space-between'}} className='flex flex-row w-full'>
                    <Text style={styles.filterText}>
                      Numero visite mensili
                    </Text>
                    <Text style={styles.filterText}>
                      ⭐⭐⭐⭐⭐
                    </Text>
                  </View>
                  <View style={{justifyContent:'space-between'}} className='flex flex-row w-full'>
                    <Text style={styles.filterText}>
                      Sicurezza
                    </Text>
                    <Text style={styles.filterText}>
                      ⭐⭐⭐⭐⭐
                    </Text>
                  </View>
                  <View style={{justifyContent:'space-between'}} className='flex flex-row w-full'>
                    <Text style={styles.filterText}>
                      Servizio clienti
                    </Text>
                    <Text style={styles.filterText}>
                      ⭐⭐⭐⭐⭐
                    </Text>
                  </View>
                  {/* <Text style={{color:'#fff'}}>Loading...</Text> */}
                </View>
              );
            })}
          </View>
          
        ) : (null)}

      </ParallaxScrollView>
      {/* {loading ? ( */}
      {/* null */}
        
      {/* ) : ( */}
          {/* <Animated.View entering={CustomFadeInUp} exiting={CustomFadeOutUp}> */}
            {/* <FlashListCustom2
              data={data}
              logoMap={logoMap}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={fetchData}
            /> */}
              {/* <FlashListCustom data={data} logoMap={logoMap} searchQuery={searchQuery}  /> */}
          {/* </Animated.View> */}
      {/* )} */}
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
  filterOption: {
    flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  stickyHeader: { // 🔥 Stile per mantenere il componente sticky
    display: 'flex',
    flex: 1,
    position: "absolute",
    // display: "fixed",
    // top: 10,
    // left: 0,
    // right: 70,
    // zIndex:10,
    // backgroundColor: "transparent",
    // backgroundColor: "#ffffff0",
    // paddingTop: 50,
    // paddingHorizontal: 20,
    // height: 50,

    elevation: 5, // Effetto ombra su Android
    shadowColor: "#000", // Effetto ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  filterIcon: {
    // width: 100,
    height: '20%',
    // marginRight: 5,
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#ffffff',
    },
  textContainer: {
    backgroundColor: '#56a06f5f',
    textAlign: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 10,
    width: '80%',
    height: 200,
    
  },
  boxContainer: {
    // padding: "10",
    // backgroundColor: '#',
    // borderRadius: 20,
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
