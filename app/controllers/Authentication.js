'use strict';

const config = require('../../config/');
const Async = require('../services/Async');
const Utils = require('../services/Utils');
const OAuth = require('../helpers/oauth');
const Mailer = require('../services/Mailer');
const IsEmail = require('isemail');
const pack = require('../helpers/pack');
const randtoken = require('rand-token');
const mongoose = require('mongoose');

const _ = require('lodash');

const User = require('../models/oauth/User');
const UserData = require('../models/UserData');
const conUser = new User();
const conUserData = new UserData();

const OAuthAccessToken = require('../models/oauth/OAuthAccessToken');
const OAuthRefreshToken = require('../models/oauth/OAuthRefreshToken');


module.exports = {
    signin: Async.route(function* signin(req, res) {
        var missing = Utils.missingProperty(req.body, ['grant_type']);
        if (missing) 
            return res.sendError('Missing body parameter : ' + missing, 'Missing', 400);

        
        if (req.body.grant_type == 'password') {
            missing = Utils.missingProperty(req.body, ['username', 'password']);
            
            if (missing) 
                return res.sendError('Missing body parameter : ' + missing, 'Missing', 400);
            
            if(!req.body.username.length || !req.body.password.length)
            return res.sendError('All field must not empty!','Invalid',400);

            User.findOne({
                $or: [{username: req.body.username},{email: req.body.username}]
            }, function (err, user) {
                
                if (err) 
                    return res.sendError(err, "Server Error", 500);

                if (!user) 
                    return res.sendError('Username or Email Not Found or Invalid', 'Username or Email Invalid', 400);

                if (user.verifyCode != null) 
                    return res.sendError('Email not been Verfied, please check your Email', 'Email Invalid', 400);

                var UserMethod = new User();
                
                if (!UserMethod.validPassword(req.body.password, user.password)) 
                    return res.sendError('Password Incorrect or Invalid', 'Password Invalid', 400);
                
                OAuth.token(req,res, function(err,token){
                    if (err) 
                        return res.sendError(err,'Server Error',500);
                    
                    return res.ok(token,'Token Generated',200);
                });
            });

        } else if (req.body.grant_type == 'refresh_token') {

            missing = Utils.missingProperty(req.body, ['grant_type']);
            if (missing) 
                return res.sendError('Missing body parameter : ' + missing, 'Missing', 400);
            
            OAuthRefreshToken.findOne({
                refresh_token: req.body.refresh_token
            }).exec(function (err, rt) {
                if (!rt) {
                    console.log(err);
                    return res.sendError('Refresh Token not Valid', 'Invalid Refresh Token', 400);
                }
                
                OAuth.token(req,res, function(err,token){
                    if (err) 
                        return res.sendError(err,'Server Error',500);
                    
                    return res.ok(token,'Token Generated',200);
                });
            });
        } else {
            return res.sendError('grant_type not Valid', 'Invalid grant_type', 400);
        }
    }),

    register: Async.route(function* register(req, res) {
        const missing = Utils.missingProperty(req.body, ['username', 'email', 'password', 'repassword']);
        if (missing) 
            return res.sendError('Missing body parameter : ' + missing, 'Missing', 400);

        const emailValidation = IsEmail.validate(req.body.email);
        
        if(!req.body.username.length || !req.body.password.length || !req.body.email.length || !req.body.repassword.length)
            return res.sendError('All field must not empty!','Invalid',400);
        
        if (emailValidation == false) 
            return res.sendError('Email Must be Valid', 'Email Invalid', 400);

        if (req.body.password.length > 100) 
            return res.sendError('Username maximum length is 100 character', 'Username Incorrect', 400);
        
        if (req.body.password.length < 6) 
            return res.sendError('Password minimum length is 6 character', 'Password Incorrect', 400);
        
         if (req.body.password.length > 20) 
            return res.sendError('Password maximum length is 20 character', 'Password Incorrect', 400);

        if (req.body.password !== req.body.repassword) 
            return res.sendError('Password confirmation must match', 'Password not Match', 400);
        
        try {
            var user = yield User.findOne({ username: req.body.username }).exec();
            if (user) {
                return res.sendError('Username is already exist', 'Username Already', 400);
            }
            var email = yield User.findOne({ email: req.body.email }).exec();
            if (email) {
                return res.sendError('Email is already exist', 'Email Already', 400);
            }
            const newUser = new User(req.body);
            const newUserData = new UserData();

            var token = randtoken.generate(32);
            
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.verifyCode = token;
            newUser.email = req.body.email;
            
            var subject = "Email Verification";
            var text = "Here is your Link your Email Verification";
            var html = 'This is your Link Email Verification Code' +
                '<br>' +
                '<a href="' + config.getLinkVerifyEmail(newUser) + '">Email Verification Link</a>';
            var stat = yield Mailer.sendMail(newUser.email, subject, text, html);
            
            
            yield newUser.save();
            
            newUserData.user = newUser._id;
            newUserData.fullname = null;
            newUserData.status = null;
            newUserData.photo = null;
            yield newUserData.save();
            
            newUser.data = newUserData._id;
            yield newUser.save();
            
            return res.ok(stat.message,stat.status,200);
        }
        catch (err) {
            return res.sendError(err,'Server Error',500);
        }
    }),

    verifyEmail: Async.route(function* verifyEmail(req, res) {
        var id_user = req.params._id;
        var emailCode = req.params.emailCode;

        User.findOne({
            _id: id_user
        }, function (err, user) {
            if (err) {
                return res.sendError(err, "Server Error", 500);
            }
            if (!user) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            }
            if (emailCode !== user.verifyCode) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });

            }

            user.verifyCode = null;
            user.save(function (err) {
                if (err) {
                    res.sendError(err, "Server Error", 500);
                }
                return res.render('alert', {
                    alert: "Verify Successful",
                    message: "Now you can login In App",
                });
            });
        });
    }),

    requestForgotPassword: Async.route(function* requestForgotPassword(req, res, next) {
        const email = req.body.email;
        if (!email) return res.sendError("Missing Body Parameter : email", "Missing", 400);
        
        const emailValidation = IsEmail.validate(req.body.email);
        
        if (emailValidation == false) return res.sendError('Email Must be Valid', 'Email Invalid', 400);
        
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return res.sendError(err, "Server Error", 500);
            }
            if (!user) {
                return res.sendError("Email not Found", "Invalid", 400);
            }
            var token = randtoken.generate(32);
            user.forgotCode = token;
            user.save(function (err) {
                if (err) {
                    res.sendError(err, "Server Error", 500);
                }

                var linkForgot = config.getLinkForgot(user);

                var subject = "Forgot Password Code";
                var text = "Here is your Link forgot password Code";
                var html = '<a href="' + linkForgot + '">Link New Password</a>'

                var sendForgot = Mailer.sendMail(email, subject, text, html);
                return res.ok("Link forgot Password has been sent to Your Email", "Success", 200);
            });
        });
    }),

    view_verifyForgotPassword: Async.route(function* view_verifyForgotPassword(req, res) {
        var id_user = req.params._id;
        var forgotCode = req.params.forgotCode;
        
        if(!mongoose.Types.ObjectId.isValid(id_user)) 
            return res.render('alert', { alert: "Failed", message: "User not Authorized" });

        User.findOne({
            _id: id_user
        }, function (err, user) {
            if (err) {
                return res.sendError(err, "Server Error", 500);
            }
            if (!user) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            }
            if (forgotCode !== user.forgotCode) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            }
            return res.render('email', {
                href: '/api/v1/verifyForgotPassword/' + id_user + '/' + forgotCode
            });
        });
    }),

    verifyForgotPassword: Async.route(function* verifyForgotPassword(req, res) {
        var id_user = req.params._id;
        var forgotCode = req.params.forgotCode;

        User.findOne({
            _id: id_user
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            }
            
            if (!user) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            }
            
            if (forgotCode !== user.forgotCode) {
                return res.render('alert', {
                    alert: "Failed",
                    message: "User not Authorized"
                });
            } 
            
            if (req.body.newPassword !== req.body.reNewPassword) {
                return res.render('email', {
                    message: "Password not match",
                    href: '/api/v1/verifyForgotPassword/' + id_user + '/' + forgotCode
                });
            }
            
            if (req.body.newPassword.length < 6) {
                return res.render('email', {
                    message: "Password length minimum 6 Character",
                    href: '/api/v1/verifyForgotPassword/' + id_user + '/' + forgotCode
                });
            }
            
            user.password = conUser.generateHash(req.body.newPassword);
            user.forgotCode = null;
            user.save(function (err) {
                if (err) {
                    res.sendError(err, 'Server Error', 500);
                }
                return res.render('alert', {
                    alert: "Success",
                    message: "You have been change your Password"
                });
            });
        });
    }),

    changePassword: Async.route(function* changePassword(req, res, next) {
        User.findOne({
            '_id': req.user._id
        }, (err, user) => {
            if (err) throw err;

            const missing = Utils.missingProperty(req.body, ['oldPassword', 'newPassword', 'reNewPassword']);
            if (missing) 
                return res.sendError('Missing body parameter : ' + missing, 'Missing', 400);

            if (req.body.oldPassword.length < 6 || req.body.newPassword.length < 6 || req.body.reNewPassword.length < 6) 
                return res.sendError('Password minimum length is 6 character', 'Password Incorrect', 400);

            if (req.body.newPassword != req.body.reNewPassword) 
                return res.sendError("New Password and Retype New Password not Match", "Password not Match", 400);
            
            if (req.body.oldPassword == req.body.newPassword) 
                return res.sendError("New Password and Old Password is Same", "Password Not Changed", 400);
            
            var upUser = new User(req.body);

            if (!upUser.validPassword(req.body.oldPassword, user.password)) 
                return res.sendError("Old Password not Match", "Old Password not Match", 400);
            
            user.password = upUser.generateHash(req.body.newPassword);
            user.save(function (err) {
                if (err) throw err;
            });

            var response = {
                user: conUser.takeData(req.user),
            };

            return res.ok(response, 'Password has Changed', 201);
        });
    }),

    logout: Async.route(function* logout(req, res) {
        try {
            var user = yield  User.findOne({_id: req.user._id}).exec();
            
            if (!user) 
                return res.sendError('User Not Found', 'Server Error', 500);
            
            var token = yield OAuthAccessToken.findOne({ access_token: req.token.access_token }).exec();
            
            if (!token) 
                return res.sendError('Token Not Found', 'Invalid', 400);
            
            yield token.remove();
            
            req.logout();
            return res.ok('Success Logout', 'Success', 200);
        }
        catch (err) {
            return res.sendError(err,'Server Error',500);
        }
    }),

};
