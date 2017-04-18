/**
 * Created by tungxuan on 3/18/16.
 */

var async = require('async');
var Account = require('../models/account');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manager-ibiero');


// Creat admin account + add States, Provinces data
module.exports = function () {

    Account.findOne({
        employee_code: 'ADMIN'
    }, function (err, acc) {
        if (!err && !acc) {
            var admin = new Account({
                employee_code: 'ADMIN',
            });
            admin.password = admin.generateHash('admin');
            admin.save();

        }
    });

}


