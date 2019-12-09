var mongoose = require('../config/db');
const genders = require('../config/config').partnerGender;
const groups = require('../config/config').partnerGroup;
const classify = require('../config/config').partnerClassify;
var Schema = mongoose.Schema;

module.exports = mongoose.model('Partner', new Schema({
	userID: String, // _id cuả user 
    info: {
		fullname: String,
		phone: String,
		address: String,
	},
	additionalInfo: {
		email: {
			type: String,
			default: ''
		},
		birthdate: {
			type: String,
			default: ''
		},
		cmnd: {
			type: String,
			default: ''
		},
		gender: {
			type: String,
			enum: ['MALE', 'FEMALE', 'OTHER'],
			default: 'OTHER'
		},

	},
	classify: {
		type: String,
		enum: ['CUSTOMER', 'SUPPLIER', 'SHIPPER']
	}
}));