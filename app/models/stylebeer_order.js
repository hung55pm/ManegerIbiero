/**
 * Created by NGOCHUNG on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var StyleBeerOrderSchema = mongoose.Schema({
    _id: {
        type: ObjectIdSchema,
        default: function () {
            return new ObjectId()
        }
    },
    idbeer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'beer'
    },
    beer_name: String,
    id_number : Number

});
module.exports = mongoose.model('stylebeer-order', StyleBeerOrderSchema);