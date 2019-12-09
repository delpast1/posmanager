'use strict';
const Unit = require('../models/unit');

let noop = () => {};

var getUnit = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Unit.findOne({'userID': req.userID, '_id': req._id }, (err, unit) => {
        let errors = [];
        if (err || !unit) {
            errors.push('Đơn vị không tồn tại.');
            return cb(errors);
        } 

        return cb(null, unit);
    });
};

var getListOfUnits = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Unit.find({'userID': req.userID}, (err, units) => {
        if (err) {
            return cb(err);
        }
        return cb(null, units);
    });
};

var addUnit = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.symbol) {
            errors.push('Cần nhập ký hiệu của đơn vị tính.');
        }
        if (!req.name) {
            errors.push('Cần nhập tên của đơn vị tính.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('addUnit', errors)
        }
    });
        

    workflow.on('addUnit', (errors) => {
        Unit.findOne({'userID': req.userID, 'symbol': req.symbol}, (err, unit) =>{
            console.log('test');
            if (err) {
                return cb('Connect failed')
            } else {
                if (!unit) {
                    var newUnit = new Unit({
                        userID: req.userID,
                        symbol: req.symbol,
                        name: req.name
                    });
                    newUnit.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, newUnit);
                    });
                } else {
                    errors.push('Ký hiệu bị trùng.')
                    return cb(errors);
                }
            }
        });              
    });
    workflow.emit('validateParams');
};

var updateUnit= (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.symbol) {
            errors.push('Cần nhập ký hiệu của đơn vị tính.');
        }
        if (!req.name) {
            errors.push('Cần nhập tên của đơn vị tính.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updateUnit', errors)
        }
    });

    workflow.on('updateUnit', (errors) => {
        Unit.findOne({'userID': req.userID, 'symbol': req.symbol}, (err, unit) => {
            if (err || unit) {
                errors.push('Đơn vị tính bị trùng.');
                return cb(errors);
            } else {
                Unit.findByIdAndUpdate(req._id, {
                    symbol: req.symbol,
                    name: req.name
                }, {new: true}, (err, updatedUnit) => {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, updatedUnit);
                });
            }
        });
    });
    workflow.emit('validateParams');
}

var removeUnit = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Unit.deleteOne({'userID': req.userID, '_id': req._id }, (err) => {
        let errors = [];
        if (err) {
            errors.push('Đơn vị tính không tồn tại');
            return cb(errors);
        } 

        return cb(null, 'Đã xóa thành công.');
    });
};


exports = module.exports = {
    getUnit: getUnit,
    getListOfUnits: getListOfUnits,
    addUnit: addUnit,
    updateUnit: updateUnit,
    removeUnit: removeUnit
}
