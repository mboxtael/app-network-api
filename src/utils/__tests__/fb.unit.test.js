const { Facebook, mockSetAccessToken } = require('fb');
const FB = require('../fb');

jest.mock('fb');
describe('utils: fb', () => {
  it('should call facebook sdk constructor', () => {
    const fb = new FB('fb_access_token');

    expect(Facebook).toHaveBeenCalledTimes(1);
    expect(mockSetAccessToken).toBeCalledWith(expect.any(String));
  });
});
describe('utils: fb#me', () => {
  it('should return user data', () => {
    const fb = new FB('fb_access_token');

    expect(fb.me()).toBeTruthy();
  });
});
