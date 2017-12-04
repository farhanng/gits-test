'use strict';

const express = require('express');
const path = require('path');

/* eslint no-param-reassign: 0 */

const router = express.Router();

router.get('/', (req, res) => {
  res.ok('This is just a test');
});

router.get('/ok', (req, res) => {
  res.ok(0, 'Somebody', 203);
});

router.get('/error', (req, res, next) => {
  const err = new Error('Hey, you requested it');
  err.status = 400;
  next(err);
});

router.get('/headers', (req, res) => {
  res.ok(req.headers);
});

module.exports = router;
