const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Never watch/resolve gradle + native build artifacts — they exploded the
    // inotify watcher limit (ENOSPC) during assembleRelease. Build outputs are
    // not JS modules and are regenerated constantly by gradle.
    blockList: [
      /.*\/android\/build\/.*/,
      /.*\/\.gradle\/.*/,
      /.*\/node_modules\/.*\/android\/build\/.*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
