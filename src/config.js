const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;
const defaults = {
  env,
  discord: {
    token: '',
    prefix: ''
  },
  sequelize: {
    database: '',
    user: '',
    password: ''
  },
  developers: []
};

const devPath = path.join(__dirname, './config.dev.js');
const prodPath = path.join(__dirname, './config.prod.js');

let config = defaults;

if (env === 'production') {
  if (fs.existsSync(prodPath)) config = Object.assign({}, defaults, require(prodPath));
} else {
  if (fs.existsSync(devPath)) config = Object.assign({}, defaults, require(devPath));
}

module.exports = config;
