// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
// import { PanGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";
// import Animated, {
// 	useAnimatedStyle,
// 	useSharedValue,
// 	useAnimatedProps,
// 	runOnJS,
// 	withtiming,
// 	withTiming,
// 	useAnimatedGestureHandler,
// } from "react-native-reanimated";

// const WIDTH = Dimensions.get("window").width - 40;
// const KONBSIZE = 20;
// const MAXWIDTH = (WIDTH - KONBSIZE) / 2 + 6;

// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
// const InputRange = ({ min, max, steps, onValueChange }) => {
// 	const xKnob1 = useSharedValue(0);
// 	const scaleKnob1 = useSharedValue(1);
// 	const xKnob2 = useSharedValue(MAXWIDTH);
// 	const scaleKnob2 = useSharedValue(1);

// 	const gestureHandler1 = useAnimatedGestureHandler({
// 		onStart: (_, ctx) => {
// 			ctx.startX = xKnob1.value;
// 		},
// 		onActive: (event, ctx) => {
// 			scaleKnob1.value = 1.3;
// 			xKnob1.value =
// 				ctx.startX + event.translationX < 0
// 					? 0
// 					: ctx.startX + event.translationX > MAXWIDTH
// 					? MAXWIDTH
// 					: ctx.startX + event.translationX;
// 		},
// 		onEnd: () => {
// 			scaleKnob1.value = 1;
// 			runOnJS(onValueChange)({
// 				min: `${Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 				max: `${Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 			}); // Call the callback functio
// 		},
// 	});

// 	const gestureHandler2 = useAnimatedGestureHandler({
// 		onStart: (_, ctx) => {
// 			ctx.startX = xKnob2.value;
// 		},
// 		onActive: (event, ctx) => {
// 			scaleKnob2.value = 1.3;
// 			xKnob2.value =
// 				ctx.startX + event.translationX < xKnob1.value
// 					? xKnob1.value
// 					: ctx.startX + event.translationX > MAXWIDTH
// 					? MAXWIDTH
// 					: ctx.startX + event.translationX;
// 		},
// 		onEnd: () => {
// 			scaleKnob2.value = 1;
// 			runOnJS(onValueChange)({
// 				min: `${Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 				max: `${Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 			});
// 		},
// 	});

// 	const styleLine = useAnimatedStyle(() => {
// 		return {
// 			backgroundColor: "#FFA500", // Cambiato da "#orange" a "#FFA500" (codice esadecimale per arancione)
// 			height: 3,
// 			marginTop: -3,
// 			borderRadius: 3,
// 			width: xKnob2.value - xKnob1.value,
// 			// width: xKnob2.value,
// 			transform: [{ translateX: xKnob1.value }],
// 		};
// 	});
// 	const styleKnob1 = useAnimatedStyle(() => {
// 		return {
// 			transform: [{ translateX: xKnob1.value }, { scale: scaleKnob1.value }],
// 		};
// 	});
// 	const styleKnob2 = useAnimatedStyle(() => {
// 		return {
// 			transform: [{ translateX: xKnob2.value }, { scale: scaleKnob2.value }],
// 		};
// 	});

// 	const popsLabel1 = useAnimatedProps(() => {
// 		return {
// 			text: `${Math.round((min + (xKnob1.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 		};
// 	});
// 	const popsLabel2 = useAnimatedProps(() => {
// 		return {
// 			text: `${Math.round((min + (xKnob2.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
// 		};
// 	});
// 	return (
// 		<View>
// 			<View style={styles.container}>
// 				{/* <View style={styles.labelContainer}>
// 					<AnimatedTextInput
// 						defaultValue={0}
// 						editable={false}
// 						style={styles.labelText}
// 						animatedProps={popsLabel1}
// 					/>
// 					<AnimatedTextInput
// 						defaultValue={`${max}`}
// 						editable={true}
// 						style={styles.labelText}
// 						animatedProps={popsLabel2}
// 					/>
// 				</View> */}
// 			</View>
// 			<View style={styles.track} />
// 			<Animated.View style={styleLine} />
// 			{/* <View>
// 				<PanGestureHandler onGestureEvent={gestureHandler1}>
// 					<Animated.View style={[styles.knob, styleKnob1]} />
// 				</PanGestureHandler>
// 				<PanGestureHandler onGestureEvent={gestureHandler2}>
// 					<Animated.View style={[styles.knob, styleKnob2]} />
// 				</PanGestureHandler>
// 			</View> */}
// 			<Animated.View style={[styles.knobWrapper, styleKnob1]}>
// 				<PanGestureHandler onGestureEvent={gestureHandler1}>
// 					<Animated.View style={styles.knob} />
// 				</PanGestureHandler>
// 			</Animated.View>
// 			<Animated.View style={[styles.knobWrapper, styleKnob2]}>
// 				<PanGestureHandler onGestureEvent={gestureHandler2}>
// 					<Animated.View style={styles.knob} />
// 				</PanGestureHandler>
// 			</Animated.View>
// 		</View>
// 	);
// };

// const styles = StyleSheet.create({
// 	knobWrapper: {
// 		position: "absolute",
// 		width: 40,
// 		height: 40,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		top: -KONBSIZE + 8,
// 	},

// 	container: {
// 		// padding: 20,
// 		backgroundColor: "#fff",
// 		borderBottomWidth: 20,
// 		borderBottomColor: "#cccdb2",
// 	},
// 	labelContainer: {
// 		// width: MAXWIDTH,
// 		flexDirection: "row",
// 		justifyContent: "space-between",
// 		marginBottom: 18,
// 	},
// 	labelText: {
// 		fontSize: 12,
// 		color: "#333",
// 	},
// 	track: {
// 		height: 3,
// 		backgroundColor: "#cccdb2",
// 		borderRadius: 3,
// 	},
// 	knob: {
// 		position: "absolute",
// 		width: KONBSIZE,
// 		height: KONBSIZE,
// 		borderRadius: KONBSIZE / 2,
// 		borderColor: "#9c44dc",
// 		borderWidth: 2,
// 		backgroundColor: "#FFF",
// 		marginTop: -KONBSIZE + 8,
// 		marginLeft: -8,
// 	},
// });
// export default InputRange;

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const screenWidth = Dimensions.get("window").width;
const sliderWidth = screenWidth * 0.55; // ad esempio 80%
const InputRange = ({ min = 0, max = 1000, steps = 1, onValueChange }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Seleziona range di prezzo</Text>
			<MultiSlider
				values={[min, max]}
				min={min}
				max={max}
				step={steps}
				onValuesChangeFinish={(values) => {
					onValueChange({ min: values[0], max: values[1] });
				}}
				// selectedStyle={{ backgroundColor: "#56a06f" }}
				// markerStyle={{ backgroundColor: "#56a06f" }}
				sliderLength={sliderWidth} // <-- larghezza (in alternativa al wrapper)
				selectedStyle={{ backgroundColor: "#56a06f" }} // linea tra i due knob
				unselectedStyle={{ backgroundColor: "#ccc" }} // linee esterne
				markerStyle={{
					backgroundColor: "#fff",
					borderColor: "#56a06f",
					borderWidth: 2,
					height: 20,
					width: 20,
				}} // stile knob
				pressedMarkerStyle={{
					backgroundColor: "#56a06f",
				}}
				containerStyle={{ marginTop: 10 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// paddingVertical: 20,
		paddingHorizontal: 5,
	},
	label: {
		textAlign: "center",
		// marginBottom: 10,
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default InputRange;
