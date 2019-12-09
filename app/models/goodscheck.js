var mongoose = require('../db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Unit', new Schema({
    productID: String, // _id của product
	realAmount: String, // Số lượng kiểm thực tế
	oldAmount: String, // Số lượng tồn trước đó
	difference: String, // realAmount - oldAmount
	notes: String // Ghi chú
}));

