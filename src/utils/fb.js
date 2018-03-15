const { Facebook } = require('fb');

class FB {
  constructor(accessToken) {
    this._fb = new Facebook();
    this._fb.setAccessToken(accessToken);
  }

  async me() {
    return this._fb.api('/me', { fields: 'email,gender' });
  }
}

module.exports = FB;
