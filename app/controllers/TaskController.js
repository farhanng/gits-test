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

const Task = require('../models/Task');
const moment = require('moment');


module.exports = {
    
    get: Async.route(function* get(req, res) {
        var sort = [];
        if (req.query.priority) {
            if(req.query.priority == 'descending') {
                sort = [['priority' , 'desc']]
            } else if(req.query.priority == 'ascending') {
                sort = [['priority' , 'asc']]
            } else {
                return res.sendError(null,'Invalid Sort',400);
            }
        }
        
        try {
            var task = yield Task.find({ user: req.user._id }).sort(sort).exec();
            return res.ok(task,'Success',200);
        } catch (err) {
            return res.sendError(err,'Server Error',500);
        }
    }),
                     
    create: Async.route(function* create(req,res) {
        var missing = Utils.missingProperty(req.body,['name','priority','location','timeStart']);
        
        if (missing) return res.sendError('Missing body parameter : '+missing,'Missing',400);
        
        var newTask = new Task(req.body);
        newTask.name = req.body.name;
        newTask.priority = Number(req.body.priority);
        newTask.location = req.body.location;
        newTask.user = req.user._id;
        console.log(req.body.timeStart);
        var date =  moment(req.body.timeStart);
        if(!date.isValid()) {
            return res.sendError(null,'Invalid Date',400);
        }
        newTask.timeStart = date;
        try {
            yield newTask.save();
            return res.ok(null,'Task Created',201);
        } catch (err) {
            return res.sendError(err,'Server Error',500);
        }
    }),
    
    update: Async.route(function* update(req,res) {
        if(!req.query.task_id) {
            return res.sendError(null,'Missing URL Parameter : task_id',400);
        }
        const id = req.query.task_id;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendError(null,'Invalid Task ID',400);
        }
        
        try {
            
            var task = yield Task.findOne({ _id : id }).exec();
            
            if (!task) {
                return res.sendError(null,'Invalid Task ID',400); 
            }
            
            if(req.body.name) {
                task.name = req.body.name;
            }
            
            if(req.body.priority) {
                task.priority = req.body.priority;   
            }
            
            if(req.body.location) {
                task.location = req.body.location;
            }
            
             if(req.body.timeStart) {
                var date =  moment(req.body.timeStart);
                if(!date.isValid()) {
                    return res.sendError(null,'Invalid Date',400);
                }
                newTask.timeStart = date;
            }
        
            yield task.save();
            return res.ok(null,'Task Updated',201);
            
        } catch (err) {
            return res.sendError(err,'Server Error',500);
        }
    }),
        
    delete: Async.route(function* deleteTask(req, res) {
        const id = req.query.task_id;
        
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.sendError(null,'Invalid Task ID',400);
        }
        
        try {
            var task = yield Task.findOne({ _id : id}).exec();
            
            if (!task) {
                return res.sendError(null,'Invalid Task ID',400); 
            }
            
            yield task.remove();
            return res.ok(null,'Task Deleted',200);
        } catch (err) {
            return res.sendError(err,'Server Error',500);
        }
        
    }),

};
