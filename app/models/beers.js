/**
 * Created by NGOCHUNG on 12/27/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var beer = Schema({
    _id: {
        type: ObjectIdSchema, default: function () {
            return new ObjectId()
        }
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    formula_id: String
});
module.exports = mongoose.model('beer', beer);