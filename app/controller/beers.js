/**
 * Created by NGOCHUNG on 12/27/2016.
 */
var async = require('async');
var fs = require('fs');
var Beer = require('../models/beers');
var UUID = require('node-uuid');
var respone=require('../helpper/respones');
exports.getAllBeer = function (req, res) {
    getBeer(req, res);
}
function getBeer(req, res) {
    Beer.find().exec(function (err, accs) {
        console.log("" + err + "+++++" + accs);
        if (err ) {
            respone.res_error(400,'system err',true,res);
        }else if(!accs){
            respone.res_error(400,'not found',true,res);
        } else {
            var result = [];
            for (var i = 0; i < accs.length; i++) {
                var tmp = {
                    _id: accs[i]._id,
                    name: accs[i].name,
                };
                result.push(tmp);
            }
            respone.res_success(200,'success',false,result,res);
        }
    });
}

