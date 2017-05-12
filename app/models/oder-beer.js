/**
 * Created by NGOCHUNG on 5/11/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var OderBeerSchema = mongoose.Schema({
    _id: {
        type: ObjectIdSchema,
        default: function () {
            return new ObjectId()
        }
    },
    client_name:String,
    client_mobile:String,
    clinet_email:String,
    object_type_use: String,
    client_number_use: {
        type: Number,
        default: 0
    },
    address_delivery:String,
    date_delivery:{
        type: Date,
        default:null
    },
    beer_order: [{id_beer_order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stylebeer-order'
    },style_beer_name:String, volume_order: Number}],
    order_sup:[{id_sup:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order-support'
    },name:String}],
    note_order:String


});
module.exports = mongoose.model('oder-beer', OderBeerSchema);