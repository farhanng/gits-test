'use strict';

const Config = require('../../config/');
const bcrypt = require('bcrypt');
const packageJS = require('../helpers/pack');
const typeData = require('./typedata/TypeData');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserDataSchema = new Schema({
    user: typeData.refUniq('User'),
    fullname: typeData.string,
    status: typeData.string,
    photo: typeData.refPhoto,
}, {
    collection: 'UserData'
});

UserDataSchema.methods.takeData = function (object) {
    let thisObject = object.toJSON();

    delete thisObject._id;
    delete thisObject.user;

    if (thisObject.photo) {
        delete thisObject.photo._id;
        delete thisObject.photo.__v;
        thisObject.photo.photo = Config.getImgDataPath() + thisObject.photo.photo;
    }

    return thisObject;
}

module.exports = mongoose.model('UserData', UserDataSchema);
