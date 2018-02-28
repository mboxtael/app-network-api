const koaBunyanLogger = require('koa-bunyan-logger');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const { app, server } = require('./server');
require('./database/mongoose');

app.use(helmet());
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestLogger());