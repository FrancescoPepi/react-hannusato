import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { SearchBar } from 'react-native-screens';
import { Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring } from 'react-native-reanimated';




const SearchBarComponent = ({ searchQuery, setSearchQuery, onSearch }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }), // Ingrossa leggermente
      withSpring(1, { damping: 3, stiffness: 200 }) // Effetto rimbalzo
    );
  };

  return (
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={() => onSearch(searchQuery)}
      onFocus={handleFocus}
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2 }}
        icon={() => (
          <Animated.View style={animatedStyle}>
            <Image
            source={require('@/assets/images/logoMini.png')} // Assicurati che il percorso sia corretto
            style={{ width: 22, height: 22, transform: [{ scaleX: -1 },{rotate: '-20deg'}] }} // Personalizza le dimensioni dell'immagine
            />
          </Animated.View>
        )}      
      />
  );
};

export default SearchBarComponent;
