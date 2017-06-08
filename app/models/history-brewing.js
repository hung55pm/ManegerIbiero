/**
 * Created by NGOCHUNG on 12/27/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var HistorySchema = mongoose.Schema({
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
    time_boil: {
        type: Date,
    },
    status: {
        type: Number,
        default: 0
    },
    sell_time:{
        type: Date,
        default:null
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    return_date:{
        type: Date,
        default:null
    },
    package_id: String,
    volume: {
        type: Number,
        default: 0
    },
    volume_return: {
        type: Number,
        default: 0
    },
    group_id:Number
});
module.exports = mongoose.model('history-brewing', HistorySchema);