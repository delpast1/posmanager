'use strict';
const Admin = require('../models/admin');

let noop = () => {};
var createAdmin = (request, callback) => {
    var newAdmin = new Admin();
    newAdmin.username = "admin18";
    newAdmin.password = newAdmin.encryptPassword("admin18");
    newAdmin.email = "13520674@gmail.com";
    newAdmin.save((err) => {
        if (err) {
            return callback(err);
        }
        return callback(null, newAdmin);
    });
}
var login = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.username) {
            errors.push('Yêu cầu nhập username.');
        }

        if (!req.password) {
            errors.push('Yêu cầu nhập mật khẩu.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('checkAdmin', errors);
        }
    });
    
    workflow.on('checkAdmin', (errors) => {
        Admin.findOne({'username': req.username}, (err, admin) => {
            if (err) {
                return cb('Connect failed')
            } else {
                if (!admin) {
                    errors.push('Username không tồn tại.');
                    return cb(errors);
                } else {
                    if (!admin.validPassword(req.password)) {
                        errors.push('Sai mật khẩu.');
                        return cb(errors);
                    } else {
                        return cb(null, admin);
                    }
                }
            }
        });
    });
    workflow.emit('validateParams');
};


exports = module.exports = {
    login: login,
    createAdmin: createAdmin
}