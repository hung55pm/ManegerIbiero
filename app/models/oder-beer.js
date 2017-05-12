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
    client_number_use: Number,
    address_delivery:String,
    date_delivery:{
        type: Date,
        default:null
    },
    create_date:{
        type: Date,
        default:Date.now
    },
    beer_order: [],
    order_sup:[],
    note_order:String


});
module.exports = mongoose.model('oder-beer', OderBeerSchema);