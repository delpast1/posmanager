'use strict';
const Product = require('../models/product');
const Order = require('../models/order');
const Receipt = require('../models/receipt');
let noop = () => {};

var generalReport = async (request, callback) => {
    let cb = callback || noop,
        req = request || {};

    let revenue = 0, // doanh thu
        costValuation = 0, // định giá tồn kho
        costReceipt = 0; // chi phí nhập hàng

    await Product.find({'userID': req.userID}, (err, products) => {
        if (err) return cb(err);
        for(let i=0; i < products.length; i++) {
            costValuation += Number(products[i].info.costPrice);
        }
    });

    await Order.find({'userID': req.userID}, (err, orders) => {
        if (err) return cb(err);
        for(let i=0; i < orders.length; i++) {
            if (orders[i].status === "COMPLETED") {
                revenue += Number(orders[i].totalPrice);
            }
        }
    });

    await Receipt.find({'userID': req.userID}, (err, receipts) => {
        if (err) return cb(err);
        for(let i=0; i < receipts.length; i++) {
            if (receipts[i].status === 'FINISHED') {
                costReceipt += Number(receipts[i].totalPrice);
            }
        }
    });
    
    let response = {
        revenue: revenue,
        costValuation: costValuation,
        costReceipt: costReceipt
    }
    return cb(null, response);
    
}

exports = module.exports = {
    generalReport: generalReport
}