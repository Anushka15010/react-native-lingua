const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Redirect problematic ox import.meta.url trusted-setups path resolution to local mock
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes("trusted-setups/internal/paths")) {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "./metro-mocks/paths-mock.js"),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });