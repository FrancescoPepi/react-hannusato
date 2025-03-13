import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import FlashListCustom2 from '@/components/FlashListCustom2';
import Animated, {} from 'react-native-reanimated';
import {CustomFadeInUp, CustomFadeOutUp } from '@/animations/customAnimations';

export default function Search() {
  const { initialQuery } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      fetchData(initialQuery);
    }
  }, [initialQuery]);

  const fetchData = async (term) => {
    if (!term) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://hannusato-backendv2.ddns.net:5000/crawl?term=${term}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View entering={CustomFadeInUp} exiting={CustomFadeOutUp}>
      <FlashListCustom2
        data={data}
        const logoMap = {{
          subito: require('@/assets/images/logo/subito.png'),
          vinted: require('@/assets/images/logo/vinted.png'),
          ebay: require('@/assets/images/logo/ebay.png'),
          wallapop: require('@/assets/images/logo/wallapop.png'),
          // vestiaire: require('@/assets/images/logo/vestiaire.png'),
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(query) => {
          setSearchQuery(query);
          fetchData(query);
        }}
        isLoading={isLoading}
      />
    </Animated.View>
  );
}
