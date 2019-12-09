const mongoose = require('../config/db');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Unit', new Schema({
    userID: String,
    name: String,
	symbol: String
}));

