import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { icons } from "@/constants/icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate } from "react-native-reanimated";

const TabBarButton = ({ color, onPress, onLongPress, label, routeName, isFocused }) => {
    
    const scale = useSharedValue(0);
    const translateYValue = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, { duration: 350 });
        translateYValue.value = withSpring(isFocused ? 5 : 0, { duration: 350 });
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return {
            // transform: [{ scale: scaleValue }, { translateY: translateYValue.value }],
            transform: [{ scale: scaleValue }],
            top
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity,
        };
    });

    return (
    <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={[animatedIconStyle]}>
                {icons[routeName]({
                color: color,
                })}
            </Animated.View>
            <Animated.Text style={[animatedTextStyle, { color: color, fontWeight: isFocused ? 'bold' : 'normal' }]}>
              {label}
            </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      },
});