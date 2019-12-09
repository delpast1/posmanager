const mongoose = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

var adminSchema =  new Schema({
    username: String,
    password: String,
    email: String
});

adminSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Admin', adminSchema);