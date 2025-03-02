import React, { useEffect, useRef, useState } from 'react';
import { Text, Platform, StatusBar, Dimensions, StyleSheet, View, Image, TouchableOpacity , Linking  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const ITEM_SIZE = 220
const CardCustom = ({ item, logoMap, index, getPriceColor }) => {
 



    return (
        <LinearGradient key={index} colors={['#56a06f', '#007280']} style={{ borderRadius: 10, marginTop:10 }}>
            <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
                <View className='p-2 w-full h-[220px] rounded-xl overflow-hidden'>
                    {/* CONTAINER */}
                    {/* <View className='p-2 w-full h-full'> */}
                        {/* BOX-1 */}
                        <View className='flex-row h-[60%]'>
                            {/* IMG */}
                            <View className='w-[50%] h-full'>
                                <Image
                                    source={item.picture ? { uri: item.picture } : require('@/assets/images/logo.png')}
                                    resizeMode="cover"
                                    className="w-full h-full object-cover object-center rounded-lg"
                                />
                            </View>
                            {/* PREZZO E SOURCE (LOGO) */}
                            <View className='w-[50%] h-full justify-around'>
                                
                                    {/* PREZZO */}
                                <View className='h-10 m-2 px-2 items-start'>
                                    <Text className='p-0.5 pl-2 text-lg font-bold min-w-[80px] text-rose-100 border border-[#007280] bg-[#9eb0a269] rounded-full' style={[{ color: getPriceColor(item.price) }]}>
                                    € {item.price}
                                    </Text>
                                </View>
                                {/* SOURCE (LOGO) */}
                                <View className=' h-10 m-2 px-2 items-start'>
                                    <Text className=' w-20 p-0.5 flex items-center justify-center py-1 px-2 text-xl min-w-[80px] border border-[#007280] bg-[#9eb0a269] rounded-full'>
                                        {logoMap[item.source?.toLowerCase()] && (
                                            <Image source={logoMap[item.source.toLowerCase()]} resizeMode="contain" 
                                            className="h-full w-full"/>
                                        )}
                                    </Text>
                                </View>
                                                   
                            </View>
                        </View>
                        {/* TITLE */}                            
                        <View className='w-full h-full' style={{paddingTop:4, paddingBottom:1}}>
                            <LinearGradient className='h-[40%]' key={index} colors={['#56a06f', '#007280']} style={{ borderRadius: 6}}>
                                <View className='w-full ios:h-[40%]'>
                                    <Text numberOfLines={2} ellipsizeMode="tail" className='text-rose-100 p-2 text-lg'>
                                        {item.title}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </View>
                    {/* </View> */}
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );
}
export default CardCustom;