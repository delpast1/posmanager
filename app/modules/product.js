'use strict';
const Product = require('../models/product');

let noop = () => {};

var getProduct = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Product.findOne({'userID': req.userID, '_id': req._id }, (err, product) => {
        let errors = [];
        if (err || !product) {
            errors.push('Sản phẩm không tồn tại');
            return cb(errors);
        } 

        return cb(null, product);
    });
};

var getListOfCategories = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Product.find({'userID': req.userID}).distinct('info.category', (err, categories) => {
        let errors = [];
        if (err) {
            return cb(err);
        } 
        return cb(null, categories);
    });
};

var getProductsOfCategory = (request, callback) => {
    let cb = callback || noop,
        req = request || {},
        errors = [];
    
    Product.find({'userID': req.userID, 'info.category': req.category}, (err, products) => {
        if (err) {
            return cb(err);
        }
        if (products.length === 0) {
            errors.push("Không tìm thấy sản phẩm");
            return cb(errors);
        }
        return cb(null, products);
    });
};

var getListOfProducts = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Product.find({'userID': req.userID}, (err, products) => {
        if (err) {
            return cb(err);
        }
        return cb(null, products);
    });
};

var addProduct = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.SKU) {
            errors.push('Cần nhập SKU của sản phẩm.');
        }
        if (!req.name) {
            errors.push('Cần nhập tên của sản phẩm.');
        }
        if (!req.retailPrice) {
            errors.push('Cần nhập giá bán lẻ.');
        }
        if (!req.costPrice) {
            errors.push('Cần nhập giá vốn.');
        }
        if (!req.unitOfMeasure) {
            errors.push('Cần nhập đơn vị tính.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('addProduct', errors)
        }
    });
        

    workflow.on('addProduct', (errors) => {
        Product.findOne({'userID': req.userID, 'info.SKU': req.SKU}, (err, product) =>{
            if (err) {
                return cb('Connect failed')
            } else {
                if (!product) {
                    try {
                    let images = JSON.parse(req.images);
                    var newProduct = new Product({
                        userID: req.userID,
                        info: {
                            SKU: req.SKU,
                            name: req.name,
                            barcode: req.barcode,
                            description: req.description,
                            retailPrice: req.retailPrice,
                            costPrice: req.costPrice,
                            unitOfMeasure: req.unitOfMeasure,
                            category: req.category,
                            brand: req.brand
                        },
                        images: images,
                        status: "ACTIVE"
                    });
                    newProduct.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, newProduct);
                    });
                    } catch (err) {
                        errors.push('Sai định dạng input.')
                        return cb(errors);
                    }
                    
                } else {
                    errors.push('Mã SKU bị trùng.')
                    return cb(errors);
                }
            }
        });              
    });
    workflow.emit('validateParams');
};

var updateProduct = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        let errors = [];
        if (!req.SKU) {
            errors.push('Cần nhập SKU của sản phẩm.');
        }
        if (!req.name) {
            errors.push('Cần nhập tên của sản phẩm.');
        }
        if (!req.retailPrice) {
            errors.push('Cần nhập giá bán lẻ.');
        }
        if (!req.costPrice) {
            errors.push('Cần nhập giá vốn.');
        }
        if (!req.unitOfMeasure) {
            errors.push('Cần nhập đơn vị tính.');
        }
        if (!req.status) {
            errors.push('Cần nhập trạng thái sản phẩm.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updateProduct', errors)
        }
    });

    workflow.on('updateProduct', (errors) => {
        Product.findOne({'userID': req.userID, 'info.SKU': req.SKU}, (err, product) =>{
            if (err) {
                return cb('Connect failed')
            } else {
                if (!product) {
                    try {
                        Product.findOne({'userID': req.userID, '_id': req._id }, (err, oneProduct) => {
                            if (err || !oneProduct) {
                                errors.push('Sản phẩm không tồn tại.');
                                return cb(errors);
                            } else {
                                oneProduct.info.SKU = req.SKU;
                                oneProduct.info.name = req.name;
                                oneProduct.info.barcode = req.barcode;
                                oneProduct.info.description = req.description;
                                oneProduct.info.retailPrice = req.retailPrice;
                                oneProduct.info.costPrice = req.costPrice;
                                oneProduct.info.unitOfMeasure = req.unitOfMeasure;
                                oneProduct.info.category = req.category;
                                oneProduct.info.brand = req.brand;
                                oneProduct.status = req.status;
                                
                                oneProduct.save((err) => {
                                    if (err) {
                                        return cb(err);
                                    }
                                    return cb(null, oneProduct);
                                });
                            }
                        });
                    } catch (err) {
                        errors.push('Sai định dạng input.')
                        return cb(errors);
                    }
                    
                } else { // tìm SKU có ra sản phẩm
                    if (product._id.equals(req._id)) {
                        try {
                            Product.findOne({'userID': req.userID, '_id': req._id }, (err, oneProduct) => {
                                if (err || !product) {
                                    errors.push('Sản phẩm không tồn tại.');
                                    return cb(errors);
                                } else {
                                    oneProduct.info.SKU = req.SKU;
                                    oneProduct.info.name = req.name;
                                    oneProduct.info.barcode = req.barcode;
                                    oneProduct.info.description = req.description;
                                    oneProduct.info.retailPrice = req.retailPrice;
                                    oneProduct.info.costPrice = req.costPrice;
                                    oneProduct.info.unitOfMeasure = req.unitOfMeasure;
                                    oneProduct.info.category = req.category;
                                    oneProduct.info.brand = req.brand;
                                    oneProduct.status = req.status;
                                    
                                    oneProduct.save((err) => {
                                        if (err) {
                                            return cb(err);
                                        }
                                        return cb(null, oneProduct);
                                    });
                                }
                            });
                        } catch (err) {
                            errors.push('Sai định dạng input.')
                            return cb(errors);
                        }
                    } else {
                        errors.push('Mã SKU bị trùng.')
                        return cb(errors);
                    }
                }
            }
        });              

    });
    workflow.emit('validateParams');
}


var removeProduct = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Product.deleteOne({'userID': req.userID, '_id': req._id }, (err, product) => {
        let errors = [];
        if (err || !product) {
            errors.push('Đối tác không tồn tại');
            return cb(errors);
        } 

        return cb(null, 'Đã xóa thành công.');
    });
};

var getVariationsOfProduct = (request, callback) => {
    let cb = callback || noop,
        req = request || {},
        data = {};
    Product.findById(req._id, (err, product) => {
        if (err) {
            return cb(err);
        } 
        data = {
            productID: product._id,
            variations: product.variations
        }
        return cb(null, data);
    });
}

var getListOfVariations = (request, callback) => {
    let cb = callback || noop,
        req = request || {},
        response = [];
    
    Product.find({'userID': req.userID}, (err, products) => {
        if (err) return cb(err);
        for(let i=0; i< products.length; i++) {
            for(let j=0; j < products[i].variations.length; j++) {
                let variation = {
                    variationID: products[i].variations[j]._id,
                    productID: products[i]._id,
                    size: products[i].variations[j].size,
                    color: products[i].variations[j].color,
                    numberOfUnits: products[i].variations[j].numberOfUnits,
                    costPrice: products[i].info.costPrice,
                    retailPrice: products[i].info.retailPrice,
                }
                response.push(variation);
            }
        }
        return cb(null, response);
    });
}

var addVariation = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.productID) {
            errors.push('Cần nhập ID sản phẩm.');
        }
        if (!req.size) {
            errors.push('Cần nhập size.');
        }
        if (!req.color) {
            errors.push('Cần nhập màu sắc.');
        }
        if (!req.numberOfUnits) {
            errors.push('Cần nhập số lượng.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('addVariation', errors)
        }
    });
        

    workflow.on('addVariation', (errors) => {
        Product.findOne({'userID': req.userID, '_id': req.productID}, (err, product) =>{
            if (err) {
                return cb('Connect failed')
            } else {
                if (!product) {
                    errors.push('Không tìm thấy sản phẩm.')
                    return cb(errors);
                } else {
                    try {
                        let newVairation = {
                            'size': req.size,
                            'color': req.color,
                            'numberOfUnits': req.numberOfUnits
                        }
                        product.variations.push(newVairation);
                        console.log(product.variations);
                        product.save((err) => {
                            if (err) {
                                console.log(test);
                                return cb(err);
                            }
                            return cb(null, product.variations);
                        });
                    } catch (err) {
                        errors.push('Sai định dạng input.')
                        return cb(errors);
                    }
                }
            }
        });              
    });
    workflow.emit('validateParams');
};

var updateVariation = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    let errors = [];
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        let errors = [];
        if (!req.productID) {
            errors.push('Cần nhập ID sản phẩm.');
        }
        if (!req.variationID) {
            errors.push('Cần nhập ID biến thể.');
        }
        if (!req.size) {
            errors.push('Cần nhập size.');
        }
        if (!req.color) {
            errors.push('Cần nhập màu sắc.');
        }
        if (!req.numberOfUnits) {
            errors.push('Cần nhập số lượng.');
        }
        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updateVariation', errors);
        }
    });
    
    workflow.on('updateVariation', (errors) => {
        try {
            Product.findOneAndUpdate({'userID': req.userID ,'_id': req.productID, 'variations._id': req.variationID}, 
            {
                '$set': {
                    'variations.$.size': req.size,
                    'variations.$.color': req.color,
                    'variations.$.numberOfUnits': req.numberOfUnits
                }
            }, {new: true}, (err, updatedProduct) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, updatedProduct);
            });
        } catch (err) {
            // errors.push('Sai định dạng input.')
            throw err;
            return cb(err);
        }
    });
    workflow.emit('validateParams');
}

var removeVariation = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    let errors = [];

    try {
        Product.findOne({'userID': req.userID ,'_id': req.productID},  (err, product) => {
            if (err) {
                return cb(err);
            }
            let variations = product.variations;
            if (variations.length > 1) {
                for(let i=0; i < variations.length; i++) {
                    if (variations[i]._id.equals(req.variationID)) {
                        variations.splice(i, 1);
                        break;
                    }
                }
            } else {
                errors.push('Sản phẩm phải có ít nhất một biến thể.');
                return cb(errors);
            }
            // console.log(variations);
            product.variations = variations;
            product.save((err) => {
                if (err) {
                    return cb(err);
                }
                return cb(null, product);
            });
        });
    } catch (err) {
        errors.push('Sai định dạng input.')
        return cb(errors);
    }
};


exports = module.exports = {
    getProduct: getProduct,
    getListOfCategories: getListOfCategories,
    getListOfProducts: getListOfProducts,
    getProductsOfCategory: getProductsOfCategory,
    addProduct: addProduct,
    updateProduct: updateProduct,
    removeProduct: removeProduct,
    getVariationsOfProduct: getVariationsOfProduct,
    getListOfVariations: getListOfVariations,
    addVariation: addVariation,
    updateVariation: updateVariation,
    removeVariation: removeVariation,

}
