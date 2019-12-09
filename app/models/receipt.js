const mongoose = require('../config/db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Receipt', new Schema({
	userID: String,
    products: [{
		productID: String, // _id của product
		variationID: String, // lấy giá trị trong product để chọn
		amount: String,
		price: String
	}],
	deliveryFee: String,
	supplierID: String, // __id của supplier
	totalPrice: String, // = giá nhập*số lượng + phí vận chuyển
	status: {
		type: String,
		enum: ['PENDING', 'FINISHED', 'CANCELED'],
		default: 'PENDING' // Chờ xác nhận đơn hàng
	}
}, {
    timestamps: true
}));

