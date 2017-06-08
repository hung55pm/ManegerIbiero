/**
 * Created by cskh on 5/23/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var machine= Schema({
    _id: {
        type: ObjectIdSchema, default: function () {
            return new ObjectId()
        }
    },
    ptuid:String,
    group_id: Number
});
module.exports = mongoose.model('machine', machine);