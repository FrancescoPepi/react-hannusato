import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import OnboardingCarousel from "@/components/OnboardingCarousel";

const { width } = Dimensions.get("window");

export default function ExploreScreen() {
	return (
		<LinearGradient
			colors={["#56a06f", "#002f06"]}
			style={styles.container}
		>
			{/* <View style={styles.headerContainer}> */}
			{/* <Image
					source={require("@/assets/images/logo.png")}
					style={styles.headerImage}
					accessibilityLabel="Logo Hannusato"
				/> */}
			{/* <ThemedText
					type="title"
					style={styles.headerTitle}
				>
					Guida all'App
				</ThemedText>
			</View> */}

			{/* Onboarding Carousel */}
			<OnboardingCarousel />
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		alignItems: "center",
		paddingTop: 50,
		paddingBottom: 20,
	},
	headerImage: {
		width: 100,
		height: 100,
		resizeMode: "contain",
	},
	headerTitle: {
		color: "white",
		fontSize: 24,
		marginTop: 10,
	},
	titleContainer: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginBottom: 10,
	},
	imageContainer: {
		marginVertical: 15,
		alignItems: "center",
	},
	featureImage: {
		width: width - 40,
		height: 200,
		resizeMode: "contain",
		borderRadius: 10,
		marginBottom: 5,
	},
	imageCaption: {
		fontStyle: "italic",
		textAlign: "center",
		marginTop: 5,
	},
});
