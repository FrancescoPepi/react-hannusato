// import React from 'react';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, Linking, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { useAnimatedScrollHandler, FadeIn, FadeOut, useSharedValue, useAnimatedStyle, interpolate, withTiming} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const CardList = ({ data, logoMap }) => {
    return (
    // <ScrollView
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
    //                   <ThemedText type="default" style={styles.stylePrice}>€ {item.price}</ThemedText>
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
      <View style={{ padding: 5, flex:1 }}>
         <FlatList
      data={data} // 🔥 Passa i dati correttamente
          keyExtractor={(item,index) => `${item.title}-${index}`} // ⚠️ Meglio usare un id se disponibile
          
      renderItem={({ item }) => (
        <LinearGradient colors={['#242728', '#2d2f30']} style={[styles.card, styles.cardContent]}>
          <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
            <View style={styles.cardContent}>
              <Image
                source={item.picture ? { uri: item.picture } : require('@/assets/images/logo.png')}
                resizeMode="cover"
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <View style={[styles.badge]}>
                  <ThemedText type="default" style={styles.stylePrice}>€ {item.price}</ThemedText>
                </View>
                <Image source={logoMap[item.source.toLowerCase()]} resizeMode="contain" style={styles.badge} />
              </View>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.subCard}>{item.title}</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
      )}
      contentContainerStyle={{ padding: 5 }} // 🔥 Opzionale per padding generale
    />
    </View>
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
