module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-numeric-separator",
      [
        "inline-dotenv",
        {
          path: process.env.APP_ENV === "production" ? ".env.production" : ".env.development",
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
