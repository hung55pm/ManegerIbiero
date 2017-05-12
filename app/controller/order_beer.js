/**
 * Created by NGOCHUNG on 5/11/2017.
 */
var async = require('async');
var mongoose = require('mongoose');
var Order_beer = require('../models/oder-beer');
var Order_Support = require('../models/order_support');
var Stylebeer_order = require('../models/stylebeer_order');
var emailHelper = require('../helpper/email');
exports.AddOrderBeer = function (req, res) {

    // if (!req.body.name || !req.body.mobile || !req.body.email || !req.body.object_type || !req.body.number_client || !req.body.address_client || !req.body.date_client || !req.body.volume || !req.body.beer || !req.body.support || !req.body.noteOrder) {
    //
    // } else {
        var newOrder = new Order_beer({
            client_name: req.body.name,
            client_mobile: req.body.mobile,
            clinet_email: req.body.email,

        });
        async.waterfall([function (done) {
            newOrder.save(function (err) {
                if(err){
                   done(err);
                    console.log("save err "+err);
                }else {
                   done(null)
                }
            });
        },function (done) {
            emailHelper.sendEmail(newOrder.clinet_email, "Register account confirmation code", "Your confirmation code is:",done );
            done(null)
        }],function (err) {
            if(err){
                res.json({
                    code: 401,
                    err:true,
                    message: "fail"
                });
                console.log("save err "+err);
            }else {
                res.json({
                    code: 200,
                    err:false,
                    message: "success"
                });
            }
        });
       
   // }

};