'use strict';

const express = require('express');
const router = express.Router();

const OAuth = require('../helpers/oauth');
const Async = require('../services/Async');

const AuthController = require('../controllers/Authentication');
const TaskController = require('../controllers/TaskController');

router.get('/', (req, res) => {
  res.ok('Node API. Maybe');
});

//AUTHENTICATE
router.post('/register', OAuth.basic(), AuthController.register);
router.post('/signin', OAuth.basic(), AuthController.signin);
router.get('/logout',OAuth.authenticate(), AuthController.logout);

router.post('/forgot', OAuth.basic(), AuthController.requestForgotPassword);

router.get('/verifyForgotPassword/:_id/:forgotCode', AuthController.view_verifyForgotPassword);
router.post('/verifyForgotPassword/:_id/:forgotCode', AuthController.verifyForgotPassword);

router.post('/password', OAuth.authenticate(), AuthController.changePassword);

router.get('/verifyEmail/:_id/:emailCode', AuthController.verifyEmail);

router.get('/auth-test', OAuth.authenticate(), (req, res) => {
  res.ok('Auth Test. Completed');
});

//TASK CONTROLLER
router.get('/task', OAuth.authenticate(), TaskController.get);
router.post('/task', OAuth.authenticate(), TaskController.create);
router.put('/task', OAuth.authenticate(), TaskController.update);
router.delete('/task', OAuth.authenticate(), TaskController.delete)


module.exports = router;
