/**
 * Created by NGOCHUNG on 1/4/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var restaurent = Schema({
    _id: {
        type: ObjectIdSchema, default: function () {
            return new ObjectId()
        }
    },
    id_res: Number,
    name_res: {
        type: String,
        unique: true,
        required: true
    },
    address_res : String,
    phone_res:String,
    maneger_res:String
});
module.exports = mongoose.model('restaurent', restaurent);