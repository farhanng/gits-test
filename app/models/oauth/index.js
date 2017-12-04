/**
 * Created by Manjesh on 14-05-2016.
 */

/** https://github.com/dsquier/oauth2-server-php-mysql **/
var db ={};
db.OAuthAccessToken = require('./OAuthAccessToken')
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode')
db.OAuthClient = require('./OAuthClient')
db.OAuthRefreshToken = require('./OAuthRefreshToken')
db.OAuthScope = require('./OAuthScope')
db.User = require('./User')
db.Thing = require('./Thing')

module.exports = db;