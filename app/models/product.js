var mongoose = require('../config/db');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Product', new Schema({
	userID: String,
    info: {
        SKU: String,
		name: String,
		barcode: String,
		description: String,
		retailPrice: String,
		costPrice: String, //Tạo sản phẩm sẽ phải nhập giá vốn để định giá ban đầu
		unitOfMeasure: String,
		category: {
			type: String,
			default: 'none'
		}, // dùng distinc để tạo danh sách nhóm sản phẩm
		brand: {
			type: String,
			default: 'none'
		}, // dùng distinc để tạo danh sách nhóm sản phẩm
    },
	variations: [{
		size: {
			type: String,
			default: 'none'
		}, //NONE: nếu không có size
		color: {
			type: String,
			default: 'none'
		}, // NONE: nếu chỉ có 1 màu
		numberOfUnits: {
			type: String,
			default: 0
		}
	}],
    status: {
		type: String,
		enum: ['ACTIVE', 'INACTIVE'],
		default: 'ACTIVE'
	},
	images: [{
		url: {
			type: String,
			default: '#'
		}
	}]
}));