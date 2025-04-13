import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Onboarding data with steps
const onboardingData = [
	{
		id: "1",
		title: "Benvenuto in Hannusato!",
		description: "Scopri come trovare i migliori affari dell'usato da diverse piattaforme in un'unica app.",
		image: require("@/assets/images/logo.png"),
		backgroundColor: ["#56a06f", "#002f06"],
	},
	{
		id: "2",
		title: "Ricerca Prodotti",
		description: "Usa la barra di ricerca per trovare prodotti su tutte le piattaforme supportate contemporaneamente.",
		image: require("@/assets/images/logo.png"),
		backgroundColor: ["#56a06f", "#002f06"],
		// backgroundColor: ["#56a06f", "#003f16"],
		icon: "search-outline",
	},
	{
		id: "3",
		title: "Filtra i Risultati",
		description: "Filtra per piattaforma, titolo o intervallo di prezzo per trovare esattamente ciò che cerchi.",
		image: require("@/assets/images/logo.png"),
		backgroundColor: ["#56a06f", "#002f06"],
		// backgroundColor: ["#56a06f", "#004f26"],
		icon: "filter-outline",
	},
	{
		id: "4",
		title: "Filtri",
		description:
			"1. Filtra per piattaforma.\n2. Filtra i risutltati che contengono la tua ricerca nel titolo\n3. Seleziona l'intervallo di prezzo per trovare esattamente ciò che cerchi.",
		image: require("@/assets/images/help/imgFilter.png"),
		backgroundColor: ["#56a06f", "#002f06"],
		// backgroundColor: ["#56a06f", "#004f26"],
		// icon: "filter-outline",
	},
	{
		id: "5",
		title: "Confronta i Prezzi",
		description:
			"I prezzi sono codificati per colore: verde per i più economici, arancione per i medi e rosso per i più costosi.",
		image: require("@/assets/images/logo.png"),
		backgroundColor: ["#56a06f", "#002f06"],
		// backgroundColor: ["#56a06f", "#005f36"],
		icon: "pricetag-outline",
	},
	{
		id: "6",
		title: "Visualizza i Dettagli",
		description:
			"Tocca una scheda prodotto per visualizzare l'annuncio originale direttamente sulla piattaforma di riferimento.",
		image: require("@/assets/images/logo.png"),
		backgroundColor: ["#56a06f", "#002f06"],
		// backgroundColor: ["#56a06f", "#006f46"],
		icon: "open-outline",
	},
];

const OnboardingCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef(null);
	const scrollX = useSharedValue(0);

	// Animation for dots
	const animateDot = (index) => {
		return useAnimatedStyle(() => {
			const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
			const scale = interpolate(scrollX.value, inputRange, [0.8, 1.4, 0.8], "clamp");
			const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], "clamp");
			return {
				transform: [{ scale }],
				opacity,
			};
		});
	};

	// Handle scroll event
	const handleScroll = (event) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		scrollX.value = scrollPosition;
		setCurrentIndex(Math.round(scrollPosition / width));
	};

	// Navigate to next slide
	const goToNextSlide = () => {
		if (currentIndex < onboardingData.length - 1) {
			flatListRef.current?.scrollToIndex({
				index: currentIndex + 1,
				animated: true,
			});
		}
	};

	// Navigate to previous slide
	const goToPrevSlide = () => {
		if (currentIndex > 0) {
			flatListRef.current?.scrollToIndex({
				index: currentIndex - 1,
				animated: true,
			});
		}
	};

	// Render onboarding item
	const renderItem = ({ item, index }) => {
		return (
			<View style={styles.slide}>
				<LinearGradient
					colors={item.backgroundColor}
					style={styles.gradientContainer}
				>
					<View style={styles.slideContent}>
						{item.icon ? (
							<View style={styles.iconContainer}>
								<Ionicons
									name={item.icon}
									size={80}
									color="white"
								/>
							</View>
						) : (
							<Image
								source={item.image}
								style={styles.image}
								resizeMode="contain"
							/>
						)}
						<View style={styles.textContainer}>
							<ThemedText
								type="title"
								style={styles.title}
							>
								{item.title}
							</ThemedText>
							<ThemedText style={styles.description}>{item.description}</ThemedText>
						</View>
					</View>
				</LinearGradient>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={onboardingData}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			/>

			{/* Navigation buttons */}
			<View style={styles.navigationContainer}>
				<TouchableOpacity
					style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
					onPress={goToPrevSlide}
					disabled={currentIndex === 0}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color={currentIndex === 0 ? "#888" : "white"}
					/>
				</TouchableOpacity>

				{/* Pagination dots */}
				<View style={styles.paginationContainer}>
					{onboardingData.map((_, index) => (
						<Animated.View
							key={index}
							style={[styles.dot, index === currentIndex && styles.activeDot, animateDot(index)]}
						/>
					))}
				</View>

				<TouchableOpacity
					style={[styles.navButton, currentIndex === onboardingData.length - 1 && styles.disabledButton]}
					onPress={goToNextSlide}
					disabled={currentIndex === onboardingData.length - 1}
				>
					<Ionicons
						name="chevron-forward"
						size={24}
						color={currentIndex === onboardingData.length - 1 ? "#888" : "white"}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#002f06",
		paddingVertical: 80,
	},
	slide: {
		width,
		height: height * 0.7,
		justifyContent: "center",
		alignItems: "center",
	},
	gradientContainer: {
		width: width - 40,
		height: "100%",
		borderRadius: 20,
		overflow: "hidden",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	slideContent: {
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: 300,
		height: 200,
		marginBottom: 30,
	},
	iconContainer: {
		width: 150,
		height: 150,
		borderRadius: 75,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
	},
	textContainer: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginBottom: 15,
		textAlign: "center",
	},
	description: {
		fontSize: 16,
		color: "white",
		textAlign: "center",
		lineHeight: 24,
	},
	navigationContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	paginationContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		marginHorizontal: 5,
	},
	activeDot: {
		backgroundColor: "white",
	},
	navButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	disabledButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
});

export default OnboardingCarousel;
