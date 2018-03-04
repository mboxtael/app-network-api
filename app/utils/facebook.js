const { FB } = require('fb');

class Facebook {
  constructor(accessToken) {
    FB.setAccessToken(accessToken);
  }

  async me() {
    return await FB.api('/me', { fields: 'email,gender' });
  }
}

exports.Facebook = Facebook;