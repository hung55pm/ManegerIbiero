/**
 * Created by cskh on 5/23/2017.
 */
var async = require('async');
var Machine = require('../models/machine');
var respone=require('../helpper/respones');
exports.addmachine = function (req, res) {

    if(!req.body.ptuid || !req.body.group_id){
        respone.res_error(400,"one or more parameters is missing",true,res);
    }else {
    var machine= Machine({
        ptuid:req.body.ptuid,
        group_id:req.body.group_id
    });

    machine.save(function (err) {
        if(err){
            respone.res_error(401,"sys err",true,res);
        }else {
            respone.res_succes_no_result(200,"success",false,res);
        }
    })
    }
};