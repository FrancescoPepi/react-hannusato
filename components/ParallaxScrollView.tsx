import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  stickyHeader,
}: Props & { stickyHeader?: ReactElement }) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value || 0,  // ✅ Evita undefined
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
    );
  
    const scale = interpolate(
      scrollOffset.value || 0,  // ✅ Evita undefined
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [2, 1, 1]
    );
  
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <ThemedView style={styles.container}>
  <AnimatedFlatList
      ref={scrollRef}
      // scrollEventThrottle={16}
      // scrollIndicatorInsets={{ bottom }}
      // contentContainerStyle={{ paddingBottom: bottom }}
        // stickyHeaderIndices={stickyHeader ? [0] : undefined} // 🔥 Assicura che la barra rimanga sticky
        // stickyHeaderIndices={[0]}
    data={React.Children.toArray(children)}
    renderItem={({ item }) => <>{item}</>}
    ListHeaderComponent={() => (
      <View>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
          <ThemedText style={styles.textContainer} type="subtitle">
            Loro l'hanno usato, Noi annusiamo l'affare
          </ThemedText>
        </Animated.View>
    
        {stickyHeader && (
          <ThemedView
            style={[styles.stickyHeader, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]} // 🔥 Fissa la barra
            lightColor="transparent"
            darkColor="transparent"
          >
            {typeof stickyHeader === "string" ? (
              <ThemedText>{stickyHeader}</ThemedText>
            ) : (
              stickyHeader
            )}
          </ThemedView>
        )}
      </View>
    )}
    
  />
</ThemedView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  stickyHeader: { // 🔥 Stile per mantenere il componente sticky
    backgroundColor: "#ffffff0",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,

    elevation: 5, // Effetto ombra su Android
    shadowColor: "#000", // Effetto ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    transform: [{ translateY: -30 }],
    textAlign: 'center',
  },
});
