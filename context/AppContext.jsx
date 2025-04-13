import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Creazione del context
const AppContext = createContext();

// Hook personalizzato per utilizzare il context
export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext deve essere utilizzato all'interno di un AppProvider");
	}
	return context;
};

// Provider del context
export const AppProvider = ({ children }) => {
	// Stato per i dati di ricerca
	const [searchData, setSearchData] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Stato per i filtri
	const [selectedSources, setSelectedSources] = useState([]);
	const [isTitleFilterActive, setIsTitleFilterActive] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Cache per i risultati delle ricerche
	const [searchCache, setSearchCache] = useState({});

	// Carica la cronologia delle ricerche all'avvio
	useEffect(() => {
		const loadSearchHistory = async () => {
			try {
				const storedHistory = await AsyncStorage.getItem("searchHistory");
				if (storedHistory) {
					setSearchHistory(JSON.parse(storedHistory));
				}
			} catch (error) {
				console.error("Errore nel caricamento della cronologia:", error);
			}
		};

		loadSearchHistory();
	}, []);

	// Salva la cronologia delle ricerche quando cambia
	useEffect(() => {
		const saveSearchHistory = async () => {
			try {
				await AsyncStorage.setItem("searchHistory", JSON.stringify(searchHistory));
			} catch (error) {
				console.error("Errore nel salvataggio della cronologia:", error);
			}
		};

		if (searchHistory.length > 0) {
			saveSearchHistory();
		}
	}, [searchHistory]);

	// Funzione per eseguire una ricerca
	const fetchData = async (term) => {
		if (!term) return;

		// Verifica se i risultati sono già in cache
		if (searchCache[term]) {
			setSearchData(searchCache[term]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const baseUrlTest = "https://hannusato-backendv2.ddns.net:5000";
			const response = await fetch(`${baseUrlTest}/crawl?term=${term}`);

			if (!response.ok) {
				throw new Error(`Errore nella richiesta: ${response.status}`);
			}

			const result = await response.json();

			// Funzione per pulire il prezzo
			const cleanPrice = (price) => {
				if (price === undefined || price === null) return 0;
				if (typeof price === "number") return price;

				if (typeof price === "string") {
					const numbers = price.match(/\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:\.\d+)?/g);
					if (!numbers) return 0;
					let firstPrice = numbers[0];

					return parseFloat(firstPrice.replace(/\.(?=\d{3}(,|$))/g, "").replace(",", ".")) || 0;
				}

				return 0;
			};

			// Converte e sovrascrive price
			const updatedData = result.map((item) => ({
				...item,
				price: cleanPrice(item.price),
			}));

			// Ordina i dati in base al prezzo
			const sortedData = updatedData.sort((a, b) => a.price - b.price);

			// Aggiorna lo stato e la cache
			setSearchData(sortedData);
			setSearchCache((prev) => ({ ...prev, [term]: sortedData }));

			// Aggiorna la cronologia delle ricerche
			// Rimuove il termine se già esiste e lo aggiunge all'inizio
			setSearchHistory((prev) => {
				const filteredHistory = prev.filter(item => item !== term);
				return [term, ...filteredHistory].slice(0, 5); // Mantiene solo le ultime 5 ricerche
			});
		} catch (error) {
			console.error("Errore nella chiamata API:", error);
			setError(error.message);
			setSearchData([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Filtra i dati in base ai filtri attivi (memoizzato per evitare ricalcoli non necessari)
	const filteredData = useMemo(() => {
		return searchData.filter((item) => {
			const matchesTitle = isTitleFilterActive
				? searchQuery
					? item.title.toLowerCase().includes(searchQuery.toLowerCase())
					: true
				: true;
			const matchesSource = selectedSources.length > 0 ? selectedSources.includes(item.source.toLowerCase()) : true;
			return matchesTitle && matchesSource;
		});
	}, [searchData, isTitleFilterActive, searchQuery, selectedSources]);

	// Valori esposti dal context
	const value = {
		searchData,
		filteredData,
		isLoading,
		error,
		searchHistory,
		selectedSources,
		setSelectedSources,
		isTitleFilterActive,
		setIsTitleFilterActive,
		searchQuery,
		setSearchQuery,
		fetchData,
		clearError: () => setError(null),
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
