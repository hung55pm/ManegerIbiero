/**
 * Created by hungdn on 8/19/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var store = Schema({
    _id: {
        type: ObjectIdSchema, default: function () {
            return new ObjectId()
        }
    },
    id_store: String,
    name_store: {
        type: String,
        unique: true,
        required: true
    },
    adress_store_lv0_number:String,
    adress_store_lv1_xpd : String,
    adress_store_lv2_qh : String,
    adress_store_lv3_tp : String,
    country_store : String,
    phone_store:String,
    maneger_tore:String,
    lat_store: Number,
    lng_store:Number,
});
module.exports = mongoose.model('store', store);