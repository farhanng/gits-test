'use strict';

const config = require('./config');
const { name } = require('./package.json');

const express = require('express');
const app = express();
const helmet = require('helmet');
const swig = require('swig');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const i18n = require('i18n');
const DataStoreAdapter = require('./app/helpers/database').getInstance();
const routes = require('./app/routes');
const logger = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');

// global
global._ = require('lodash');

i18n.configure({
  locales: ['en_US', 'id'],
  directory: '${__dirname}/app/locales',
  updateFiles: false,
});

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', __dirname+'/app/views');
app.set('view engine', 'html');
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// initialize
app.use(session({
  name,
  resave: false,
  saveUninitialized: false,
  secret: config.cookie.secret,
  autoReconnect: true,
  maxAge: new Date(Date.now() + 3600000),
}));


app.use(express.static(__dirname+'/assets'));
app.use(express.static(__dirname+'/bower_components'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(i18n.init);
app.use(routes);

module.exports = app;
