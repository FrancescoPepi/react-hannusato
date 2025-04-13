import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View, Image, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, ImageSourcePropType } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import InputRange from "@/components/InputRange";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
interface DropdownFilterProps {
	disabled: boolean;
	logoMap: { [key: string]: ImageSourcePropType };
	selectedSources: string[];
	onFilterChange: (selected: string[]) => void;
	titleFilterActive: boolean;
	onTitleFilterToggle: (active: boolean) => void;
	// Add new props for price filter
	minPrice?: number;
	maxPrice?: number;
	priceRange?: [number, number];
	onPriceRangeChange?: (range: [number, number]) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
	disabled,
	logoMap,
	selectedSources,
	onFilterChange,
	titleFilterActive,
	onTitleFilterToggle,
	minPrice = 0,
	maxPrice = 1000,
	priceRange = [0, 1000],
	onPriceRangeChange = () => {},
}) => {
	const [open, setOpen] = useState(false);
	const isOpen = useSharedValue(0);
	const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
	const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);

	// Funzione per alternare il menu principale
	const toggleMenu = () => {
		isOpen.value = isOpen.value ? 0 : 1;
	};

	const toggleDropdown = () => {
		setOpen((prev) => !prev);
	};

	const colorScheme = useColorScheme();

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
			onFilterChange(selectedSources.filter((s) => s !== lowerSource));
		} else {
			onFilterChange([...selectedSources, lowerSource]);
		}
	};

	// Function to open price filter modal
	const openPriceModal = () => {
		setTempPriceRange(priceRange);
		setIsPriceModalVisible(true);
	};

	// Function to apply price filter and close modal
	const applyPriceFilter = () => {
		onPriceRangeChange(tempPriceRange);
		setIsPriceModalVisible(false);
	};

	// Function to cancel price filter and close modal
	const cancelPriceFilter = () => {
		setTempPriceRange(priceRange);
		setIsPriceModalVisible(false);
	};
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<View style={styles.dropdownContainer}>
			{/* Pulsante principale per aprire/chiudere il dropdown */}
			<TouchableOpacity
				style={styles.dropdownButton}
				onPress={toggleDropdown}
			>
				<Animated.View style={fabAnimatedStyle}>
					<Ionicons
						name="filter"
						size={24}
						color="#494949"
					/>
				</Animated.View>
				<Ionicons
					name={open ? "chevron-up" : "chevron-down"}
					size={20}
					color="#494949"
				/>
			</TouchableOpacity>
			{open && !disabled && (
				<View style={styles.dropdownContent}>
					{Object.keys(logoMap).map((source, index) => {
						const isActive = selectedSources.includes(source.toLowerCase());
						return (
							<React.Fragment key={source}>
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
								<LinearGradient
									colors={["transparent", "#737373", "transparent"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={[styles.gradient, { opacity: colorScheme === "dark" ? 1 : 0.25 }]}
								/>
							</React.Fragment>
						);
					})}
					{/* <LinearGradient
						colors={["transparent", "#737373", "transparent"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={[styles.gradient, { opacity: colorScheme === "dark" ? 1 : 0.25 }]}
					/> */}
					{/* Opzione per attivare/disattivare il filtro per titolo */}
					<TouchableOpacity
						style={[styles.filterOption, titleFilterActive && styles.activeFilterOption]}
						onPress={() => onTitleFilterToggle(!titleFilterActive)}
					>
						<Ionicons
							name={titleFilterActive ? "checkbox" : "square-outline"}
							size={24}
							color="#494949"
							style={{ marginRight: 5 }}
						/>
						<Text style={styles.filterText}>FILTRA PER TITOLO</Text>
					</TouchableOpacity>
					<LinearGradient
						colors={["transparent", "#737373", "transparent"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={[styles.gradient, { opacity: colorScheme === "dark" ? 1 : 0.25 }]}
					/>
					{/* Opzione per il filtro prezzo */}
					<SafeAreaProvider>
						<SafeAreaView style={styles.centeredView}>
							{/* <Modal
								animationType="slide"
								transparent={true}
								visible={modalVisible}
								onRequestClose={() => {
									Alert.alert("Modal has been closed.");
									setModalVisible(!modalVisible);
								}}
							>
								<View style={styles.centeredView}>
									<View style={styles.modalView}>
										<Text style={styles.modalText}>Hello World!</Text>
										<Pressable
											style={[styles.button, styles.buttonClose]}
											onPress={() => setModalVisible(!modalVisible)}
										>
											<Text style={styles.textStyle}>Hide Modal</Text>
										</Pressable>
									</View>
								</View>
							</Modal> */}

							{/*<Modal
								animationType="slide"
								transparent={true}
								visible={isPriceModalVisible}
								onRequestClose={cancelPriceFilter}
							>
								<View style={styles.modalOverlay}>
									<View style={styles.modalContent}>
										<LinearGradient
											colors={["#56a06f", "#002f06"]}
											style={styles.modalHeader}
										>
											<Text style={styles.modalTitle}>Filtro Prezzo</Text>
										</LinearGradient>

										<View style={styles.priceRangeContainer}>
											<Text style={styles.priceRangeText}>
												Min: €{tempPriceRange[0]} - Max: €{tempPriceRange[1]}
											</Text>

											<Text style={styles.sliderLabel}>Prezzo Minimo</Text>
											<Slider
												style={styles.slider}
												minimumValue={minPrice}
												maximumValue={maxPrice}
												step={10}
												value={tempPriceRange[0]}
												onValueChange={(value) => {
													// Ensure min doesn't exceed max
													if (value <= tempPriceRange[1]) {
														setTempPriceRange([value, tempPriceRange[1]]);
													}
												}}
												minimumTrackTintColor="#56a06f"
												maximumTrackTintColor="#d3d3d3"
												thumbTintColor="#56a06f"
											/>

											<Text style={styles.sliderLabel}>Prezzo Massimo</Text>
											<Slider
												style={styles.slider}
												minimumValue={minPrice}
												maximumValue={maxPrice}
												step={10}
												value={tempPriceRange[1]}
												onValueChange={(value) => {
													// Ensure max doesn't go below min
													if (value >= tempPriceRange[0]) {
														setTempPriceRange([tempPriceRange[0], value]);
													}
												}}
												minimumTrackTintColor="#56a06f"
												maximumTrackTintColor="#d3d3d3"
												thumbTintColor="#56a06f"
											/>
											<Text style={styles.sliderLabel}>Range di Prezzo</Text>
											<InputRange
												min={minPrice}
												max={maxPrice}
												steps={1}
												onValueChange={(range: any) => {
													// Converti i valori in numeri con il + e imposta correttamente min e max
													const minValue = +range.min;
													const maxValue = +range.max;
													setTempPriceRange([minValue, maxValue]);
												}}
											/>
										</View>

										<View style={styles.modalButtons}>
											<TouchableOpacity
												style={styles.cancelButton}
												onPress={cancelPriceFilter}
											>
												<Text style={styles.buttonText}>Annulla</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.applyButton}
												onPress={applyPriceFilter}
											>
												<Text style={styles.buttonText}>Applica</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</Modal> */}
							<Modal
								animationType="slide"
								transparent={true}
								visible={isPriceModalVisible}
								onRequestClose={cancelPriceFilter}
							>
								<View style={styles.modalOverlay}>
									<View style={styles.modalContent}>
										<LinearGradient
											colors={["#56a06f", "#002f06"]}
											style={styles.modalHeader}
										>
											<Text style={styles.modalTitle}>Filtro Prezzo</Text>
										</LinearGradient>

										<View style={{ flexGrow: 1, padding: 20 }}>
											<Text style={styles.priceRangeText}>
												Min: €{tempPriceRange[0]} - Max: €{tempPriceRange[1]}
											</Text>

											{/* <Text style={styles.sliderLabel}>Range di Prezzo</Text> */}
											<InputRange
												min={minPrice}
												max={maxPrice}
												steps={1}
												onValueChange={(range: any) => {
													setTempPriceRange([range.min, range.max]);
												}}
											/>
										</View>

										<View style={styles.modalButtons}>
											<TouchableOpacity
												style={styles.cancelButton}
												onPress={cancelPriceFilter}
											>
												<Text style={styles.buttonText}>Annulla</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.applyButton}
												onPress={applyPriceFilter}
											>
												<Text style={styles.buttonText}>Applica</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</Modal>

							<TouchableOpacity
								style={[
									styles.filterOption,
									priceRange[0] > minPrice || priceRange[1] < maxPrice ? styles.activeFilterOption : null,
								]}
								onPress={openPriceModal}
								// onPress={() => setModalVisible(!modalVisible)}
							>
								<Ionicons
									name="cash-outline"
									size={24}
									color="#494949"
									style={{ marginRight: 5 }}
								/>
								<Text style={styles.filterText}>FILTRA PER PREZZO</Text>
							</TouchableOpacity>

							{/* <Pressable
								style={[styles.button, styles.buttonOpen]}
								onPress={() => setModalVisible(true)}
							>
								<Text style={styles.textStyle}>Show Modal</Text> */}
							{/* </Pressable> */}
						</SafeAreaView>
					</SafeAreaProvider>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},

	gradient: {
		height: 1, // h-px: altezza di 1px
		backgroundColor: "transparent", // bg-transparent
	},
	dropdownContainer: {
		position: "relative",
	},
	dropdownButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#ededed",
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderRadius: 80,
	},
	dropdownButtonText: {
		fontSize: 16,
		color: "#494949",
	},
	dropdownContent: {
		position: "absolute",
		top: 55, // distanza dal bottone; modifica se necessario
		// left: -10,
		right: 0,
		// marginTop: 25,
		width: 200,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		paddingVertical: 10,
	},
	filterOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	activeFilterOption: {
		backgroundColor: "#87b697",
	},
	filterIcon: {
		width: 68,
		height: 28,
		marginRight: 5,
	},
	filterText: {
		fontSize: 16,
		color: "#494949",
	},
	// Modal styles
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	// modalContent: {
	// 	width: "80%",
	// 	backgroundColor: "white",
	// 	borderRadius: 10,
	// 	overflow: "hidden",
	// 	elevation: 5,
	// 	shadowColor: "#000",
	// 	shadowOffset: { width: 0, height: 2 },
	// 	shadowOpacity: 0.25,
	// 	shadowRadius: 3.84,
	// },
	modalContent: {
		width: "70%",
		// maxHeight: "80%", // ← Aggiunto
		backgroundColor: "white",
		borderRadius: 10,
		overflow: "hidden",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},

	modalHeader: {
		padding: 15,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
	priceRangeContainer: {
		padding: 20,
	},
	priceRangeText: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 15,
		color: "#494949",
	},
	sliderLabel: {
		fontSize: 14,
		marginTop: 10,
		marginBottom: 5,
		color: "#494949",
	},
	slider: {
		width: "100%",
		height: 40,
	},
	modalButtons: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#eee",
	},
	cancelButton: {
		flex: 1,
		padding: 15,
		alignItems: "center",
		backgroundColor: "#ccc",
	},
	applyButton: {
		flex: 1,
		padding: 15,
		alignItems: "center",
		backgroundColor: "#56a06f",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default DropdownFilter;
