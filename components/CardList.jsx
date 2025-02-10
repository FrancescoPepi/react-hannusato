// import React from 'react';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, Linking, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { useAnimatedScrollHandler, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, interpolate, withTiming} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const CardList = ({ data, logoMap }) => {

  // Troviamo il prezzo minimo e massimo
const minPrice = data[0]?.price || 0;
const maxPrice = data[data.length - 1]?.price || 0;

// Definiamo i range
const lowThreshold = minPrice + (maxPrice - minPrice) * 0.33;
const highThreshold = minPrice + (maxPrice - minPrice) * 0.66;

// Funzione per determinare il colore
const getPriceColor = (price) => {
  if (price <= lowThreshold) return "green"; // Fascia bassa
  if (price > lowThreshold && price <= highThreshold) return "orange"; // Fascia media
  return "red"; // Fascia alta
};

    return (
      <FlatList
      style={{ padding: 5 }}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <LinearGradient key={index} colors={['#242728', '#2d2f30']} style={[styles.card, styles.cardContainer]}>
          <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
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
          </TouchableOpacity>
        </LinearGradient>
      )}
    />
      
    // old e al momento funzionante al 100%
    //   <ScrollView
    //   style={{ padding: 5 }}
    // >          
    // {data.map((item, index) => {
    //       return (
    //         <LinearGradient key={index} colors={['#242728', '#2d2f30']} style={[styles.card, styles.cardContainer]}>
    //           <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
    //           <View style={styles.cardContent}>
    //               <Image
    //                 source={item.picture ? { uri: item.picture } : require('@/assets/images/logo.png')}
    //                 resizeMode="cover"
    //                 style={styles.image}
    //               />
    //               <View style={styles.infoContainer}>
    //                 <View style={[styles.badge]}>
    //                   <ThemedText type="default" style={[styles.stylePrice, { color: getPriceColor(item.price) }]}>€ {item.price}</ThemedText>
    //                 </View>
    //                 <Image source={logoMap[item.source.toLowerCase()]} resizeMode="contain" style={styles.badge} />
    //               </View>
    //             </View>
    //             <ThemedText type="defaultSemiBold" style={styles.subCard}>{item.title}</ThemedText>
    //           </TouchableOpacity>
    //         </LinearGradient>
    //       );
    //   })}
    // </ScrollView>
  );
};
const styles = StyleSheet.create({
    card: {
        padding: 5,
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
        borderRadius: 30, 
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
});
export default CardList;
