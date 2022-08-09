module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "module:react-native-dotenv",
      "@babel/plugin-proposal-numeric-separator",
      "react-native-reanimated/plugin",
    ],
  };
};
