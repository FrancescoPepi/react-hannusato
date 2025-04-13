import React, { useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import FlashListCustom2 from "@/components/FlashListCustom2";
import Animated from "react-native-reanimated";
import { CustomFadeInUp, CustomFadeOutUp } from "@/animations/customAnimations";
import { useAppContext } from "@/context/AppContext";

export default function Search() {
	const { initialQuery } = useLocalSearchParams();
	const { searchQuery, setSearchQuery, fetchData, filteredData, isLoading } = useAppContext();

	// Use a ref to track if this is the first render
	const initialRenderRef = useRef(true);

	useEffect(() => {
		// Process initialQuery whenever it changes
		if (initialQuery) {
			// console.log('Search screen - useEffect - initialQuery:', initialQuery);
			// console.log('Search screen - useEffect - current searchQuery:', searchQuery);
			setSearchQuery(initialQuery);
			fetchData(initialQuery);
			// console.log('Search screen - useEffect - after setSearchQuery called');
		}
	}, [initialQuery]); // Dependency on initialQuery ensures it runs whenever initialQuery changes

	return (
		<Animated.View
			entering={CustomFadeInUp}
			exiting={CustomFadeOutUp}
		>
			<FlashListCustom2
				data={filteredData}
				logoMap={{
					subito: require("@/assets/images/logo/subito.png"),
					vinted: require("@/assets/images/logo/vinted.png"),
					ebay: require("@/assets/images/logo/ebay.png"),
					wallapop: require("@/assets/images/logo/wallapop.png"),
				}}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onSearch={(query) => {
					// console.log('Search screen - onSearch - query:', query);
					// console.log('Search screen - onSearch - current searchQuery:', searchQuery);
					setSearchQuery(query);
					fetchData(query);
					// console.log('Search screen - onSearch - after setSearchQuery and fetchData called');
				}}
				isLoading={isLoading}
			/>
		</Animated.View>
	);
}
