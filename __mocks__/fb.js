const mockSetAccessToken = jest.fn();
const mockApi = jest.fn().mockImplementation(() => true);
const mockFacebook = jest
  .fn()
  .mockImplementation(() => ({
    setAccessToken: mockSetAccessToken,
    api: mockApi
  }));

module.exports = {
  Facebook: mockFacebook,
  mockSetAccessToken
};
