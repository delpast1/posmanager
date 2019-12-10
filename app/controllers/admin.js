'use strict';
const mAdmin = require('../modules/index').admin;
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Receipt = require('../models/receipt');
const Partner = require('../models/partner');
const Unit = require('../models/unit');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const secretKeyAdmin = require('../config/config').adminSecret;
const escapeRegex = require('../helpers/regex-escape');
const ejs = require('ejs');

var createAdmin = (req,res) => {
    mAdmin.createAdmin(req, (err, response) => {
        let token = '',
            status = {},
            data = {};
     

        res.json({
            body: response,
            status: status
        })
    });
    // res.json({message: 'This is login function!'});
};
// controller đăng nhập
var login = (req,res) => {
    var request = {
        username: req.body.username,
        password: req.body.password
    };
    //response chính là user trong hàm callback return từ module
    mAdmin.login(request, (err, response) => {
        let token = '',
            data = {};
        if (!err && response) {
            let signresponse = {
                username: response.username
            }
            token = jwt.sign(signresponse, secretKeyAdmin, {
                expiresIn: '1d'
            });

            req.session.token = token;
            res.redirect('/admin/dashboard');
        } else {
            res.render('pages/index',{
                page: 'login',
                errors: err
            });
        }
    });
};

var checkToken = (req, res) => {
    res.json({'message': req.decoded})
};

var dashboard = (req, res) => {
    res.render('pages/dashboard', {page: 'dashboard'});
}

var logOut = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

var usersPage = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    let errors = [];
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => { 
        if (req.query.idSearch) {
            if (!check_id.test(req.query.idSearch)) {
                errors.push('_id không hợp lệ.');
            }
        }
        if (errors.length > 0) {
            User.find({}).skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, users) => {
                if (err) throw err;
                User.countDocuments({}).exec((err, count) => {
                    res.render('pages/dashboard', {
                        page: 'usersManage',
                        users: users,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors
                    });
                });
            });
        } else {
            workflow.emit('next', errors);
        }
    });

    workflow.on('next', (errors) => {
        if (req.query.idSearch) {       
            User.find({'_id': req.query.idSearch}).skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, users) => {
                if (err) throw err;
                User.countDocuments({'_id': req.query.idSearch}).exec((err, count) => {
                    if (err) throw err;
                    res.render('pages/dashboard', {
                        page: 'usersManage',
                        users: users,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors
                    });
                });
            });
        } else {
            if (req.query.usersSearch) {
                let queryUsers = new RegExp(req.query.usersSearch || '', 'i');
                User.find({'info.email': queryUsers}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, users) => {
                    if (err) throw err;
                    User.countDocuments({'info.email': queryUsers}).exec((err, count) => {
                        if (err) throw err;
                        res.render('pages/dashboard', {
                            page: 'usersManage',
                            users: users,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors
                        });
                    });
                });
            } else {
                User.find({}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, users) => {
                    if (err) throw err;
                    User.countDocuments({}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'usersManage',
                            users: users,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors
                        });
                    });
                });
            }
        }
    })

    workflow.emit('validateParams');
}

var userSuspended = (req, res) => { 
    let id = req.params.id;
    User.findByIdAndUpdate(id, {'status': 'SUSPENDED'}, {new: true}, (err, user) => {
        if (err) throw err;
        res.redirect('/admin/all-users');
    });
}

var userActive = (req, res) => { 
    let perPage = 7 ;
    let page = 1;
    let id = req.params.id;
    User.findByIdAndUpdate(id, {'status': 'ACTIVE'}, {new: true}, (err, user) => {
        if (err) throw err;
        res.redirect('/admin/all-users');
    });
}

var choseUser = (req, res) => {
    req.session.userID = req.params.id;
    res.redirect('/admin/user/general-info');
};

var showUserGeneralInfo = (req,res) => {
    if (req.session.userID) {
        User.findById(req.session.userID, (err, user) => {
            req.session.email = user.info.email;
            res.render('pages/dashboard', {
                page: 'userGeneralInfo',
                user: user
            });
        });
    } else {
        res.render('pages/dashboard', {
            page: 'noresult'
        });
    }
};

var allProducts = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => { 
        if (req.query.idSearch) {
            if (!check_id.test(req.query.idSearch)) {
                errors.push('_id không hợp lệ.');
            }
        }
        if (errors.length > 0) {
            Product.find().skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, products) => {
                if (err) throw err;
                Product.countDocuments().exec((err, count) => {
                    res.render('pages/dashboard', {
                        page: 'allProducts',
                        products: products,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            workflow.emit('next', errors);
        }
    });

    workflow.on('next', (errors) => {
        if (req.query.idSearch) {       
            Product.find({'_id': req.query.idSearch}).skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, products) => {
                if (err) throw err;
                Product.countDocuments({'_id': req.query.idSearch}).exec((err, count) => {
                    if (err) throw err;
                    res.render('pages/dashboard', {
                        page: 'allProducts',
                        products: products,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            if (req.query.productSearch) { 
                let query = new RegExp(req.query.productSearch, 'i');       
                Product.find({$or: [{'info.SKU': query}, {'info.name': query}]}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, products) => {
                    if (err) throw err;
                    Product.countDocuments({$or: [{'info.SKU': query}, {'info.name': query}]}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allProducts',
                            products: products,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                Product.find().skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, products) => {
                    if (err) throw err;
                    Product.countDocuments().exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allProducts',
                            products: products,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            }
        }
    })

    workflow.emit('validateParams');
};

var allOrders = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => { 
        if (req.query.idSearch) {
            if (!check_id.test(req.query.idSearch)) {
                errors.push('_id không hợp lệ.');
            }
        }
        if (errors.length > 0) {
            Order.find().skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, orders) => {
                if (err) throw err;
                Order.countDocuments().exec((err, count) => {
                    res.render('pages/dashboard', {
                        page: 'allOrders',
                        orders: orders,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            workflow.emit('next', errors);
        }
    });

    workflow.on('next', (errors) => {
        if (req.query.idSearch) {       
            Order.find({'_id': req.query.idSearch}).skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, orders) => {
                if (err) throw err;
                Order.countDocuments({'_id': req.query.idSearch}).exec((err, count) => {
                    if (err) throw err;
                    res.render('pages/dashboard', {
                        page: 'allOrders',
                        orders: orders,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            if (req.query.orderSearch) { 
                let query = new RegExp(req.query.orderSearch, 'i');       
                Order.find({'customerInfo.customerName': query}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, orders) => {
                    if (err) throw err;
                    Order.countDocuments({'customerInfo.customerName': query}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allOrders',
                            orders: orders,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                Order.find().skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, orders) => {
                    if (err) throw err;
                    Order.countDocuments().exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allOrders',
                            orders: orders,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            }
        }
    })

    workflow.emit('validateParams');
};

var allReceipts = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => { 
        if (req.query.receiptSearch) {
            if (!check_id.test(req.query.receiptSearch)) {
                errors.push('id đơn nhập hàng không hợp lệ.');
            }
        }

        if (req.query.supplierSearch) {
            if (!check_id.test(req.query.supplierSearch)) {
                errors.push('id nhà cung cấp không hợp lệ.');
            }
        }
        if (errors.length > 0) {
            Receipt.find().skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, receipts) => {
                if (err) throw err;
                Receipt.countDocuments().exec((err, count) => {
                    res.render('pages/dashboard', {
                        page: 'allReceipt',
                        receipts: receipts,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            workflow.emit('next', errors);
        }
    });

    workflow.on('next', (errors) => {
        if (req.query.receiptSearch) {       
            Receipt.find({'_id': req.query.receiptSearch}).skip((perPage * page) - perPage)
            .limit(perPage).exec( (err, receipts) => {
                if (err) throw err;
                Receipt.countDocuments({'_id': req.query.receiptSearch}).exec((err, count) => {
                    if (err) throw err;
                    res.render('pages/dashboard', {
                        page: 'allReceipt',
                        receipts: receipts,
                        current: page,
                        pages: Math.ceil(count/perPage),
                        errors: errors,
                        email: req.session.email
                    });
                });
            });
        } else {
            if (req.query.supplierSearch) {     
                Receipt.find({'supplierID': req.query.supplierSearch}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, receipts) => {
                    if (err) throw err;
                    Receipt.countDocuments({'supplierID': req.query.supplierSearch}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allReceipt',
                            receipts: receipts,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                Receipt.find().skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, receipts) => {
                    if (err) throw err;
                    Receipt.countDocuments().exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'allReceipt',
                            receipts: receipts,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            }
        }
    })

    workflow.emit('validateParams');
}

var productsPage = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();
    if (req.session.userID) {
        workflow.on('validateParams', () => { 
            if (req.query.idSearch) {
                if (!check_id.test(req.query.idSearch)) {
                    errors.push('_id không hợp lệ.');
                }
            }
            if (errors.length > 0) {
                Product.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, products) => {
                    if (err) throw err;
                    Product.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'productManage',
                            products: products,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                workflow.emit('next', errors);
            }
        });
    
        workflow.on('next', (errors) => {
            if (req.query.idSearch) {       
                Product.find({'_id': req.query.idSearch, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, products) => {
                    if (err) throw err;
                    Product.countDocuments({'_id': req.query.idSearch, 'userID': req.session.userID }).exec((err, count) => {
                        if (err) throw err;
                        res.render('pages/dashboard', {
                            page: 'productManage',
                            products: products,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                if (req.query.productSearch) { 
                    let query = new RegExp(req.query.productSearch, 'i');       
                    Product.find({$or: [{'info.SKU': query}, {'info.name': query}], 'userID': req.session.userID }).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, products) => {
                        if (err) throw err;
                        Product.countDocuments({$or: [{'info.SKU': query}, {'info.name': query}], 'userID': req.session.userID }).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'productManage',
                                products: products,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                } else {
                    Product.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, products) => {
                        if (err) throw err;
                        Product.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'productManage',
                                products: products,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                }
            }
        })
    
        workflow.emit('validateParams');
    } else {
        res.render('pages/dashboard', {
            page: 'noresult'
        });
    }
};

var getProduct = (req, res) => {
    let errors = [];
    Product.findById(req.params.id, (err, product) => {
        if (err) throw err;
        res.render('pages/dashboard', {
            page: 'product',
            product: product,
            errors: errors
        });
    });
};

var updateProduct = (req, res) => {
    let workflow = new (require('events').EventEmitter)();
    workflow.on('validateParams', () => {
        let errors = [];
        if (!req.body.SKU) {
            errors.push('Cần nhập SKU của sản phẩm.');
        }
        if (!req.body.name) {
            errors.push('Cần nhập tên của sản phẩm.');
        }
        if (!req.body.retailPrice) {
            errors.push('Cần nhập giá bán lẻ.');
        }
        if (!req.body.costPrice) {
            errors.push('Cần nhập giá vốn.');
        }
        if (!req.body.unitOfMeasure) {
            errors.push('Cần nhập đơn vị tính.');
        }

        if (errors.length > 0) {
            Product.findById(req.body._id, (err, product) => {
                if (err) throw err;
                console.log(errors);
                res.render('pages/dashboard', {
                    page: 'product',
                    product: product,
                    errors: errors
                });
            });
        } else {
            workflow.emit('updateProduct', errors);
        }
    });

    workflow.on('updateProduct', (errors) => {
        Product.findById(req.body._id, (err, product) => {
            if (err) throw err;
            if (product.info.SKU === req.body.SKU) {
                product.info.name = req.body.name;
                product.info.barcode = req.body.barcode;
                product.info.description = req.body.description;
                product.info.retailPrice = req.body.retailPrice;
                product.info.costPrice = req.body.costPrice;
                product.info.unitOfMeasure = req.body.unitOfMeasure;
                product.info.category = req.body.category || '';
                product.info.brand = req.body.brand || '';
                product.status = req.body.status;
                product.save((err) => {
                    if (err) throw err;
                    res.render('pages/dashboard', {
                        page: 'product',
                        product: product,
                        errors: errors
                    });
                });
            } else {
                Product.findOne({'info.SKU': req.body.SKU}, (err, product) => {
                    if (err) throw err;
                    if (product) {
                        errors.push('SKU đã tồn tại.');
                        Product.findById(req.body._id, (err, product) => {
                            if (err) throw err;
                            res.render('pages/dashboard', {
                                page: 'product',
                                product: product,
                                errors: errors
                            });
                        });
                    } else {
                        Product.findByIdAndUpdate(req.body._id, {
                            '$set': {
                                'info.SKU': req.body.SKU,
                                'info.name': req.body.name,
                                'info.barcode': req.body.barcode,
                                'info.description': req.body.description,
                                'info.retailPrice': req.body.retailPrice,
                                'info.costPrice': req.body.costPrice,
                                'info.unitOfMeasure': req.body.unitOfMeasure,
                                'info.category': req.body.category,
                                'info.brand': req.body.brand,
                            }
                        }, {new: true}, (err, updatedProduct) => {
                            if (err) throw err;
                            res.render('pages/dashboard', {
                                page: 'product',
                                product: product,
                                errors: errors
                            });
                        });
                    }
                });
            }
        });              

    });
    workflow.emit('validateParams');
}

var deleteProduct = (req, res) => {
    Product.findOneAndRemove({'_id': req.params.id}, (err) => {
        if (err) throw err;
        res.redirect('/admin/product/all-products/');
    });
};

var ordersPage = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();
    if (req.session.userID) {
        workflow.on('validateParams', () => { 
            if (req.query.idSearch) {
                if (!check_id.test(req.query.idSearch)) {
                    errors.push('_id không hợp lệ.');
                }
            }
            if (errors.length > 0) {
                Order.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, orders) => {
                    if (err) throw err;
                    Order.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'orderManage',
                            orders: orders,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                workflow.emit('next', errors);
            }
        });
    
        workflow.on('next', (errors) => {
            if (req.query.idSearch) {       
                Order.find({'_id': req.query.idSearch, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, orders) => {
                    if (err) throw err;
                    Order.countDocuments({'_id': req.query.idSearch, 'userID': req.session.userID }).exec((err, count) => {
                        if (err) throw err;
                        res.render('pages/dashboard', {
                            page: 'orderManage',
                            orders: orders,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                if (req.query.orderSearch) { 
                    let query = new RegExp(req.query.orderSearch, 'i');       
                    Order.find({'customerInfo.customerName': query, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, orders) => {
                        if (err) throw err;
                        Order.countDocuments({'customerInfo.customerName': query, 'userID': req.session.userID }).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'orderManage',
                                orders: orders,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                } else {
                    Order.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, orders) => {
                        if (err) throw err;
                        Order.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'orderManage',
                                orders: orders,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                }
            }
        })
    
        workflow.emit('validateParams');
    } else {
        res.render('pages/dashboard', {
            page: 'noresult'
        });
    }
};

var getOrder = (req, res) => {
    let errors = [];
    Order.findById(req.params.id, (err, order) => {
        if (err) throw err;
        res.render('pages/dashboard', {
            page: 'order',
            errors: errors,
            order: order
        });
    });
};

var updateOrder = (req, res) => {
    let errors = [];
    Order.findById(req.body._id, (err, order) => {
        if (err) throw err;
        let currentDeliveryCost = Number(order.deliveryMethod.deliveryCost) || 0;
        let newDeliveryCost = Number(req.body.deliveryCost);
        let newTotalPrice = 0;
        if (currentDeliveryCost !== newDeliveryCost) {
            order.deliveryMethod.deliveryCost = newDeliveryCost;
            newTotalPrice = Number(order.totalPrice) - currentDeliveryCost + newDeliveryCost;
            order.totalPrice = newTotalPrice;
        }

        order.customerInfo.customerName = req.body.customerName || '';
        order.customerInfo.customerPhone = req.body.customerPhone || '';
        order.customerInfo.address = req.body.address || '';
        order.deliveryMethod.deliveryType = req.body.deliveryType;
        order.deliveryMethod.deliveryNumber = req.body.deliveryNumber || '';
        order.paymentMethod = req.body.paymentMethod;
        order.notes = req.body.notes;

        order.save((err) => {
            if (err) throw err;
            res.render('pages/dashboard', {
                page: 'order',
                errors: errors,
                order: order
            });
        });
    });
};

var receiptPage = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();
    if (req.session.userID) {
        workflow.on('validateParams', () => { 
            if (req.query.receiptSearch) {
                if (!check_id.test(req.query.receiptSearch)) {
                    errors.push('id đơn nhập hàng không hợp lệ.');
                }
            }

            if (req.query.supplierSearch) {
                if (!check_id.test(req.query.supplierSearch)) {
                    errors.push('id nhà cung cấp không hợp lệ.');
                }
            }
            if (errors.length > 0) {
                Receipt.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, receipts) => {
                    if (err) throw err;
                    Receipt.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'receiptManage',
                            receipts: receipts,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                workflow.emit('next', errors);
            }
        });
    
        workflow.on('next', (errors) => {
            if (req.query.receiptSearch) {       
                Receipt.find({'_id': req.query.receiptSearch, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, receipts) => {
                    if (err) throw err;
                    Receipt.countDocuments({'_id': req.query.receiptSearch, 'userID': req.session.userID }).exec((err, count) => {
                        if (err) throw err;
                        res.render('pages/dashboard', {
                            page: 'receiptManage',
                            receipts: receipts,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                if (req.query.supplierSearch) {     
                    Receipt.find({'supplierID': req.query.supplierSearch, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, receipts) => {
                        if (err) throw err;
                        Receipt.countDocuments({'supplierID': req.query.supplierSearch, 'userID': req.session.userID }).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'receiptManage',
                                receipts: receipts,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                } else {
                    Receipt.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, receipts) => {
                        if (err) throw err;
                        Receipt.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'receiptManage',
                                receipts: receipts,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                }
            }
        })
    
        workflow.emit('validateParams');
    } else {
        res.render('pages/dashboard', {
            page: 'noresult'
        });
    }
};

var getReceipt = (req, res) => {
    let errors = [];
    Receipt.findById(req.params.id, (err, receipt) => {
        if (err) throw err;
        res.render('pages/dashboard', {
            page: 'receipt',
            errors: errors,
            receipt: receipt
        });
    });
};

var updateReceipt = (req, res) => {
    let errors = [];
    Receipt.findById(req.body._id, (err, receipt) => {
        if (err) throw err;
        let currentDeliveryFee = Number(receipt.deliveryFee) || 0;
        let newDeliveryFee = Number(req.body.deliveryFee);
        let newTotalPrice = 0;
        if (currentDeliveryFee !== newDeliveryFee) {
            receipt.deliveryFee = newDeliveryFee;
            newTotalPrice = Number(receipt.totalPrice) - currentDeliveryFee + newDeliveryFee;
            receipt.totalPrice = newTotalPrice;
        }
        receipt.save((err) => {
            if (err) throw err;
            res.render('pages/dashboard', {
                page: 'receipt',
                errors: errors,
                receipt: receipt
            });
        });
    });
}

var partnerPage = (req, res) => {
    let perPage = 7 ;
    let page = req.params.page || 1;
    const check_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    let errors = [];

    let workflow = new (require('events').EventEmitter)();
    if (req.session.userID) {
        workflow.on('validateParams', () => { 
            if (req.query.idSearch) {
                if (!check_id.test(req.query.idSearch)) {
                    errors.push('_id không hợp lệ.');
                }
            }
            if (errors.length > 0) {
                Partner.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, partners) => {
                    if (err) throw err;
                    Partner.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                        res.render('pages/dashboard', {
                            page: 'partnerManage',
                            partners: partners,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                workflow.emit('next', errors);
            }
        });
    
        workflow.on('next', (errors) => {
            if (req.query.idSearch) {       
                Partner.find({'_id': req.query.idSearch, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                .limit(perPage).exec( (err, partners) => {
                    if (err) throw err;
                    Partner.countDocuments({'_id': req.query.idSearch, 'userID': req.session.userID }).exec((err, count) => {
                        if (err) throw err;
                        res.render('pages/dashboard', {
                            page: 'partnerManage',
                            partners: partners,
                            current: page,
                            pages: Math.ceil(count/perPage),
                            errors: errors,
                            email: req.session.email
                        });
                    });
                });
            } else {
                if (req.query.nameSearch) { 
                    let query = new RegExp(req.query.nameSearch, 'i');       
                    Partner.find({'info.fullname': query, 'userID': req.session.userID }).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, partners) => {
                        if (err) throw err;
                        Partner.countDocuments({'info.fullname': query, 'userID': req.session.userID }).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'partnerManage',
                                partners: partners,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                } else {
                    Partner.find({'userID': req.session.userID}).skip((perPage * page) - perPage)
                    .limit(perPage).exec( (err, partners) => {
                        if (err) throw err;
                        Partner.countDocuments({'userID': req.session.userID}).exec((err, count) => {
                            res.render('pages/dashboard', {
                                page: 'partnerManage',
                                partners: partners,
                                current: page,
                                pages: Math.ceil(count/perPage),
                                errors: errors,
                                email: req.session.email
                            });
                        });
                    });
                }
            }
        })
    
        workflow.emit('validateParams');
    } else {
        res.render('pages/dashboard', {
            page: 'noresult'
        });
    }
}

var getPartner = (req, res) => {
    let errors = [];
    Partner.findById(req.params.id, (err, partner) => {
        if (err) throw err;
        res.render('pages/dashboard', {
            page: 'partner',
            errors: errors,
            partner: partner
        });
    });
};

var updatePartner = (req, res) => {
    const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    let errors = [];
    let workflow = new (require('events').EventEmitter)();
    workflow.on('validateParams', () => {
        let errors = [];
        if (!req.body.fullname) {
            errors.push('Cần nhập tên đối tác.');
        }
        if (!req.body.phone) {
            errors.push('Cần nhập tên khách hàng.');
        }
        if (!isVNPhoneMobile.test(req.body.phone)) {
            errors.push('Số điện thoại sai.')
        }

        if (errors.length > 0) {
            Partner.findById(req.body._id, (err, partner) => {
                if (err) throw err;
                res.render('pages/dashboard', {
                    page: 'partner',
                    partner: partner,
                    errors: errors
                });
            });
        } else {
            workflow.emit('updatePartner', errors);
        }
    });

    workflow.on('updatePartner', (errors) => {             
        Partner.findByIdAndUpdate(req.body._id, {
            '$set': {
                'info.fullname': req.body.fullname,
                'info.phone': req.body.phone,
                'info.address': req.body.address,
                'additionalInfo.email': req.body.email,
                'additionalInfo.birthdate': req.body.birthdate,
                'additionalInfo.cmnd': req.body.cmnd,
                'additionalInfo.gender': req.body.gender,
                'info.classify': req.body.classify,
            }
        }, { new: true}, (err, updatedPartner) => {
            if (err) throw err;
            res.render('pages/dashboard', {
                page: 'partner',
                errors: errors,
                partner: updatedPartner
            });
        });
    });
    workflow.emit('validateParams');
}

var deletePartner = (req, res) => {
    Partner.findOneAndRemove({'_id': req.params.id}, (err) => {
        if (err) throw err;
        res.redirect('/admin/partner/all-partners/');
    });
}

exports = module.exports = {
    login: login,
    checkToken: checkToken,
    createAdmin: createAdmin,
    dashboard: dashboard,
    logOut: logOut,
    usersPage: usersPage,
    userSuspended: userSuspended,
    userActive: userActive,
    choseUser: choseUser,
    showUserGeneralInfo: showUserGeneralInfo,
    // unitsPage: unitsPage,
    // getUnit: getUnit,
    // updateUnit: updateUnit,
    // deleteUnit: deleteUnit,
    productsPage: productsPage,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,

    ordersPage: ordersPage,
    getOrder: getOrder,
    updateOrder: updateOrder,

    receiptPage: receiptPage,
    getReceipt: getReceipt,
    updateReceipt: updateReceipt,
    
    partnerPage: partnerPage,
    getPartner: getPartner,
    updatePartner: updatePartner,
    deletePartner: deletePartner,
    allProducts: allProducts,
    allOrders: allOrders,
    allReceipts: allReceipts
}