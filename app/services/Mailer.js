'use strict';
const nodemailer = require('nodemailer');
const config = require('../../config');
const User = require('../models/oauth/User');
const smtpTransport = require('nodemailer-smtp-transport');


function sendMail(email, subject, text, html) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: config.mailer.user,
            pass: config.mailer.pass
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Lead E-Commerce" <'+config.mailer.host+'>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };
    
    return new Promise((resolve,reject)=> {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                var ret = {
                    status : "Email failure to Sent",
                    message : error,
                }
                return reject(ret);
                console.log('Mailer Error : '+error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            var ret = {
                status : "Email has been Sent",
                message : "Email has Been Sent to : "+email+" ref : "+info.response,
            }
            return resolve(ret);
        });
    });
    // send mail with defined transport object
    
}


module.exports = {
    sendMail: sendMail
}
