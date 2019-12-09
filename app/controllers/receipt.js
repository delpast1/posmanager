'use strict';
const mReceipt = require('../modules/index').receipt;


var getReceipt = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        receiptID: req.body.receiptID
    }
    mReceipt.getReceipt(request, (err, response) => {
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
            })
        } else {
            status = {
                'code': '0',
                'message': err
            }
            res.json({
                status: status
            })
        }
    });
};

var getListOfReceipts = (req, res) => {
    let request = {
        userID: req.decoded.userID
    }
    mReceipt.getListOfReceipts(request, (err, response) => {
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

var addReceipt = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        products: req.body.products,
        supplierID: req.body.supplierID,
        deliveryFee: req.body.deliveryFee
    };
    mReceipt.addReceipt(request, (err, response) => {
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

var finishReceipt = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        receiptID: req.body.receiptID,
    };
    mReceipt.finishReceipt(request, (err, response) => {
        let status = {},
            data = {};
            
        if (!err && response) {
            if (response.errors) {
                status = {
                    'code': '0',
                    'message': response.errors
                }
                res.json({
                    status: status
                });

            } else {
                status = {
                    'code': '1',
                    'err': ''
                }
                data = response;
                res.json({
                    body: data,
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
};

var cancelReceipt = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        receiptID: req.body.receiptID,
    };
    mReceipt.cancelReceipt(request, (err, response) => {
        let status = {},
            data = {};
            
        if (!err && response) {
            if (response.errors) {
                status = {
                    'code': '0',
                    'message': response.errors
                }
                res.json({
                    status: status
                });

            } else {
                status = {
                    'code': '1',
                    'err': ''
                }
                data = response;
                res.json({
                    body: data,
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
};

exports = module.exports = {
    getReceipt: getReceipt,
    getListOfReceipts: getListOfReceipts,
    addReceipt: addReceipt,
    finishReceipt: finishReceipt,
    cancelReceipt: cancelReceipt
}