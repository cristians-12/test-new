const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    unstable_includePackageNames: ['react-native-toast-notifications'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
