const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const fs = require('fs');

const app = new Koa();
app.use(bodyParser());

fs.readdirSync('./app/components').forEach(component => {
  if (
    fs.existsSync(path.join('./app/components', component, 'controller.js'))
  ) {
    const controller = require(`../app/components/${component}/controller.js`);
    app.use(controller.routes());
  }
});

const server = app.listen(process.env.PORT || 3000);

module.exports = { app, server };
