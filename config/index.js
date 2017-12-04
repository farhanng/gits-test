'use strict';

const config = require(`./${process.env.NODE_ENV || ``}`);
const path = require(`path`);
const merge = require(`lodash/fp/merge`);



module.exports = merge({
    port: process.env.PORT || 3000,

    host: '127.0.0.1',

    hashPort: true,

    portCMS: 2705,

    hostCMS: '127.0.0.1',

    root: path.join(__dirname, `..`),

    dir: {
        upload: `/assets/upload`,
    },
    
    lead: {
        setNewProduct: 10,  
    },

    mongodb: {
        host: `localhost`,
        port: `27017`,
        dbname: `todolist`,
        username: ``,
        password: ``,
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1,
                },
            },
        },
        get connectionUri() {
            let uri = `mongodb://`;

            if (this.username && this.password) {
                uri = `${uri}${this.username}:${this.password}@`;
            }

            uri = `${uri}${this.host}`;

            if (this.port) {
                uri = `${uri}:${this.port}`;
            }

            if (this.dbname) {
                uri = `${uri}/${this.dbname}`;
            }

            return uri;
        },
    },

    mailer : {
        host : 'smtp.exmaple.com',
        services : 'gmail',
        user : '',
        pass : ''
    },

    i18n: {
        defaultLocale: `en_US`,
    },

    view: {
        cache: false,
    },

    cookie: {
        secret: `exposed`,
    },
    
        
    getLinkForgot(user) {
        var port = null;
        var portCMS = null;
        if (this.hasPort == true) {
            port = ':' + this.port;
            portCMS = ':' + this.portCMS;
        }
        return 'http://' + this.host + port + '/api/v1/verifyForgotPassword/' + user._id + '/' + user.forgotCode;
    },

    getImgCMSPath() {
        var port = null;
        var portCMS = null;
        if (this.hasPort == true) {
            port = ':' + config.port;
            portCMS = ':' + config.portCMS;
        }
        return 'http://' + this.hostCMS + portCMS + '/img/';
    },

    getImgDataPath() {
        var port = null;
        var portCMS = null;
        if (this.hasPort == true) {
            port = ':' + config.port;
            portCMS = ':' + config.portCMS;
        }
        return 'http://' + this.host + port + '/img/';
    },

    getLinkVerifyEmail(user) {
        var port = null;
        var portCMS = null;
        if (this.hasPort == true) {
            port = ':' + config.port;
            portCMS = ':' + config.portCMS;
        }
        return 'http://' + this.host + port + '/api/v1/verifyEmail/' + user._id + '/' + user.verifyCode;
    },
        
   
    
}, config);
