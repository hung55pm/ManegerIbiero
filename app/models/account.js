/**
 * Created by tungxuan on 3/17/16.
 */

var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    employee_code: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    name: String,
    birthday: Date,
    role: Number,
    address: String,
    phone: String,
    access_token: String,

});

accountSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

accountSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Account', accountSchema);