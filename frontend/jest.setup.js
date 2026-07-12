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
