"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');

//INDEX ROUTES /

/**
 * @api {get} / Home page of API
 * @apiName GetTitle
 * @apiGroup Index
 *
 * @apiSuccess {Object} contain title of API.
 */
router.get('/', function (req, res, next) {
  res.send({title: config.title});
});

module.exports = router;