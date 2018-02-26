const Koa = require('koa');
const koaBunyanLogger = require('koa-bunyan-logger');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
require('./database/mongoose');

const app = new Koa();
app.use(koaBunyanLogger());
app.use(koaBunyanLogger.requestLogger());
app.use(bodyParser());
app.use(helmet());

fs.readdirSync(path.join('./app', 'components')).forEach(component => {
  if (fs.existsSync(path.join('./app', 'components', component, 'controller.js'))) {
    const controller = require(`./app/components/${component}/controller.js`);
    app.use(controller.routes());
  }
});

app.listen(process.env.PORT || 3000);