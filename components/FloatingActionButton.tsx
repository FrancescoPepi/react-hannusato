// FloatingActionButton.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

interface FloatingActionButtonProps {
  logoMap: { [key: string]: ImageSourcePropType };
  selectedSources: string[];
  onFilterChange: (selected: string[]) => void;
  titleFilterActive: boolean;
  onTitleFilterToggle: (active: boolean) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  logoMap,
  selectedSources,
  onFilterChange,
  titleFilterActive,
  onTitleFilterToggle,
}) => {
  // Stato animato: 0 = chiuso, 1 = aperto
  const isOpen = useSharedValue(0);
  const isSubOpen = useSharedValue(0);
  const parentOffset = useSharedValue(0);
  const isCheck = useSharedValue(0);
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);

  // Funzione per alternare il menu principale
  const toggleMenu = () => {
    isOpen.value = isOpen.value ? 0 : 1;
    isSubOpen.value = 0;
  };

  // Per il primo pulsante (ad esempio, per aprire/chiudere il menu dei filtri)
  const toggleSubMenu = (index: number) => {
    // console.log(`Sub-opzione ${index} premuta`);
    isSubOpen.value = isSubOpen.value ? 0 : 1;
  };

  // Stile animato per il FAB principale
  const fabAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(isOpen.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  // Stile animato per ogni pulsante del sub-menu (filtri)
  const menuItemSubAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const base = parentOffset.value;
      const offset = (index * 60) + base;
      return {
        opacity: withTiming(isSubOpen.value, { duration: 300 }),
        transform: [
          { translateY: withTiming(isSubOpen.value ? offset : 0, { duration: 300 }) },
          { translateX: withTiming(isSubOpen.value ? -60 : 0, { duration: 300 }) },
        ],
      };
    });
  };

  // Stile animato per ogni pulsante del menu principale
  const menuItemAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const offset = (index * 60) + 70;
      return {
        opacity: withTiming(isOpen.value, { duration: 300 }),
        transform: [
          { translateY: withTiming(isOpen.value ? offset : 0, { duration: 300 }) },
        ],
      };
    });
  };

  // Funzione per gestire il click sul pulsante principale del menu
  const handleOptionPress = (index: number) => {
    const offset = (0 * 60) + 70;
    parentOffset.value = offset;
    if (index === 0) {
      toggleSubMenu(index);
      setOpen(prev => {
        const newVal = !prev;
        // isCheck.value = newVal ? 1 : 0;
        // console.log(`Checkbox toggled: ${newVal}`);
        // onTitleFilterToggle(newVal);
        return newVal;
      });
    } else if (index === 1) {
      setCheck(prev => {
        const newVal = !prev;
        isCheck.value = newVal ? 1 : 0;
        // console.log(`Checkbox toggled: ${newVal}`);
        onTitleFilterToggle(newVal);
        return newVal;
      });
    }
    // console.log(`Opzione ${index} premuta`);
  };
  // Array di testo per i pulsanti del menu principale
  const textButton = ['Filter', 'Titolo'];
  // Array di icone per i pulsanti del menu principale
  const options = ['filter', 'checkbox'];
  // Le fonti (filtri) sono le chiavi dell'oggetto logoMap
  const subOptions = Object.keys(logoMap);

  // Funzione per toggle di un filtro (multiplo)
  const toggleFilter = (source: string) => {
    const lowerSource = source.toLowerCase();
    if (selectedSources.includes(lowerSource)) {
      onFilterChange(selectedSources.filter(s => s !== lowerSource));
    } else {
      onFilterChange([...selectedSources, lowerSource]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Pulsanti del menu principale */}
      {options.map((iconName, index) => (
        <Animated.View key={index} style={[styles.menuItem, menuItemAnimatedStyle(index)]}>
          <TouchableOpacity
            style={[styles.menuButton, index === 0 && open && styles.activeFilterButton, index === 1 && check && styles.activeFilterButton ]} // { backgroundColor: index === 1 && check ? '#56a06f' : '#707070' }
            onPress={() => {
              const offset = (index * 60) + 70;
              parentOffset.value = offset;
              handleOptionPress(index);
            }}
          >
            <Text className='text-xs font-semibold' style={{color:'#fff'}}>{textButton[index]}</Text>
            <Ionicons 
              name={ index === 1 
                ? (check ? "checkbox" : "square-outline") 
                : iconName }  
              size={25} 
              color="white" 
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
      {/* Pulsanti dei filtri (sub-menu) */}
      {subOptions.map((source, index) => {
        const isActive = selectedSources.includes(source.toLowerCase());
        return (
          <Animated.View key={source} style={[styles.menuItem, menuItemSubAnimatedStyle(index)]}>
            <TouchableOpacity 
              style={[styles.menuButton, isActive && styles.activeFilterButton]}
              onPress={() => toggleFilter(source)}
            >
              <Image 
                source={logoMap[source.toLowerCase()]} 
                resizeMode="contain" 
                style={{ height: '80%', width: '90%' }} 
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* FAB principale */}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Animated.View style={fabAnimatedStyle}>
          <Ionicons name="add" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    position: 'absolute',
    right: 5,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#909090',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  activeFilterButton: {
    backgroundColor: '#87b697', // colore evidenziato per i filtri attivi
  },
});

export default FloatingActionButton;
