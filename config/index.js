"use strict";
const dotenv = require('dotenv').load({silent: true});
const config = require('./config.'+ process.env.NODE_ENV +'.json');

module.exports = config;