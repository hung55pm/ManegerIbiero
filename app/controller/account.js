/**
 * Created by NGOCHUNG on 12/29/2016.
 */
var async = require('async');
var fs = require('fs');
var Account = require('../models/account');
var UUID = require('node-uuid');
var mongoose = require('mongoose');
var respone=require('../helpper/respones');


exports.login = function (req, res) {
    console.log("aaaaaa"+JSON.stringify(req.body));
    if(!req.body.email || !req.body.password){
        respone.res_error(400,'one or more parameters is missing',true,res);
    }else {
    var employeeCode = req.body.email;
    var password = req.body.password;
    Account.findOne({
        $or: [{
            'employee_code': employeeCode.toUpperCase()
        }, {
            'employee_code': employeeCode
        }]
    }, function (err, acc) {
        if (err) {
            respone.res_error(400,'system error',true,res);
        }
        else if (!acc) {
            respone.res_error(400,'Account does not exist ',true,res);
        }
        else if (!acc.validPassword(req.body.password)) {
            respone.res_error(400,'The password is invalid',true,res);
        } else {
            var tmp=({
                pemission: acc.role,
                access_token: acc.access_token,
                group_id:acc.group_id
            });
            respone.res_success(200,'success',false,tmp,res);

        }
    });

    }
}
exports.register = function (req, res) {
    if (!req.body.email || !req.body.name || !req.body.address
        || !req.body.phone || !req.body.password) {
        respone.res_error(400,'one or more parameters is missing',true,res);
    } else {
        var newAccount = new Account({
            employee_code: req.body.phone.toLowerCase(),
            name: req.body.name,
            birthday: req.body.birthday,
            address: req.body.address,
            phone:req.body.phone,
            role:2,
            email: req.body.email
        });
        newAccount.password = newAccount.generateHash(req.body.password);
        newAccount.access_token = UUID.v4();
        async.waterfall([
            //check account exist
            function (done) {
                Account.findOne({
                    employee_code: req.body.phone.toLowerCase()
                }, function (err, acc) {
                    if (err) done(err);
                    else if (acc) done('user already exist');
                    else done(null);
                });
            },
            //save accounts
            function (done) {
                newAccount.save(function (err) {
                    if(err){
                        done('system err');
                    }else {
                        done(null) ;
                    }

                });
            },
        ], function (err) {
            if (err) {
                respone.res_error(400,err,true,res);
            } else {
                respone.res_succes_no_result(200,'success',false,res);
            }
        });
    }
}
exports.changepassword =function (req,res) {
    if(!req.body.phone || !req.body.newpassword || !req.body.oldpassword ){
        respone.res_error(400,'one or more parameters is missing',true,res);
    }else {
        var newAccount = new Account();
        Account.findOne({
            employee_code: req.body.phone
        }, function (err, acc) {
            if (err) {
                respone.res_error(400,'system error',true,res);
            } else if (!acc.validPassword(req.body.oldpassword)) {
                respone.res_error(400,'the old password is wrong',true,res);
            } else {
                acc.password = acc.generateHash(req.body.newpassword);
                acc.save(function (err) {
                    if (err) {
                        respone.res_error(400,'save system error ',true,res);
                    } else {
                        respone.res_succes_no_result(200,'success',false,res);
                    }
                });
            }
        });
    }
}
function getAccessToken(req) {
    return req.get('Authorization').substring(13);
}
exports.logout = function (req,res) {
        var accessToken = getAccessToken(req);
    console.log("aaaaa"+accessToken);
        Account.findOneAndUpdate({
            access_token: accessToken
        }, {
            access_token: UUID.v4()
        }, function (err, acc) {
            if (err || !acc) {
                respone.res_error(400,"logout fail",true,res);
            }
            respone.res_succes_no_result(200,'success',false,res);
        });


}