/**
 * Created by cskh on 5/23/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var group = Schema({
    _id: {
        type: ObjectIdSchema, default: function () {
            return new ObjectId()
        }
    },
    id_group:Number,
    name_group:String,
    device_id: String
});
module.exports = mongoose.model('group', group);