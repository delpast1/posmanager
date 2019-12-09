'use strict';
const mUnit = require('../modules/index').unit;

var getUnit = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }

    mUnit.getUnit(request, (err, response) => {
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

var getListOfUnits = (req, res) => {
    let request = {
        userID: req.decoded.userID
    }
    mUnit.getListOfUnits(request, (err, response) => {
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

var addUnit = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        symbol: req.body.symbol,
        name: req.body.name
    };
    mUnit.addUnit(request, (err, response) => {
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

var updateUnit = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id,
        symbol: req.body.symbol,
        name: req.body.name
    };

    mUnit.updateUnit(request, (err, response) => {
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

var removeUnit= (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }

    mUnit.removeUnit(request, (err, response) => {
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
    getUnit: getUnit,
    getListOfUnits: getListOfUnits,
    addUnit: addUnit,
    updateUnit: updateUnit,
    removeUnit: removeUnit
}