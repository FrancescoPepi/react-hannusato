import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	withSequence,
	Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");
const ITEM_SIZE = 220;

// Number of skeleton items to show while loading
const NUM_SKELETONS = 5;

const SkeletonItem = () => {
	// Animation for the shimmer effect
	const shimmerPosition = useSharedValue(-width);

	useEffect(() => {
		// Create a repeating animation that moves the gradient from left to right
		shimmerPosition.value = withRepeat(
			withTiming(width * 2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
			-1, // Infinite repetition
			false // Don't reverse the animation
		);
	}, []);

	const shimmerStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: shimmerPosition.value }],
	}));

	return (
		<View className="p-1 w-full h-[220px] rounded-xl overflow-hidden bg-bgCard mt-5 flex-row">
			{/* Left side - Image placeholder */}
			<View className="p-1 rounded-xl flex-1 h-full bg-bgCard relative">
				<View className="h-10 items-start absolute top-0 left-0 z-20 border-4 border-bgCard rounded-xl">
					<View style={styles.logoPlaceholder} />
				</View>
				<View
					className="rounded-xl flex-1 h-full overflow-hidden"
					style={styles.imagePlaceholder}
				>
					{/* Shimmer effect overlay */}
					<Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
						<LinearGradient
							colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0)"]}
							start={{ x: 0, y: 0.5 }}
							end={{ x: 1, y: 0.5 }}
							style={StyleSheet.absoluteFill}
						/>
					</Animated.View>
				</View>
			</View>

			{/* Right side - Text placeholder */}
			<View className="p-1 rounded-xl flex-1 h-full bg-bgCard relative">
				<View className="h-10 items-start absolute bottom-0 right-0 z-10 border-4 border-bgCard rounded-xl">
					<View style={styles.pricePlaceholder} />
				</View>
				<View
					className="p-1 rounded-xl flex-1 h-full"
					style={styles.contentPlaceholder}
				>
					{/* Title placeholder lines */}
					<View style={styles.titleLine} />
					<View style={[styles.titleLine, { width: "75%" }]} />
					<View style={[styles.titleLine, { width: "60%" }]} />

					{/* Shimmer effect overlay */}
					<Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
						<LinearGradient
							colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0)"]}
							start={{ x: 0, y: 0.5 }}
							end={{ x: 1, y: 0.5 }}
							style={StyleSheet.absoluteFill}
						/>
					</Animated.View>
				</View>
			</View>
		</View>
	);
};

const SkeletonLoader = () => {
	return (
		<LinearGradient
			colors={["#56a06f", "#002f06"]}
			style={styles.container}
		>
			<View style={styles.listContainer}>
				{/* Header placeholder */}
				<LinearGradient
					colors={["#007280", "#56a06f"]}
					style={styles.headerPlaceholder}
				>
					<View style={styles.headerTextPlaceholder} />
				</LinearGradient>

				{/* Generate multiple skeleton items */}
				{Array.from({ length: NUM_SKELETONS }).map((_, index) => (
					<SkeletonItem key={index} />
				))}
			</View>
			<View style={[styles.touchableUp, styles.shadow, { padding: 8, aspectRatio: 1 / 1, width: 60 }]}></View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 2,
	},
	touchableUp: {
		position: "absolute",
		bottom: 30,
		right: 10,
		backgroundColor: "rgba(255,255,255,0.3)",
		padding: 10,
		borderRadius: 40,
		zIndex: 10,
		aspectRatio: 1 / 1,
		opacity: 0.9,
	},
	container: {
		width: "100%",
		height: "100%",
	},
	listContainer: {
		padding: 10,
		paddingTop: 70,
		paddingBottom: 65,
	},
	headerPlaceholder: {
		borderRadius: 10,
		marginTop: 10,
		padding: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTextPlaceholder: {
		width: "60%",
		height: 30,
		backgroundColor: "rgba(255,255,255,0.3)",
		borderRadius: 8,
	},
	imagePlaceholder: {
		backgroundColor: "#3a3a3a",
	},
	logoPlaceholder: {
		width: 80,
		height: 30,
		backgroundColor: "#3a3a3a",
		borderRadius: 10,
	},
	pricePlaceholder: {
		width: 80,
		height: 30,
		backgroundColor: "#3a3a3a",
		borderRadius: 10,
	},
	contentPlaceholder: {
		backgroundColor: "#3a3a3a",
		padding: 10,
	},
	titleLine: {
		height: 18,
		backgroundColor: "#4a4a4a",
		borderRadius: 4,
		marginBottom: 10,
	},
});

export default SkeletonLoader;
