/**
 * Created by NGOCHUNG on 5/11/2017.
 */
var async = require('async');
var mongoose = require('mongoose');
var Order_beer = require('../models/oder-beer');
var Order_Support = require('../models/order_support');
var Stylebeer_order = require('../models/stylebeer_order');
var emailHelper = require('../helpper/email');
var resp = require('../helpper/respones');
exports.AddOrderBeer = function (req, res) {

    if (!req.body.name || !req.body.mobile || !req.body.email || !req.body.object_type || !req.body.number_client || !req.body.address_client || !req.body.date_client || !req.body.beer || !req.body.support) {
        resp.res_error(401, "one or more parameters is missing", true, res);
    } else {
        var note;
        if(req.body.noteOrder){
            note=req.body.noteOrder
        }else {
            note="";
        }
        var newOrder = new Order_beer({
            client_name: req.body.name,
            client_mobile: req.body.mobile,
            clinet_email: req.body.email,
            object_type_use: req.body.object_type,
            client_number_use: req.body.number_client,
            address_delivery: req.body.address_client,
            date_delivery: req.body.date_client,
            beer_order: req.body.beer,
            order_sup: req.body.support,
            note_order: note

        });
        async.waterfall([function (done) {
            newOrder.save(function (err) {
                if (err) {
                    done(err);
                    console.log("save err " + err);
                } else {
                    done(null)
                }
            });
        }, function (done) {
            emailHelper.sendEmail("doanngochung55pmxd@gmail.com", "Đơn đặt hàng iBiero", "bạn dã dăt hàng ibiero thành công với các thông so nhu sau", done);
            emailHelper.sendEmail(newOrder.clinet_email, "Đặt hàng iBiero", "bạn dã dăt hàng ibiero thành công với các thông so nhu sau", done);
            done(null)
        }], function (err) {
            if (err) {
                res.json({
                    code: 400,
                    err: true,
                    message: "system err"
                });
                console.log("save err " + err);
            } else {
                res.json({
                    code: 200,
                    err: false,
                    message: "success"
                });
            }
        });
    }
};