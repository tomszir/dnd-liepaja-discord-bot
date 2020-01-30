const fs = require('fs');
const path = require('path');

const DEV_PATH = path.join(__dirname, './config.dev.js');
const PROD_PATH = path.join(__dirname, './config.prod.js');

const env = process.env.NODE_ENV;
const defaults = {
  env,
  ...require('./config.common')
};

let config = defaults;

if (env === 'production') {
  if (fs.existsSync(PROD_PATH)) config = Object.assign({}, defaults, require(PROD_PATH));
} else {
  if (fs.existsSync(DEV_PATH)) config = Object.assign({}, defaults, require(DEV_PATH));
}

module.exports = config;
