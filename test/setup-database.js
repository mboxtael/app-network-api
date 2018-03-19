const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://mongo/networking_test';
const config = { connection: null };
mongoose.Promise = Promise;

async function connect() {
  if (config.connection) {
    return;
  }

  const mongooseOpts = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  await mongoose.connect(MONGO_URI, mongooseOpts);
  config.connection = mongoose.connection;

  mongoose.connection.on('error', async e => {
    if (e.message.code === 'ETIMEDOUT') {
      await mongoose.connect(MONGO_URI, mongooseOpts);
    }

    throw e;
  });
}

async function clear() {
  await mongoose.connection.dropDatabase();
}

module.exports = async function setupDatabase() {
  await connect();
  await clear();
};
