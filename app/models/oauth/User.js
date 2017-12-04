/**
 * Created by Manjesh on 14-05-2016.
 */
'use strict';

const bcrypt = require('bcrypt');
const typeData = require('../typedata/TypeData');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const pack = require('../../helpers/pack');

var UserSchema = new Schema({
    username: typeData.stringUniqLength(100),
    password: typeData.string,
    email: typeData.string,
    verifyCode: typeData.string,
    forgotCode: typeData.string,
    scope: typeData.string,
    data: typeData.ref('UserData'),
}, {
    collection: 'User'
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
UserSchema.methods.validPassword = function validPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

UserSchema.methods.takeData = function (object) {
    let thisObject = object.toJSON();

    delete thisObject.password;
    delete thisObject._id;
    delete thisObject.forgotCode;
    delete thisObject.verifyCode;

    return thisObject;
}

UserSchema.methods.takeSearch = function (object) {
    let thisObject = object.toJSON();

    delete thisObject.password;
    delete thisObject._id;
    delete thisObject.forgotCode;
    delete thisObject.verifyCode;
    
    var photo = null;
    var status = thisObject.data.status;
    var fullname = thisObject.data.fullname;
    if(thisObject.data.photo) {
       photo = pack.getImgDataPath()+thisObject.data.photo;
    }
    
    thisObject.data = {
        photo: photo,
        status: status,
        fullname: fullname,
    };

    return thisObject;
}


module.exports = mongoose.model('User', UserSchema);
