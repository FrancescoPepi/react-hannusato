import Animated, { withTiming, Easing } from 'react-native-reanimated';

// Definiamo l'animazione personalizzata
export const CustomFadeInUp = (values) => {
    'worklet';
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: 200 }],
        },
        animations: {
            opacity: withTiming(1, { duration: 500 }),
            transform: [{ translateY: withTiming(0, { duration: 500 }) }],
        },
    };
};
export const CustomFadeOutUp = (values) => {
    'worklet';
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
        animations: {
            opacity: withTiming(0, { duration: 500 }),
            transform: [{ translateY: withTiming(200, { duration: 500 }) }],
        },
    };
};