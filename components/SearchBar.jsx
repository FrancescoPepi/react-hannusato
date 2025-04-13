import * as React from "react";
import { Searchbar } from "react-native-paper";
import { Image, AccessibilityInfo, TextInput } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const SearchBarComponent = React.memo(({ searchQuery, setSearchQuery, onSearch }) => {
	const scale = useSharedValue(1);
	const searchInputRef = React.useRef(null);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handleFocus = () => {
		scale.value = withSequence(
			withTiming(1.2, { duration: 100 }), // Ingrossa leggermente
			withSpring(1, { damping: 3, stiffness: 200 }) // Effetto rimbalzo
		);
		// Fornisce feedback per l'accessibilità
		AccessibilityInfo.announceForAccessibility("Barra di ricerca attivata");
	};

	// Gestisce il cambio di testo in modo sicuro
	const handleChangeText = (text) => {
		// console.log("SearchBar - handleChangeText - text:", text);
		// console.log("SearchBar - handleChangeText - current searchQuery:", searchQuery);
		setSearchQuery(text);
		// console.log("SearchBar - handleChangeText - after setSearchQuery called");
	};

	// Gestisce la pulizia del campo di ricerca
	const handleClearText = () => {
		setSearchQuery("");
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	};

	return (
		<Searchbar
			placeholder="Cerca prodotti"
			onChangeText={handleChangeText}
			value={searchQuery}
			onSubmitEditing={() => onSearch(searchQuery)}
			onFocus={handleFocus}
			ref={searchInputRef}
			clearButtonMode="while-editing"
			onClearIconPress={handleClearText}
			clearIcon={() => (
				<Ionicons
					name="close-circle"
					size={20}
					color="#666"
				/>
			)}
			accessibilityLabel="Barra di ricerca prodotti"
			accessibilityHint="Inserisci il nome del prodotto da cercare e premi invio"
			style={{
				shadowColor: "#000000",
				shadowOffset: { width: 0, height: 10 },
				shadowOpacity: 0.1,
				shadowRadius: 10,
				elevation: 2,
			}}
			icon={() => (
				<Animated.View style={animatedStyle}>
					<Image
						source={require("@/assets/images/logoMini.png")}
						style={{ width: 22, height: 22, transform: [{ scaleX: -1 }, { rotate: "-20deg" }] }}
						accessibilityLabel="Logo Hannusato"
					/>
				</Animated.View>
			)}
		/>
	);
});

export default SearchBarComponent;
