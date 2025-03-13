import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
  } from 'react-native-reanimated';

interface DropdownFilterProps {
  logoMap: { [key: string]: ImageSourcePropType };
  selectedSources: string[];
  onFilterChange: (selected: string[]) => void;
  titleFilterActive: boolean;
  onTitleFilterToggle: (active: boolean) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  logoMap,
  selectedSources,
  onFilterChange,
  titleFilterActive,
  onTitleFilterToggle,
}) => {
    const [open, setOpen] = useState(false);
    const isOpen = useSharedValue(0);

      // Funzione per alternare il menu principale
  const toggleMenu = () => {
    isOpen.value = isOpen.value ? 0 : 1;
  };


  const toggleDropdown = () => {
    setOpen(prev => !prev);
  };

    // Stile animato per il FAB principale
    const fabAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(isOpen.value, [0, 1], [0, 45]);
    return {
        transform: [{ rotate: `${rotation}deg` }],
    };
    });
    
  const toggleFilter = (source: string) => {
    const lowerSource = source.toLowerCase();
    if (selectedSources.includes(lowerSource)) {
      onFilterChange(selectedSources.filter(s => s !== lowerSource));
    } else {
      onFilterChange([...selectedSources, lowerSource]);
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      {/* Pulsante principale per aprire/chiudere il dropdown */}
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
            <Animated.View style={fabAnimatedStyle}>
                <Ionicons name="filter" size={24} color="#494949" />
            </Animated.View>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="#494949" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownContent}>
          {Object.keys(logoMap).map((source) => {
            const isActive = selectedSources.includes(source.toLowerCase());
            return (
              <TouchableOpacity
                key={source}
                style={[styles.filterOption, isActive && styles.activeFilterOption]}
                onPress={() => toggleFilter(source)}
              >
                <Image 
                  source={logoMap[source.toLowerCase()]} 
                  resizeMode="contain" 
                  style={styles.filterIcon} 
                />
                <Text style={styles.filterText}>{source.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
          {/* Opzione per attivare/disattivare il filtro per titolo */}
          <TouchableOpacity
            style={[styles.filterOption, titleFilterActive && styles.activeFilterOption]}
            onPress={() => onTitleFilterToggle(!titleFilterActive)}
          >
            <Ionicons 
              name={titleFilterActive ? "checkbox" : "square-outline"} 
              size={20} 
              color="#494949" 
              style={{ marginRight: 5 }}
            />
            <Text style={styles.filterText}>FILTRA PER TITOLO</Text>
            {/* <Text style={styles.filterText}>CONTENUTO NEL TITOLO</Text> */}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'relative'
    },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ededed',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 80,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#494949',
  },
    dropdownContent: {
      position: 'absolute',
        top: 55, // distanza dal bottone; modifica se necessario
    // left: -10,
        right: 0,
        // marginTop: 25,
        width: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
  },
  filterOption: {
    flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  activeFilterOption: {
    backgroundColor: '#87b697',
  },
  filterIcon: {
    width: 38,
    height: 28,
    marginRight: 5,
  },
  filterText: {
    fontSize: 16,
    color: '#494949',
    },
});

export default DropdownFilter;
