var express = require('express');
var router = express.Router();
var beer = require('../app/controller/beers');
var historybrewing = require('../app/controller/history-brewing');
var restaurent=require('../app/controller/restaurent');
var Acount= require('../app/controller/account');
var mAccount = require('../app/models/account');
var Report= require('../app/controller/report');
var SyncContact=require('../app/controller/syncContact');
var resp=require('../app/helpper/respones');
var async = require('async');
var fs = require("fs");
/* GET users listing. */
router.get('/', function (req, res, next) {
     res.send('');
});
function getAccessToken(req) {
    return req.get('Authorization').substring(13);
}
function isValidToken(req, res, next) {
    var accessToken = getAccessToken(req);
    mAccount.findOne({
        access_token: accessToken
    }, function (err, acc) {
        if (err || !acc) {
           resp.res_error(400,'invalid access token',true,res);
        } else {
            console.log(acc);
            req.user = acc;
            return next();
        }
    });
}

// api acount
router.post('/login',Acount.login);
router.post('/register', Acount.register);
router.post('/logout',isValidToken, Acount.logout);
router.post('/change-password',isValidToken, Acount.changepassword);

// api beer
router.get('/get-list-beer',isValidToken, beer.getAllBeer);

// api restaurent

router.get('/get-all-restaurent',isValidToken,restaurent.getAllRestaurent);
router.post('/change-status',isValidToken,restaurent.changeIdRestaurent);

// api histroy brewing
router.post('/add-history-beer',isValidToken, historybrewing.AddHisrotyBrewing);
router.post('/update-status-historybeer', isValidToken,historybrewing.updateStatusHistoryBrewing);
router.post('/get-all-beer-bydate',isValidToken,historybrewing.getAllBeerByDate);
router.post('/get-all-beer-byid',isValidToken,historybrewing.getAllBeerbyId);
router.post('/get-all-beer-stock',isValidToken,historybrewing.getAllBeerbystatusstock);
router.post('/find-history-brewing',isValidToken,historybrewing.getallfind);

// api report kiddy
router.post('/report', isValidToken,Report.getreportkiddy);

//api synccontact
router.get('/sync-contact',isValidToken,SyncContact.getcontact);


module.exports = router;
