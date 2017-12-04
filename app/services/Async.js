'use strict';

const Promise = require('bluebird');

exports.make = Promise.coroutine;

exports.route = function route(genFn) {
  const cr = Promise.coroutine(genFn);
  return function routed(req, res, next) {
    cr(req, res, next).catch(next);
  };
};
