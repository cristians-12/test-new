jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Image = {
    ...RN.Image,
    getSize: jest.fn((_uri, success) => success(100, 100)),
    prefetch: jest.fn(() => Promise.resolve()),
    resolveAssetSource: jest.fn((source) => ({ uri: (source && source.uri) || '' })),
  };
  return RN;
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

const mockStorage = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key) => Promise.resolve(mockStorage[key] || null)),
    setItem: jest.fn((key, value) => { mockStorage[key] = value; return Promise.resolve(); }),
    removeItem: jest.fn((key) => { delete mockStorage[key]; return Promise.resolve(); }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); return Promise.resolve(); }),
  },
}));
