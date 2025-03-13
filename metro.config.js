const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
// defaultConfig.transformer.assetPlugins = defaultConfig.transformer.assetPlugins || [];
// defaultConfig.transformer.assetPlugins.push("react-native-svg-transformer");
// defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== "svg");
// defaultConfig.resolver.sourceExts.push("svg");


module.exports = withNativeWind(defaultConfig, { input: './global.css' })