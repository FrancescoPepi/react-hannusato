import React, { useEffect, useRef, useState } from 'react';
import { Text, Platform, StatusBar, Dimensions, StyleSheet, View, Image, TouchableOpacity, Linking } from 'react-native';
import Svg, { RadialGradient, Rect, Stop } from 'react-native-svg';
const ITEM_SIZE = 220
const CardCustom = ({ item, logoMap, index, getPriceColor }) => {
 



    return (        
        <TouchableOpacity key={index} onPress={() => item.link && Linking.openURL(item.link)} style={{ marginHorizontal: 4 }}>
            <View className='p-1 w-full h-[220px] rounded-xl overflow-hidden bg-bgCard mt-5 flex-row'>
                {/* CONTAINER */}
                {/* BOX-1 IMG */}
                <View className='p-1 rounded-xl flex-1 h-full bg-bgCard relative '>
                    {/* SOURCE (LOGO) */}
                    <View className=' h-10 items-start absolute top-0 left-0 z-20 border-4 border-bgCard rounded-xl bg-[#F6F5F5]'>
                        <Text className=' w-20 p-0.5 flex items-center justify-center py-1 px-2 text-xl min-w-[80px] rounded-xl'>
                            {logoMap[item.source?.toLowerCase()] && (
                                <Image source={logoMap[item.source.toLowerCase()]} resizeMode="contain" 
                                className="h-full w-full"/>
                            )}
                        </Text>
                    </View>
                    <View className='rounded-xl flex-1 h-full overflow-hidden'>
                        <Image
                            source={item.picture ? { uri: item.picture } : require('@/assets/images/logo.png')}
                            resizeMode="cover"
                            className="w-full h-full object-cover object-center rounded-lg"
                        />
                        {/* OPACITA' SOPRA */}
                        <Svg width={220} height={220} style={StyleSheet.absoluteFill}>
                                <RadialGradient
                                    id="grad"
                                    cx="50%"
                                    cy="50%"
                                    rx="50%"
                                    ry="50%"
                                    fx="50%"
                                    fy="50%"
                                >
                                    {/* Al centro, trasparente */}
                                    <Stop offset="0%" stopColor="#ffffff" stopOpacity="0." />
                                    {/* Ai bordi, ombra scura */}
                                    <Stop offset="100%" stopColor="black" stopOpacity="0.5" />
                                </RadialGradient>
                                <Rect width={220} height={220} fill="url(#grad)" />
                            </Svg>
                    </View>
                </View>
                {/* BOX-2 TITOLO */}
                <View className='p-1 rounded-xl flex-1 h-full bg-bgCard relative'>
                    {/* PREZZO */}
                    <View className='h-10 items-start absolute bottom-0 right-0 z-10 border-4 border-bgCard rounded-xl bg-[#F6F5F5]' style={[{ backgroundColor: getPriceColor(item.price) }]}>
                        <Text className='p-0.5 pl-1 text-lg font-bold min-w-[80px] text-rose-100 rounded-xl'>
                        {/* €{item.price} {item.price.length > 12 ? '' : null} */}
                        💰€{item.price} {item.price.length > 12 ? '+' : null}
                        </Text>
                    </View>
                    <View className='p-1 rounded-xl flex-1 h-full' style={{backgroundColor:'white'}}>
                        {/* <Text numberOfLines={2} ellipsizeMode="tail" className='text-black-100 p-2 text-lg font-bold'>
                            {item.title}
                        </Text> */}
                        <Text className='text-black-100 p-2 text-lg font-bold'>
                            {item.title}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
});
export default CardCustom;