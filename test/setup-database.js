const mongoose = require('mongoose');
// const MongodbMemoryServer = require('mongodb-memory-server').default;

const config = { connection: null };
mongoose.Promise = Promise;

function connect() {
  return new Promise((resolve, reject) => {
    if (config.connection) {
      return resolve();
    }

    //const mongoServer = new MongodbMemoryServer();

    //mongoServer.getConnectionString().then(mongoUri => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    mongoose.connect('mongodb://mongo/networking_test', mongooseOpts);
    config.connection = mongoose.connection;

    mongoose.connection.on('error', e => {
      if (e.message.code === 'ETIMEDOUT') {
        console.log(e);
        mongoose.connect(mongoUri, mongooseOpts);
      }
      console.log(e);
      reject(e);
    });

    mongoose.connection.once('open', resolve);
    //});
  });
}

async function clear() {
  await mongoose.connection.dropDatabase();
}

module.exports = async function setupDatabase() {
  await connect();
  await clear();
};
