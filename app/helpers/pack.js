const config = require('../../config');
const User = require('../models/oauth/User');
const Mailer = require('../services/Mailer');
const ConBase = require('../models//Config');

function getTypeData(file) {
    var nameData = file.name;
    var start = nameData.length;
    var end = start + 1;
    var typeData = '';


    for (var i = start; i > 0; i--) {
        if (nameData[i] == '.') {
            break;
        }
        end--;
    }

    typeData = nameData.substring(start, end);

    return typeData;
}

function getConfig() {
    return new Promise((resolve,reject)=>{
        ConBase.findOne({ id_config:'lead' }).exec(function(err,con){
            if(!con) {
                var newConfig = new ConBase();
                newConfig.id_config = 'lead';
                newConfig.taxes = 10;
                newConfig.newProductInDay = 10;
                newConfig.save(function(err){
                    if(err){
                        return reject(err);
                    }
                    var ret = {
                        id_config : 'lead',
                        taxes: 10,
                        newProductInDay: 10,
                    }
                    return resolve(ret); 
                });
            } else {        
                return resolve(con);
            }
        });
    });
}

function getOffsetLimit(offset, limit) {
    var lim = 10;
    var off = 0;
    
    if (offset) {
        off = Number(offset);
    }
    if (limit) {
        lim = Number(limit);
    }
    if (off < 0) {
        return {
            err: 'Offset Incorrect',
            limit: null,
            off: null,
        };
    }
    if (lim < 1) {
        return {
            err: 'Limit Incorrect',
            limit: null,
            off: null,
        };
    }
    return {
        err: null,
        limit: lim,
        offset: off,
    };
}


module.exports = {
    getTypeData: getTypeData,
    getOffsetLimit: getOffsetLimit,
    getConfig: getConfig,
}
