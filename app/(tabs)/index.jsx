import React, { useEffect, useState } from "react";
import {
	StatusBar,
	Image,
	StyleSheet,
	View,
	ActivityIndicator,
	Dimensions,
	PixelRatio,
	Text,
	Platform,
	Modal,
	Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { CustomFadeInUp, CustomFadeOutUp } from "@/animations/customAnimations";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";

import { HelloWave } from "@/components/HelloWave";
import SearchBarComponent from "@/components/SearchBar";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import AnimatedPhrase from "@/components/AnimatedPhrase";
import FlashListCustom2 from "@/components/FlashListCustom2";
import { useAppContext } from "@/context/AppContext";
import { stars } from "@/constants/stars.js";
import { platformDescriptions } from "@/constants/descriptions.js";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;

export function normalize(size) {
	const newSize = size * scale;
	return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function HomeScreen() {
	const [selectedSource, setSelectedSource] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

	const openModal = (source) => {
		setSelectedSource(source);
		setModalVisible(true);
	};

	const { searchQuery, setSearchQuery, searchHistory, isLoading } = useAppContext();

	const renderStars = (count) => {
		return "⭐".repeat(count);
	};

	const router = useRouter();

	const handleSearchFromHome = (term) => {
		if (!term) return;
		// Don't clear searchQuery here as it prevents typing in the search screen
		router.push({ pathname: "/search", params: { initialQuery: term } });
	};

	const logoMap = {
		subito: require("@/assets/images/logo/subito.png"),
		vinted: require("@/assets/images/logo/vinted.png"),
		ebay: require("@/assets/images/logo/ebay.png"),
		wallapop: require("@/assets/images/logo/wallapop.png"),
	};

	return (
		<>
			{Platform.OS === "ios" ? (
				<StatusBar
					style="light"
					hidden={false}
				/>
			) : (
				<StatusBar
					style="light"
					hidden={true}
				/>
			)}
			<ParallaxScrollView
				headerBackgroundColor={{ light: "#56a06f", dark: "#56a06f" }}
				headerImage={
					<Image
						source={require("@/assets/images/logo.png")}
						style={styles.reactLogo}
						accessibilityLabel="Logo Hannusato"
					/>
				}
				stickyHeader={
					<SearchBarComponent
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						onSearch={handleSearchFromHome}
					/>
				}
				isLoading={isLoading}
				loading={!searchHistory.length}
			>
				{isLoading ? (
					<ActivityIndicator
						size="large"
						color="#56a06f"
					/>
				) : null}

				<View style={styles.boxContainer}>
					<AnimatedPhrase />

					{!searchHistory.length ? null : (
						<View style={styles.recentSearchesContainer}>
							<Text style={styles.recentSearchesTitle}>Ricerche recenti</Text>
							{searchHistory.map((term, index) => (
								<LinearGradient
									key={index}
									colors={["#56a06f", "#002f06"]}
									style={styles.recentSearchItem}
								>
									<Text
										style={styles.recentSearchText}
										onPress={() => handleSearchFromHome(term)}
										accessibilityLabel={`Cerca ${term}`}
										accessibilityRole="button"
									>
										{term}
									</Text>
								</LinearGradient>
							))}
						</View>
					)}

					{Object.keys(logoMap).map((source) => (
						<Pressable
							key={source}
							onPress={() => openModal(source)}
						>
							<View
								key={source}
								style={styles.textContainer}
							>
								<Image
									source={logoMap[source.toLowerCase()]}
									resizeMode="contain"
									style={styles.filterIcon}
									accessibilityLabel={`Logo ${source}`}
								/>
								<View
									style={{ justifyContent: "space-between" }}
									className="flex flex-row w-full"
								>
									<Text style={styles.filterText}>Facilità d'uso</Text>
									<Text style={styles.filterText}>{renderStars(stars[source].uso)}</Text>
								</View>
								<View
									style={{ justifyContent: "space-between" }}
									className="flex flex-row w-full"
								>
									<Text style={styles.filterText}>Numero visite mensili</Text>
									<Text style={styles.filterText}>{renderStars(stars[source].visite)}</Text>
								</View>
								<View
									style={{ justifyContent: "space-between" }}
									className="flex flex-row w-full"
								>
									<Text style={styles.filterText}>Sicurezza</Text>
									<Text style={styles.filterText}>{renderStars(stars[source].sicurezza)}</Text>
								</View>
								<View
									style={{ justifyContent: "space-between" }}
									className="flex flex-row w-full"
								>
									<Text style={styles.filterText}>Servizio clienti</Text>
									<Text style={styles.filterText}>{renderStars(stars[source].service)}</Text>
								</View>
							</View>
						</Pressable>
					))}
					<SafeAreaProvider>
						<SafeAreaView style={styles.centeredView}>
							<Modal
								visible={modalVisible}
								animationType="slide"
								transparent={true}
								onRequestClose={() => setModalVisible(false)}
							>
								<View style={styles.modalOverlay}>
									<View style={styles.modalContent}>
										{selectedSource && (
											<>
												<Text style={styles.modalTitle}>{selectedSource.toUpperCase()}</Text>
												<Text style={styles.modalText}>{platformDescriptions[selectedSource]?.breve}</Text>
												{platformDescriptions[selectedSource]?.dettagli.map((riga, index) => (
													<Text
														key={index}
														style={styles.modalText}
													>
														• {riga}
													</Text>
												))}
											</>
										)}

										<Pressable
											onPress={() => setModalVisible(false)}
											style={styles.modalButton}
										>
											<Text style={styles.modalButtonText}>Chiudi</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
						</SafeAreaView>
					</SafeAreaProvider>
				</View>
			</ParallaxScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		width: "80%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	modalText: {
		fontSize: 16,
		marginBottom: 5,
	},
	modalButton: {
		marginTop: 15,
		backgroundColor: "#007AFF",
		paddingVertical: 10,
		borderRadius: 10,
	},
	modalButtonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},

	reactLogo: {
		width: 300,
		height: 200,
		resizeMode: "contain",
	},
	boxContainer: {
		padding: 10,
		marginTop: 10,
		marginBottom: 70,
	},
	textContainer: {
		backgroundColor: "#002f06",
		borderRadius: 10,
		padding: 15,
		marginVertical: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	filterIcon: {
		width: 100,
		height: 50,
		marginBottom: 10,
		alignSelf: "center",
	},
	filterText: {
		color: "#fff",
		fontSize: 14,
		marginVertical: 2,
	},
	recentSearchesContainer: {
		padding: 15,
		marginTop: 10,
	},
	recentSearchesTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 10,
	},
	recentSearchItem: {
		padding: 12,
		borderRadius: 8,
		marginVertical: 5,
	},
	recentSearchText: {
		color: "#fff",
		fontSize: 16,
	},
});
