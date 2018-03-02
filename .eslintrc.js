module.exports = {
  "extends": ["airbnb-base", "plugin:jest/recommended"],
  "plugins": ["jest"],
  "env": {
    "jest/globals": true,
    "node": true
  },
  "rules": {
    "comma-dangle": "off",
    "function-paren-newline": ["error", "consistent"],
    "arrow-parens": "off"
  }
};