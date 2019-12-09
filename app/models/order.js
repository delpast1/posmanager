var mongoose = require('../config/db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Order', new Schema({
	userID: String, // _id của user
    products: [{
		productID: String, // _id của product
		variationID: String, // _id của variation
		amount: String, 
		price: String, // Đơn giá tùy chọn
	}],
	totalPrice: String,
	customerInfo: {
		customerName: String,
		customerPhone: {
			type: String,
			default: 'NONE' //nếu nhận hàng tại shop
		},
		address: {
			type: String,
			default: 'NONE' //nếu nhận hàng tại shop
		}
	},
	deliveryMethod: {
		deliveryType: {
			type: String,
			enum: ['NONE', 'GIAOHANGNHANH', 'GRAB', 'SHIPPER'],
			default: 'NONE', //nếu nhận hàng tại shop
		},
		deliveryCost: {
			type: String,
			default: '0' //nếu nhận hàng tại shop
		},
		deliveryNumber: {
			type: String,
			default: 'NONE' //nếu nhận hàng tại shop
		}, // nếu dùng GIAOHANGNHANH hay GRAB thì tham chiếu đơn đặt xe, nếu dùng SHIPPER thì lưu sđt SHIPPER
	},
	paymentMethod: {
		type: String,
		enum: ['CASH', 'COD', 'BANK'],
		default: 'CASH' // Nếu nhận hàng tại shop
	}, // COD, Tiền mặt, Chuyển khoản
	status: {
		type: String,
		enum: ['PENDING','SHIPPING', 'COMPLETED', 'CANCELED'],
		default: 'PENDING' // Chờ xác nhận đơn hàng
	},
	notes: String // ghi chú
},{
    timestamps: true
}));

