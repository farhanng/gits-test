'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
  // Make new one!
  // TODO: implement the auth!
  done(null, false);
}));
