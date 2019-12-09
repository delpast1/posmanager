'use strict';
const User = require('../models/user'),
    validator = require('email-validator');

let noop = () => {};

var login = (request, callback) => {
    let cb = callback || noop,
        req = request || {},
        email = req.email || '';
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!email) {
            errors.push('Yêu cầu nhập email.');
            return cb(errors);
        } else {
            if (validator.validate(email)) {
                workflow.emit('checkUser', errors);
            } else {
                errors.push('Email sai.')
                return cb(errors);
            }
        }
    });
    
    workflow.on('checkUser', (errors) => {
        User.findOne({'info.email': email}, (err, user) => {
            if (err) {
                return cb('Connect failed')
            } else {
                if (!user) {
                    var newUser = new User({
                        info: {
                            email: email
                        },
                        status: 'ACTIVE'
                    });
                    newUser.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, newUser);
                    });
                } else {
                    return cb(null, user);
                }
            }
        });
    });
    workflow.emit('validateParams');
};

var updateUser= (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.firstname) {
            errors.push('Cần nhập họ.');
        }
        if (!req.lastname) {
            errors.push('Cần nhập tên.');
        }
        if (!req.phone) {
            errors.push('Cần nhập số điện thoại.');
        }
        if (!isVNPhoneMobile.test(req.phone)) {
            errors.push('Số điện thoại sai.')
        }
        if (!req.address) {
            errors.push('Cần nhập địa chỉ.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updateUser', errors)
        }
    });

    workflow.on('updateUser', (errors) => {
        User.findByIdAndUpdate(req.userID, {
            'info.firstname': req.firstname,
            'info.lastname': req.lastname,
            'info.phone': req.phone,
            'info.address': req.address,
        }, {new: true}, (err, updatedUser) => {
            if (err) return cb(err);
            return cb(null, updatedUser);
        });
    });
    workflow.emit('validateParams');
}

exports = module.exports = {
    login: login,
    updateUser: updateUser
}