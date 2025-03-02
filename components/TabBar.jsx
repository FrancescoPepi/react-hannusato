import { View, Platform, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import TabBarButton from '@/components/TabBarButton';
import React, { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const MyTabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const [dimensions, setDimensions] = useState({ height: 20, width:100 });

  const buttonWidth = dimensions.width / state.routes.length;
  const onTabBarLayout = (e) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  }

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTabBarLayout} style={styles.tabbar}>
      <Animated.View style={[{
        position: 'absolute',
        backgroundColor: '#56a06f',
        borderRadius: 30,
        marginHorizontal: 12,
        height: dimensions.height - 15,
        width: buttonWidth - 25,
      }, animatedStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, { duration: 1500 });
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? '#fff' : colors.text}
            label={label}
          />
          // <PlatformPressable
          //   key={route.name}
          //   href={buildHref(route.name, route.params)}
          //   accessibilityState={isFocused ? { selected: true } : {}}
          //   accessibilityLabel={options.tabBarAccessibilityLabel}
          //   testID={options.tabBarButtonTestID}
          //   onPress={onPress}
          //   onLongPress={onLongPress}
          //   style={styles.tabBarItem}
          // >
          //   {icon[route.name]({
          //     color: isFocused ? colors.primary : colors.text
          //   })}
          //   <Text style={{ color: isFocused ? colors.primary : colors.text }}>
          //     {label}
          //   </Text>
          // </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 100,
    paddingVertical: 8,
    borderRadius: 35,
    backgroundColor: 'white',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  // tabBarItem: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   gap: 3,
  // },
});

export default MyTabBar;