/**
 * Created by NGOCHUNG on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var OrderSupportSchema = mongoose.Schema({
    _id: {
        type: ObjectIdSchema,
        default: function () {
            return new ObjectId()
        }
    },
    name: String,
    id_number:Number

});
module.exports = mongoose.model('order-support', OrderSupportSchema);