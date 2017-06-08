/**
 * Created by NGOCHUNG on 1/4/2017.
 */
var async = require('async');
var fs = require('fs');
var Restaurent = require('../models/restaurent');
var History = require('../models/history-brewing');
var UUID = require('node-uuid');
var respone = require('../helpper/respones');
var async = require('async');
exports.getAllRestaurent = function (req, res) {
    if(!req.body.group_id){
        respone.res_error(400, 'one or more parameters is missing', true, res);
    }else{
    var tmp1=[], tmp2=[];
    tmp2.push({group_id: 0});
    tmp2.push({group_id: req.body.group_id});
    tmp1.push({$or: tmp2});

    Restaurent.find({$and:tmp1}).sort({'id_res': 1}).exec(function (err, accs) {
        console.log("" + err + "+++++" + accs);
        if (err) {
            respone.res_error(400, 'system err', true, res);
        } else if (!accs) {
            respone.res_error(400, 'not found', true, res);
        } else {
            var result = [];
            for (var i = 0; i < accs.length; i++) {
                var tmp = {
                    id_res: accs[i].id_res,
                    name_res: accs[i].name_res,
                    address_res: accs[i].address_res,
                    phone_res: accs[i].phone_res,
                    maneger_res: accs[i].maneger_res

                };
                result.push(tmp);
            }
            respone.res_success(200, 'success', false, result, res);
        }
    });

    }
}

exports.changeIdRestaurent = function (req, res) {
    if (!req.body.idres_old || !req.body.idres_new) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        async.parallel([
                function (done) {
                    Restaurent.findOne({id_res: req.body.idres_old}, function (err, result) {

                        if (err) {

                            done(err)
                        } else if (!result) {
                            done("id res does not exist'")
                        } else {
                            result.id_res=req.body.idres_new;
                            result.save(function (err) {
                                if(err){
                                    done(err)
                                }else {
                                    done(null);
                                }

                            })
                        }
                    })
                },
                function (done) {
                    History.find({status: req.body.idres_old},function (err,result) {
                        if (err) {
                            done(err)
                        } else if (!result) {
                            done('status does not exist')
                        } else {
                            for(var i in result){
                                result[i].status=req.body.idres_new;
                                result[i].save()

                            }
                            done(null);
                        }

                    })
                }],
            function (err) {
                if(err){
                    respone.res_error(400, err, true, res);
                }else {
                    respone.res_succes_no_result(200,"success",false,res);
                }
            })
    }

}
