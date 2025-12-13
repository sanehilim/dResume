// Local shim package for @react-native-async-storage/async-storage
module.exports = {
  getItem: async (key) => null,
  setItem: async (key, value) => {},
  removeItem: async (key) => {},
  clear: async () => {},
};
