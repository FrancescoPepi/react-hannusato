import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

const phrases = [
    'Stai cercando qualcosa? Vuoi Risparmiare? Qui puoi trovare i prodotti offerti dai più grandi siti dell\'usato in ordine di prezzo.',
    'Cerca il prodotto che ti interessa e confronta i prezzi tra i più grandi siti dell\'usato.',
    'Risparmia sui tuoi acquisti confrontando i prezzi tra i più grandi siti dell\'usato.',
    "Approfitta delle migliori offerte dell'usato, risparmia e trova l'affare giusto per te!",
    "Naviga tra migliaia di prodotti usati e scegli quello più conveniente.",
    "Hannusato ti aiuta a trovare il miglior prezzo in pochi secondi!"
  ];

const AnimatedPhrase = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // 🔥 Anima la frase in uscita (fade out + traslazione verso il basso)
      opacity.value = withTiming(0, { duration: 500 });
      translateY.value = withTiming(10, { duration: 500 });

      setTimeout(() => {
        // Cambia la frase
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        
        // 🔥 Anima la frase in entrata (fade in + traslazione verso l'alto)
        opacity.value = withTiming(1, { duration: 500 });
        translateY.value = withTiming(0, { duration: 500 });
      }, 500);
    }, 5000); // Cambia frase ogni 30 secondi

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}>
      <Animated.Text style={[animatedStyle, { fontSize: 16, textAlign: 'center', color: "#ffffff" }]}>
        {phrases[currentPhraseIndex]}
      </Animated.Text>
    </View>
  );
};

export default AnimatedPhrase;
