'use strict';
const Receipt = require('../models/receipt');
const Product = require('../models/product');

let data = {};
let noop = () => {};

var getReceipt = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Receipt.findOne({'userID': req.userID, '_id': req.receiptID }, (err, receipt) => {
        let errors = [];
        if (err || !receipt) {
            errors.push('Sản phẩm không tồn tại');
            return cb(errors);
        } 

        return cb(null, receipt);
    });
};

var getListOfReceipts = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
        Receipt.find({'userID': req.userID}, (err, receipts) => {
        if (err) {
            return cb(err);
        }
        return cb(null, receipts);
    });
};

var addReceipt = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        
        let errors = [];
        if (!req.products) {
            errors.push('Cần nhập sản phẩm.');
        }
        if (!req.supplierID) {
            errors.push('Cần nhập supplier.');
        }
        if (!req.deliveryFee) {
            errors.push('Cần nhập giá vận chuyển.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('addReceipt', errors)
        }
    });
        

    workflow.on('addReceipt', async (errors) => {
        try {
            let totalPrice = 0;
            let products = JSON.parse(req.products);
            for(let i=0; i<products.length; i++) {
                totalPrice = totalPrice + products[i].price*products[i].amount;
            };
            
            totalPrice = totalPrice + parseInt(req.deliveryFee);
            let newReceipt = new Receipt({
                userID: req.userID,
                products: products,
                deliveryFee: req.deliveryFee,
                supplierID: req.supplierID,
                totalPrice: totalPrice,
                status: 'PENDING'
            });
            newReceipt.save((err) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, newReceipt);
            });   
        } catch (err) {
            errors.push('Sai định dạng input.')
            return cb(errors);
        }
         
    });
    workflow.emit('validateParams');
};

var finishReceipt = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let errors = [];

    Receipt.findOne({"userID": req.userID, "_id": req.receiptID}, async (err, receipt) => {
        if (err) {
            return cb(err);
        };

        if (receipt) {
            if (receipt.status === 'PENDING') {
                for(let i=0; i < receipt.products.length; i++) {
                    await getAmountOfVariation(receipt.products[i]);
                }
                if (data.errors) {
                    return cb(data.errors);
                } else {
                    for(let i=0; i < receipt.products.length; i++) {
                        await increaseAmountOfVariation(receipt.products[i]);
                    }
                    receipt.status = 'FINISHED';
                    receipt.save((err) => {
                        if (err) {
                            throw err;
                        }
                        return cb(null, receipt);
                    });
                }
            } else {
                errors.push('Không thể thay đổi trạng thái của đơn nhập hàng đã hoàn thành hoặc đã bị hủy.');
                return cb(errors);
            }
            
        } else {
            errors.push('Receipt không tồn tại.');
            return cb(errors);
        }
    });
};

var cancelReceipt = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let errors = [];

    Receipt.findOne({"userID": req.userID, "_id": req.receiptID}, async (err, receipt) => {
        if (err) {
            return cb(err);
        };
        
        if (receipt) {
            if (receipt.status === 'PENDING') {
                receipt.status = 'CANCELED';
                receipt.save((err) => {
                    return cb(null, receipt);
                });
            } else {
                errors.push('Không thể thay đổi trạng thái của đơn nhập hàng đã hoàn thành hoặc đã bị hủy.');
                return cb(errors);
            }
            
        } else {
            errors.push('Receipt không tồn tại.');
            return cb(errors);
        }
    });
};

// Kiểm tra sản phẩm/biến thể có tồn tại không
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

//tăng số lượng biến thể và update costPrice
var increaseAmountOfVariation = async (product) => { 
    let errors = [];
    let totalAmount = 0; //biến đếm tổng số sản phẩm trước khi nhập hàng

    await Product.findOne({"_id": product.productID, "variations._id": product.variationID}, (err, oneProduct) => {
        if (err) {
            data = {
                errors : err
            };
        }
        if (!oneProduct) {
            errors.push('Sản phẩm/biến thể không tồn tại.');
            data = {
                errors: errors
            };
            return;
        } else {
            let currentCostPrice = parseInt(oneProduct.info.costPrice); // giá vốn sản phẩm hiện tại
            for(let j=0; j< oneProduct.variations.length; j++) {
                totalAmount = totalAmount + parseInt(oneProduct.variations[j].numberOfUnits);
                if (oneProduct.variations[j]._id.equals(product.variationID)) {
                    oneProduct.variations[j].numberOfUnits = parseInt(oneProduct.variations[j].numberOfUnits) + parseInt(product.amount);
                }
            }
            let costPrice = (currentCostPrice*totalAmount + parseInt(product.amount)*parseInt(product.price))/(totalAmount+parseInt(product.amount));
            oneProduct.info.costPrice = (costPrice.toFixed(2)).toString();
            oneProduct.save((err) => {
                data = {
                    errors: err
                };
            });
            return;
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