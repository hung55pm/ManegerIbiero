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
    res.setHeader('Access-Control-Allow-Origin', '*');
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

            //if(req.body.action=="vi"){
                var dbsupport=req.body.support;
                var oder_sup="";
                for (var i=0;i<dbsupport.length;i++){
                    if(dbsupport[i].id_number==1){
                        oder_sup= oder_sup+"Giao hàng, ";
                    }else if(dbsupport[i].id_number==2){
                        oder_sup= oder_sup+"Đến lấy hàng, ";
                    }else if(dbsupport[i].id_number==3){
                        oder_sup= oder_sup+"Nhân viên hỗ trợ, ";
                    }else if(dbsupport[i].id_number==4){
                        oder_sup= oder_sup+"Cốc plastic, ";
                    }
                }
                var dbbeer=req.body.beer;
                var string_beer_order="";
                for (var i=0;i<dbbeer.length;i++){
                    if(dbbeer[i].id_number==1){
                        string_beer_order= string_beer_order+"American Style IPA đặt "+dbbeer[i].volume+" keg 15 lít, ";
                    }else if(dbbeer[i].id_number==2){
                        string_beer_order=string_beer_order+"Sweet Autumn đặt "+dbbeer[i].volume+" keg 15 lít";
                    }else if(dbbeer[i].id_number==3){
                        string_beer_order=string_beer_order+"Hop Drop ‘n Roll đặt "+dbbeer[i].volume+" keg 15 lít";
                    }else if(dbbeer[i].id_number==4){
                        string_beer_order=string_beer_order+"Brown Chocolate đặt "+dbbeer[i].volume+" keg 15 lít";
                    }else if(dbbeer[i].id_number==5){
                        string_beer_order=string_beer_order+"Pink Summer đặt "+dbbeer[i].volume+" keg 15 lít";
                    }else if(dbbeer[i].id_number==6){
                        string_beer_order=string_beer_order+"Tropical Breath đặt "+dbbeer[i].volume+" keg 15 lít";
                    }else if(dbbeer[i].id_number==7){
                        string_beer_order=string_beer_order+"Dawn of The Red đặt "+dbbeer[i].volume+" keg 15 lít";
                    }
                }

                emailHelper.sendEmail("doanngochung55pmxd@gmail.com", "Đơn đặt hàng iBiero", "Tên khách hàng: "+req.body.name+", Số điện thoại: "+req.body.mobile
                    +", Email: "+req.body.email+", Các loại bia đã đặt:"+string_beer_order+". Ngày giao bia: "+req.body.date_client+". Địa điểm giao hàng: "+req.body.address_client+
                    ", Dịch vụ hỗ trợ:"+oder_sup+", Yêu cầu khác:"+note, done);
                emailHelper.sendEmail(newOrder.clinet_email, "Đơn đăt hàng của quý khách với iBiero", " Kinh chào :"+req.body.name+
                    ". Quý khách đã đặt hàng thành thành công với đơn hàng như sau: " +
                    " Các loại bia đã đặt:"+string_beer_order+". Ngày giao bia: "+req.body.date_client+". Địa điểm giao hàng: "+req.body.address_client+
                    ", Dịch vụ hỗ trợ:"+oder_sup, done);
            // }else {
            //
            // }

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