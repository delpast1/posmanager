const mongoose = require('../config/db');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    info: {
        email: String,
        firstname: String,
        lastname: String,
        phone: String,
        company: String,
        address: String,
    },
    status: { 
        type: String, 
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED']
    }
}, {
    timestamps: true
}));