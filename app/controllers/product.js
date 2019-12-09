'use strict';
const mProduct = require('../modules/index').product;

var getProduct = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }
    mProduct.getProduct(request, (err, response) => {
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

var getListOfCategories = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }
    mProduct.getListOfCategories(request, (err, response) => {
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

var getListOfProducts = (req, res) => {
    let request = {
        userID: req.decoded.userID
    }
    mProduct.getListOfProducts(request, (err, response) => {
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

var getProductsOfCategory = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        category: req.body.category
    };
    mProduct.getProductsOfCategory(request, (err, response) => {
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


var addProduct = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        SKU: req.body.SKU,
        name: req.body.name,
        barcode: req.body.barcode,
        description: req.body.description,
        retailPrice: req.body.retailPrice,
        wholesalePrice: req.body.wholesalePrice,
        costPrice: req.body.costPrice,
        unitOfMeasure: req.body.unitOfMeasure,
        category: req.body.category,
        brand: req.body.brand,
        images: req.body.images
    };
    mProduct.addProduct(request, (err, response) => {
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

var updateProduct = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id,
        SKU: req.body.SKU,
        name: req.body.name,
        barcode: req.body.barcode,
        description: req.body.description,
        retailPrice: req.body.retailPrice,
        wholesalePrice: req.body.wholesalePrice,
        costPrice: req.body.costPrice,
        unitOfMeasure: req.body.unitOfMeasure,
        category: req.body.category,
        brand: req.body.brand,
        status: req.body.status
    };

    mProduct.updateProduct(request, (err, response) => {
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

var removeProduct= (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    }

    mProduct.removeProduct(request, (err, response) => {
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

var getVariationsOfProduct = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        _id: req.body._id
    };
    mProduct.getVariationsOfProduct(request, (err, response) => {
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

var getListOfVariations = (req, res) => {
    let request = {
        userID: req.decoded.userID
    };
    mProduct.getListOfVariations(request, (err, response) => {
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

var addVariation = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        productID: req.body.productID,
        size: req.body.size,
        color: req.body.color,
        numberOfUnits: req.body.numberOfUnits
    };

    mProduct.addVariation(request, (err, response) => {
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

var updateVariation = (req, res) => { 
    let request = {
        userID: req.decoded.userID,
        productID: req.body.productID,
        variationID: req.body.variationID,
        size: req.body.size,
        color: req.body.color,
        numberOfUnits: req.body.numberOfUnits
    };

    mProduct.updateVariation(request, (err, response) => {
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
            });
        }
    });
}

var removeVariation = (req, res) => {
    let request = {
        userID: req.decoded.userID,
        productID: req.body.productID,
        variationID: req.body.variationID
    };

    mProduct.removeVariation(request, (err, response) => {
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
}
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
    removeVariation: removeVariation
    
}