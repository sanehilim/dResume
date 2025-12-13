// Minimal shim for @react-native-async-storage/async-storage when bundling for web/server
// Provides the basic async methods used by libraries that import this module.

module.exports = {
  getItem: async (key) => null,
  setItem: async (key, value) => {},
  removeItem: async (key) => {},
  clear: async () => {},
};
