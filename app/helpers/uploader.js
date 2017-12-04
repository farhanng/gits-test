'use strict';

const pack = require('./pack');
const Photo = require('../models/Photo');
const fs = require('fs');

module.exports = {

    ImageUpload(file, callback) {
        var photo = file;
        var typeData = pack.getTypeData(photo).toString();
        switch (typeData) {
            case 'jpg':
                break;
            case 'png':
                break;
            case 'jpeg':
                break;
            default:
                return callback('Type Data ' + typeData + ' not Suported', null);
        }
        var newPhoto = new Photo();
        newPhoto.date = Date.now();
        newPhoto.save(function (err) {
            if (err) {
                return callback(err, null);
            }
        
            var photo_name = newPhoto._id + '.' + typeData;
            photo.mv('./assets/img/' + photo_name, function (err) {
                if (err) {
                    return callback(err, null);
                }
                newPhoto.photo = photo_name;
                newPhoto.save(function (err) {
                    if (err) {
                        return callback(err, null);
                    }
                    return callback(null, newPhoto);
                });
            });
        });
    },

    ImageUpdate(id, file, callback) {
        var photo = file;
        var typeData = pack.getTypeData(photo).toString();
        switch (typeData) {
            case 'jpg':
                break;
            case 'png':
                break;
            case 'jpeg':
                break;
            default:
                return callback('Type Data ' + typeData + ' not Suported', null);
        }
        Photo.findOne({
            _id: id
        }, function (err, pho) {
            if (!pho) {
                return callback('Image Not Found', null);
            }
            if (err) {
                return callback(err, null);
            }
            fs.unlink('./assets/img/' + pho.photo, function (err) {
                if (err) {
                    return callback(err, null);
                }
                var photo_name = pho._id + '.' + typeData;
                photo.mv('./assets/img/' + photo_name, function (err) {
                    if (err) {
                        return res.sendError(err, 'Server Error', 500);
                    }
                    pho.photo = photo_name;
                    pho.save(function (err) {
                        if (err) {
                            return callback(err,null);
                        }
                        return callback(null, pho);
                    });
                });
            });
        });
    },

    ImageDelete(id, callback) {
        Photo.findOne({
            _id: id
        }, function (err, photo) {
            if (!photo) {
                return callback('Image Not Found', null);
            }
            if (err) {
                return callback(err, null);
            }
            fs.unlink('./assets/img/' + photo.photo, function (err) {
                if (err) {
                    return callback(err, null);
                }
                photo.remove();
                return callback(null, 'Success Deleted File !');
            });
        });
    },
}
