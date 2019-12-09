var admin = require('./admin');
var user = require('./user');
var partner = require('./partner');
var unit = require('./unit');
var product = require('./product');
var order = require('./order');
var receipt = require('./receipt');
var report = require('./report');

exports = module.exports = {
    admin: admin,
    user: user,
    partner: partner,
    product: product,
    unit: unit,
    order: order,
    receipt: receipt,
    report: report
}
