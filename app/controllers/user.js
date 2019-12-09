'use strict';
const mUser = require('../modules/index').user;
const jwt = require('jsonwebtoken');

const secretKey = require('../config/config').secret;


// controller đăng nhập
var login = (req,res) => {
    var request = {
        email: req.body.email
    };
    //response chính là user trong hàm callback return từ module
    mUser.login(request, (err, response) => {
        let token = '',
            status = {},
            data = {};
        if (!err && response) {
            if (response.status === "ACTIVE") {
                var signResponse = {
                    email: response.info.email,
                    userID:  response._id
                }
                token = jwt.sign(signResponse, secretKey, {
                    expiresIn: '7d'
                });
    
                status = {
                    'code': '1',
                    'err': ''
                }
                data = response;
                res.json({
                    body: data,
                    token: token,
                    status: status
                });
            } else {
                status = {
                    'code': '1',
                    'err': 'Tài khoản bị vô hiệu hóa.'
                }
                res.json({
                    status: status
                });
            }
        } else {
            status = {
                'code': '0',
                'message': err
            }
            res.json({
                status: status
            });
        }
    });
    // res.json({message: 'This is login function!'});
};

var checkToken = (req, res) => {
    res.json({'message': req.decoded})
};

var updateUser = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address
    };

    mUser.updateUser(request, (err, response) => {
        let status = {},
            data = {};
        if (!err && response) {
            status = {
                'code': '1',
                'err': ''
            }
            data = response;
            res.json({
                body: data,
                status: status
            });
        } else {
            status = {
                'code': '0',
                'message': err
            }
            res.json({
                status: status
            });
        }
    });
}

exports = module.exports = {
    login: login,
    checkToken: checkToken,
    updateUser: updateUser
}