'use strict';
const Partner = require('../models/partner');

let noop = () => {};

var getPartner = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Partner.findOne({'userID': req.userID, '_id': req._id }, (err, partner) => {
        let errors = [];
        if (err || !partner) {
            errors.push('Đối tác không tồn tại');
            return cb(errors);
        } 

        return cb(null, partner);
    });
};

var getListOfPartners = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    console.log(req);
    
    Partner.find({'userID': req.userID, 'classify': req.classify}, (err, partners) => {
        if (err) {
            return cb(err);
        }
        return cb(null, partners);
    });
};

var addPartner = (request, callback) => {
    const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.fullname) {
            errors.push('Cần nhập tên đối tác.');
        }
        if (!req.phone) {
            errors.push('Cần nhập số điện thoại đối tác.');
        }
        if (!isVNPhoneMobile.test(req.phone)) {
            errors.push('Số điện thoại sai.')
        }
        if (!req.address) {
            errors.push('Cần nhập địa chỉ đối tác.');
        }
        if (!req.classify) {
            errors.push('Cần nhập loại đối tác.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('checkPartner', errors)
        }
    });
        

    workflow.on('checkPartner', (errors) => {
        Partner.findOne({'userID': req.userID, 'info.phone': req.phone}, (err, partner) => {
            if (err) {
                return cb('Connect failed')
            } else {
                if (!partner) {
                    var newPartner = new Partner({
                        userID: req.userID,
                        info: {
                            fullname: req.fullname,
                            phone: req.phone,
                            address: req.address
                        },
                        additionalInfo: {
                            email: req.email,
                            birthdate: req.birthdate,
                            cmnd: req.cmnd,
                            gender: req.gender
                        },
                        classify: req.classify
                    });
                    newPartner.save((err) => {
                        if (err) {
                            return cb(err);
                        }
                        return cb(null, newPartner);
                    });
                } else {
                    errors.push('Số điện thoại đã tồn tại.')
                    return cb(errors);
                }
            }
        });
    });
    workflow.emit('validateParams');
};

var updatePartner = (request, callback) => {
    const isVNPhoneMobile = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    let cb = callback || noop,
        req = request || {};
    
    let workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', () => {
        var errors = [];
        if (!req.fullname) {
            errors.push('Cần nhập tên đối tác.');
        }
        if (!req.phone) {
            errors.push('Cần nhập số điện thoại đối tác.');
        }
        if (!isVNPhoneMobile.test(req.phone)) {
            errors.push('Số điện thoại sai.')
        }
        if (!req.address) {
            errors.push('Cần nhập địa chỉ đối tác.');
        }
        if (!req.classify) {
            errors.push('Cần nhập loại đối tác.');
        }

        if (errors.length > 0) {
            return cb(errors);
        } else {
            workflow.emit('updatePartner', errors)
        }
    });

    workflow.on('updatePartner', (errors) => {
        Partner.findOne({'userID': req.userID, '_id': req._id }, (err, partner) => {
            if (err || !partner) {
                errors.push('Đối tác không tồn tại');
                return cb(errors);
            } else {
                let oldPhone = partner.info.phone;
                Partner.findOne({'userID': req.userID, 'info.phone': req.phone }, (err, partner) => {
                    if (!partner || partner.info.phone === oldPhone) {
                        Partner.findByIdAndUpdate(req._id, {
                            info: {
                                fullname: req.fullname,
                                phone: req.phone,
                                address: req.address
                            },
                            additionalInfo: {
                                email: req.email,
                                birthdate: req.birthdate,
                                cmnd: req.cmnd,
                                gender: req.gender
                            },
                            classify: req.classify
                        }, {new: true}, (err, updatedPartner) => {
                            if (err) {
                                return cb(err);
                            }
                            return cb(null, updatedPartner);
                        });
                    } else {
                        errors.push('Số điện thoại đã tồn tại.')
                        return cb(errors);
                    }
                });
            }
        });
    });
    workflow.emit('validateParams');
}

var removePartner = (request, callback) => {
    let cb = callback || noop,
        req = request || {};
    
    Partner.deleteOne({'userID': req.userID, '_id': req._id }, (err) => {
        let errors = [];
        if (err) {
            errors.push('Đối tác không tồn tại');
            return cb(errors);
        } 

        return cb(null, 'Đã xóa thành công.');
    });
};


exports = module.exports = {
    getPartner: getPartner,
    getListOfPartners: getListOfPartners,
    addPartner: addPartner,
    updatePartner: updatePartner,
    removePartner: removePartner
}
