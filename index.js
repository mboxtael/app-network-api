const koaBunyanLogger = require('koa-bunyan-logger');
const helmet = require('koa-helmet');
const { app } = require('./server');
require('./database/mongoose');

app.use(helmet());
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestLogger());
