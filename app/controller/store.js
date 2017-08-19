/**
 * Created by hungdn on 8/19/2017.
 */
var async = require('async');
var fs = require('fs');
var Store = require('../models/store');
var respone = require('../helpper/respones');


exports.addstore=function (req,res) {
    if(!req.body.id_store||!req.body.name_store||!req.body.adress_store_lv0_number||!req.body.adress_store_lv1_xpd||
        !req.body.adress_store_lv2_qh||!req.body.adress_store_lv3_tp||!req.body.country_store||!req.body.phone_store||
        !req.body.maneger_tore|| !req.body.lat_store|| !req.body.lng_store){
        respone.res_error(400,"one or more parameters is missing",true,res);
    }else {
        var newstore = new Store({
            id_store: req.body.id_store,
            name_store: req.body.name_store,
            adress_store_lv0_number: req.body.adress_store_lv0_number,
            adress_store_lv1_xpd: req.body.adress_store_lv1_xpd,
            adress_store_lv2_qh: req.body.adress_store_lv2_qh,
            adress_store_lv3_tp: req.body.adress_store_lv3_tp,
            country_store: req.body.country_store,
            phone_store: req.body.phone_store,
            maneger_tore: req.body.maneger_tore,
            lat_store: req.body.lat_store,
            lng_store:req.body.lng_store
        });
        newstore.save(function (err) {
            if (err) {
                respone.res_error(400, 'save err', true, res);
            } else {
                respone.res_succes_no_result(200, 'success', false, res);
            }
        });
    }
}
exports.findStore=function (req,res) {
    var tmp2=[];
    if(req.body.street!=null && req.body.street!=undefined && req.body.street!=""){
        tmp2.push({adress_store_lv1_xpd:req.body.street});
    }
    if(req.body.distric!=null && req.body.distric!=undefined && req.body.distric!=""){
        tmp2.push({adress_store_lv2_qh:req.body.distric});
    }
    if(req.body.city!=null && req.body.city!=undefined && req.body.city!=""){
        tmp2.push({adress_store_lv3_tp:req.body.city});
    }
    if(req.body.country!=null && req.body.country!=undefined && req.body.country!=""){
        tmp2.push({country_store:req.body.country});
    }
    if(tmp2.length==0){
        tmp2.push({getall: null});
    }
    console.log("appp",JSON.stringify(tmp2));

    Store.find({$and:tmp2}).exec(function (err,list_store) {
        if(err){
            respone.res_error(400,"system err",true,res);
        }else if(!list_store){
            respone.res_succes_no_result(200,"không tìm thấy cửa hàng",false,res);
        }else {
            respone.res_success(200,"success",false,list_store,res);

        }

    })
};
