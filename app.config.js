require('dotenv').config();

module.exports = {
  expo: {
    name: "fhpotion",
    slug: "fhpotion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.hportion.fhpotion",
      statusBar: {
        backgroundColor: "#FFFFFF",
        barStyle: "dark-content"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "8bbcfd95-fe45-43f8-8b4f-db04c6c6653a"
      },
      // previous local defaults:
      // apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080",
      // wsBaseUrl: process.env.EXPO_PUBLIC_WS_BASE_URL || "http://localhost:8080"
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://docterdevserver-1-0.onrender.com",
      wsBaseUrl: process.env.EXPO_PUBLIC_WS_BASE_URL || "https://docterdevserver-1-0.onrender.com"
    }
  }
};

