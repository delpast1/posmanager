'use strict';
const mPartner = require('../modules/index').partner;

var getPartner = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }

    mPartner.getPartner(request, (err, response) => {
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
};

var getListOfPartners = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        classify: req.body.classify
    }
    mPartner.getListOfPartners(request, (err, response) => {
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
};

var addPartner = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        birthdate: req.body.birthdate,
        cmnd: req.body.cmnd,
        gender: req.body.gender,
        classify: req.body.classify,
        address: req.body.address,
    };
    mPartner.addPartner(request, (err, response) => {
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
};

var updatePartner = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        birthdate: req.body.birthdate,
        cmnd: req.body.cmnd,
        gender: req.body.gender,
        classify: req.body.classify,
        address: req.body.address,
    };
    mPartner.updatePartner(request, (err, response) => {
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

var removePartner = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }

    mPartner.removePartner(request, (err, response) => {
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
};


exports = module.exports = {
    getPartner: getPartner,
    getListOfPartners: getListOfPartners,
    addPartner: addPartner,
    updatePartner: updatePartner,
    removePartner: removePartner
}