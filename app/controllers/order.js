'use strict';
const mOrder = require('../modules/index').order;

var getOrder = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        orderID: req.body.orderID
    }
    mOrder.getOrder(request, (err, response) => {
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

var getListOfOrders = (req, res) => {
    let request = {
        userID: req.decoded.userID
    }
    mOrder.getListOfOrders(request, (err, response) => {
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

var addOrder = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        products: req.body.products,
        totalPrice: req.body.totalPrice,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        address: req.body.address,
        discountType: req.body.dicountType,
        amount: req.body.amount,
        typeSale: req.body.typeSale,
        deliveryType: req.body.deliveryType,
        deliveryCost: req.body.deliveryCost,
        deliveryNumber: req.body.deliveryNumber,
        paymentMethod: req.body.paymentMethod,
        status: req.body.status,
        notes: req.body.notes,
    };
    mOrder.addOrder(request, (err, response) => {
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

var updateOrderStatus = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        orderID: req.body.orderID,
        status: req.body.status
    };
    mOrder.updateOrderStatus(request, (err, response) => {
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
    getOrder: getOrder,
    getListOfOrders: getListOfOrders,
    addOrder: addOrder,
    updateOrderStatus: updateOrderStatus
}