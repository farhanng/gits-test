var _ = require('lodash');
var model = require('../models/oauth');
var User = model.User;
var OAuthClient = model.OAuthClient;
var OAuthAccessToken = model.OAuthAccessToken;
var OAuthAuthorizationCode = model.OAuthAuthorizationCode;
var OAuthRefreshToken = model.OAuthRefreshToken;

function getAccessToken(bearerToken) {
    return OAuthAccessToken
    //User,OAuthClient
        .findOne({access_token: bearerToken})
        .populate('User')
        .populate('OAuthClient')
        .then(function (accessToken) {
            if (!accessToken) return false;
            var token = accessToken;
            token.user = token.User;
            token.client = token.OAuthClient;
            token.scope = token.scope;
            token.accessTokenExpiresAt = token.expires;
            return token;
        })
        .catch(function (err) {
            console.log("getAccessToken - Err: ")
        });
}

function getClient(clientId, clientSecret) {
    const options = {client_id: clientId};
    if (clientSecret) options.client_secret = clientSecret;

    return OAuthClient
        .findOne(options)
        .then(function (client) {
            if (!client) return new Error("client not found");
            var clientWithGrants = client
            clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials']
            // Todo: need to create another table for redirect URIs
            clientWithGrants.redirectUris = [clientWithGrants.redirect_uri]
            delete clientWithGrants.redirect_uri
            //clientWithGrants.refreshTokenLifetime = integer optional
            //clientWithGrants.accessTokenLifetime  = integer optional
            return clientWithGrants
        }).catch(function (err) {
            console.log("getClient - Err: ", err)
        });
}


function getUser(id, pass) {
    return User
        .findOne({ $or:[{username: id},{email: id}] })
        .then(function (user) {
            UserData = new User();
            return UserData.validPassword(pass, user.password) ? user : false;
        })
        .catch(function (err) {
            console.log("getUser - Err: ", err)
        });
}

function revokeAuthorizationCode(code) {
    return OAuthAuthorizationCode.findOne({
        where: {
            authorization_code: code.code
        }
    }).then(function (rCode) {
        //if(rCode) rCode.destroy();
        /***
         * As per the discussion we need set older date
         * revokeToken will expected return a boolean in future version
         * https://github.com/oauthjs/node-oauth2-server/pull/274
         * https://github.com/oauthjs/node-oauth2-server/issues/290
         */
        var expiredCode = code
        expiredCode.expiresAt = new Date()
        return expiredCode
    }).catch(function (err) {
        console.log("getUser - Err: ", err)
    });
}

function revokeToken(token) {
    return OAuthRefreshToken.findOne({
        where: {
            refresh_token: token.refreshToken
        }
    }).then(function (rT) {
        if (rT) rT.destroy();
        /***
         * As per the discussion we need set older date
         * revokeToken will expected return a boolean in future version
         * https://github.com/oauthjs/node-oauth2-server/pull/274
         * https://github.com/oauthjs/node-oauth2-server/issues/290
         */
        var expiredToken = token
        expiredToken.refreshTokenExpiresAt = new Date()
        return expiredToken
    }).catch(function (err) {
        console.log("revokeToken - Err: ", err)
    });
}


function saveToken(token, client, user) {
    return Promise.all([
        OAuthAccessToken.create({
            access_token: token.accessToken,
            expires: token.accessTokenExpiresAt,
            OAuthClient: client._id,
            User: user._id,
            scope: token.scope
        }),
        token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
            refresh_token: token.refreshToken,
            expires: token.refreshTokenExpiresAt,
            OAuthClient: client._id,
            User: user._id,
            scope: token.scope
        }) : [],

    ])
        .then(function (resultsArray) {
            return _.assign(  // expected to return client and user, but not returning
                {
                    client: client,
                    user: user,
                    access_token: token.accessToken, // proxy
                    refresh_token: token.refreshToken, // proxy
                },
                token
            )
        })
        .catch(function (err) {
            console.log("revokeToken - Err: ", err)
        });
}

function getAuthorizationCode(code) {
    return OAuthAuthorizationCode
        .findOne({authorization_code: code})
        .populate('User')
        .populate('OAuthClient')
        .then(function (authCodeModel) {
            if (!authCodeModel) return false;
            var client = authCodeModel.OAuthClient
            var user = authCodeModel.User
            return reCode = {
                code: code,
                client: client,
                expiresAt: authCodeModel.expires,
                redirectUri: client.redirect_uri,
                user: user,
                scope: authCodeModel.scope,
            };
        }).catch(function (err) {
            console.log("getAuthorizationCode - Err: ", err)
        });
}

function saveAuthorizationCode(code, client, user) {
    return OAuthAuthorizationCode
        .create({
            expires: code.expiresAt,
            OAuthClient: client._id,
            authorization_code: code.authorizationCode,
            User: user._id,
            scope: code.scope
        })
        .then(function () {
            code.code = code.authorizationCode
            return code
        }).catch(function (err) {
            console.log("saveAuthorizationCode - Err: ", err)
        });
}

function getUserFromClient(client) {
    var options = {client_id: client.client_id};
    if (client.client_secret) options.client_secret = client.client_secret;

    return OAuthClient
        .findOne(options)
        .populate('User')
        .then(function (client) {
            if (!client) return false;
            if (!client.User) return false;
            return client.User;
        }).catch(function (err) {
            console.log("getUserFromClient - Err: ", err)
        });
}

function getRefreshToken(refreshToken) {
    if (!refreshToken || refreshToken === 'undefined') return false
//[OAuthClient, User]
    return OAuthRefreshToken
        .findOne({refresh_token: refreshToken})
        .populate('User')
        .populate('OAuthClient')
        .then(function (savedRT) {
            var tokenTemp = {
                user: savedRT ? savedRT.User : {},
                client: savedRT ? savedRT.OAuthClient : {},
                refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
                refreshToken: refreshToken,
                refresh_token: refreshToken,
                scope: savedRT.scope
            };
            return tokenTemp;

        }).catch(function (err) {
            console.log("getRefreshToken - Err: ", err)
        });
}

function validateScope(token, client, scope) {
    return (user.scope === client.scope) ? scope : false
}

function verifyScope(token, scope) {
    return token.scope === scope
}
module.exports = {
    //generateOAuthAccessToken, optional - used for jwt
    //generateAuthorizationCode, optional
    //generateOAuthRefreshToken, - optional
    getAccessToken: getAccessToken,
    getAuthorizationCode: getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
    getClient: getClient,
    getRefreshToken: getRefreshToken,
    getUser: getUser,
    getUserFromClient: getUserFromClient,
    //grantTypeAllowed, Removed in oauth2-server 3.0
    revokeAuthorizationCode: revokeAuthorizationCode,
    revokeToken: revokeToken,
    saveToken: saveToken,//saveOAuthAccessToken, renamed to
    saveAuthorizationCode: saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
    //validateScope: validateScope,
    verifyScope: verifyScope,
}
