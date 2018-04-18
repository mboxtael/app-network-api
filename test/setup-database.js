const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://mongo/networking_test';
const config = { connection: null };
mongoose.Promise = Promise;

function connect() {
  return new Promise((resolve, reject) => {
    if (config.connection) {
      resolve();
      return;
    }

    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    mongoose.connect(MONGO_URI, mongooseOpts);
    config.connection = mongoose.connection;

    mongoose.connection.on('error', e => {
      if (e.message.code === 'ETIMEDOUT') {
        mongoose.connect(MONGO_URI, mongooseOpts);
      } else {
        reject(e);
      }
    });

    mongoose.connection.once('open', resolve);
  });
}

async function clear() {
  await mongoose.connection.dropDatabase();
}

module.exports = {
  config,
  prepareDB: async () => {
    await connect();
    await clear();
  },
};
