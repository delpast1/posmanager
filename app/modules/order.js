'use strict';
const Order = require('../models/order');
const Product = require('../models/product');;

let noop = () => {};
let data = {};

var getOrder = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Order.findOne({'userID': req.userID, '_id': req.orderID }, (err, order) => {
        let errors = [];
        if (err || !order) {
            errors.push('Sản phẩm không tồn tại');
            return cb(errors);
        } 

        return cb(null, order);
    });
};

var getListOfOrders = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
        Order.find({'userID': req.userID}, (err, orders) => {
        if (err) {
            return cb(err);
        }
        return cb(null, orders);
    });
};

var addOrder = (request, callback) => {
    let isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        
        var errors = [];
        if (!req.products) {
            errors.push('Cần nhập sản phẩm.');
        }
        if (!req.customerPhone) {
            errors.push('Cần nhập thông tin khách hàng.');
        }
        if (!isVNPhoneMobile.test(req.customerPhone)) {
            errors.push('Số điện thoại sai.')
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('addOrder', errors)
        }
    });
        

    workflow.on('addOrder', async (errors) => {
        try {
            let totalPrice = 0;
            let products = JSON.parse(req.products);
            for(let i=0; i<products.length; i++) {
                await getAmountOfVariation(products[i]);
                
                if (data.errors) {
                    return cb(data.errors);
                } else {
                    for(let j=0; j< data.variations.length; j++) {
                        if (data.variations[j]._id.equals(products[i].variationID)) {
                            if (parseInt(products[i].amount) >  parseInt(data.variations[j].numberOfUnits)) {
                                errors.push('Không đủ số lượng hàng: '+products[i].variationID);
                                return cb(errors);
                            } 
                            totalPrice = totalPrice + products[i].amount*products[i].price;
                        }
                    }
                }
            };

            for(let i=0; i<products.length; i++) {
                await decreaseAmountOfVariation(products[i]);
            };
            let deliveryCost = req.deliveryCost || '0';
            totalPrice = totalPrice + Number(deliveryCost);
            let newOrder = new Order({
                userID: req.userID,
                products: products,
                customerInfo: {
                    customerName: req.customerName,
                    customerPhone: req.customerPhone,
                    address: req.address
                },
                totalPrice: totalPrice,
                paymentMethod: req.paymentMethod,
                deliveryMethod: {
                    deliveryType: req.deliveryType,
                    deliveryCost: req.deliveryCost || '',
                    deliveryNumber: req.deliveryNumber || ''
                },
                notes: req.notes
            });
            newOrder.save((err) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, newOrder);
            });   
        } catch (err) {
            errors.push('Sai định dạng input.')
            return cb(errors);
        }
         
    });
    workflow.emit('validateParams');
};

var updateOrderStatus = (request, callback) => {
    let cb = callback || noop,
        req = request || {};

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        
        var errors = [];
        if (!req.orderID) {
            errors.push('Cần nhập order id.');
        }
        if (!req.status) {
            errors.push('Cần nhập trạng thái đơn hàng.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updateOrder', errors)
        }
    });

    workflow.on('updateOrder', (errors) => {
        if (req.status === 'CANCELED') {
            Order.findOne({"userID": req.userID, "_id": req.orderID}, async (err, order) => {
                if (err) {
                    return cb(err);
                }
                if (order.status === 'CANCELED') {
                    errors.push('Không thể thay đổi trạng thái đơn hàng bị hủy.');
                    return cb(errors);
                } else {
                    for(let i=0; i<order.products.length; i++) {
                        await increaseAmountOfVariation(order.products[i]);
                    };
                    order.status = req.status;
                    order.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, order);
                    }); 
                }
            });
        } else {
            Order.findOne({"userID": req.userID, "_id": req.orderID}, (err, order) => {
                if (err) {
                    return cb(err);
                }
                if (order.status === 'CANCELED') {
                    errors.push('Không thể thay đổi trạng thái đơn hàng bị hủy.');
                    return cb(errors);
                } else {
                    order.status = req.status;
                    order.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, order);
                    }); 
                }
            });
        }  
    });
    workflow.emit('validateParams');
};

var getAmountOfVariation = async (product) => {
    let errors = [];
    await Product.findOne({"_id": product.productID, "variations._id": product.variationID}, (err, product) => {
        if (err) {
            data = {
                errors : err
            };
        }
        if (!product) {
            errors.push('Sản phẩm/biến thể không tồn tại.');
            data = {
                errors: errors
            };
        } else {
            data = {
                errors: null,
                variations: product.variations
            };
        }
    });

    return;
};

var decreaseAmountOfVariation = async(product) => {
    await Product.findOne({"_id": product.productID, "variations._id": product.variationID}, (err, oneProduct) => {
        if (err) {
            throw err;
        }
        if (oneProduct) {
            for(let j=0; j< oneProduct.variations.length; j++) {
                if (oneProduct.variations[j]._id.equals(product.variationID)) {
                    oneProduct.variations[j].numberOfUnits = parseInt(oneProduct.variations[j].numberOfUnits) - parseInt(product.amount);
                }
            }
            oneProduct.save((err) => {
                if (err) {
                    throw err;
                }
            });
        }
    });
};

var increaseAmountOfVariation = async (product) => {
    await Product.findOne({"_id": product.productID, "variations._id": product.variationID}, (err, oneProduct) => {
        if (err) {
            throw err;
        }
        if (oneProduct) {
            for(let j=0; j< oneProduct.variations.length; j++) {
                if (oneProduct.variations[j]._id.equals(product.variationID)) {
                    oneProduct.variations[j].numberOfUnits = parseInt(oneProduct.variations[j].numberOfUnits) + parseInt(product.amount);
                }
            }
            oneProduct.save((err) => {
                if (err) {
                    throw err;
                }
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