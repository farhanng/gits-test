'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
require('../models/user');

const User = mongoose.model('User');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  User.findOneById(id).exec((err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      const newUser = user.toObject();
      delete newUser.password;
      return done(null, newUser);
    }

    return done(new Error('Invalid login data'));
  }));
