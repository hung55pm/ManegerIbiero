/**
 * Created by NGOCHUNG on 12/27/2016.
 */
var async = require('async');
var fs = require('fs');
var History = require('../models/history-brewing');
var UUID = require('node-uuid');
var mongoose = require('mongoose');
var Beer = require('../models/beers');
var respone = require('../helpper/respones');
var dateConvert = require('../helpper/dateConvert');
exports.AddHisrotyBrewing = function (req, res) {
    console.log(req.body);

    if (!req.body.idbeer || !req.body.time_boil || !req.body.status) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        var time_boil = new Date(req.body.time_boil);
        var newHistoryBeer = new History({
            idbeer: req.body.idbeer,
            time_boil: time_boil,
            status: req.body.status,
            sell_time: null,
            return_date: null

        });
        newHistoryBeer.save(function (err) {
            if (err) {
                respone.res_error(400, 'save err', true, res);
            } else {
                respone.res_succes_no_result(200, 'success', false, res);
            }
        });
    }
}

exports.updateStatusHistoryBrewing = function (req, res) {
    console.log("" + req.body.time_boil);
    if (!req.body.idbeer || !req.body.time_boil || !req.body.status || !req.body.id || !req.body.sell_time) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        async.waterfall([
                function (done) {
                    History.findOne({
                        _id: req.body.id
                    }, function (err, acc) {
                        done(err, acc);
                    });
                },
                function (acc, done) {
                    acc.status = req.body.status;
                    acc.idbeer = req.body.idbeer;
                    acc.time_boil = req.body.time_boil;
                    acc.sell_time = req.body.sell_time;
                    if (req.body.volume) {
                        acc.volume = req.body.volume;
                    }
                    if (req.body.return_date) {
                        acc.return_date = req.body.return_date;
                    }
                    if (req.body.volume_return) {
                        acc.volume_return = req.body.volume_return;
                    }
                    done(null, acc);
                },
                function (acc, done) {
                    acc.save(function (err) {
                        if (err) {
                            done(err)
                        } else {
                            done(null);
                        }
                    });
                }
            ],
            function (err) {
                if (err) {
                    respone.res_error(400, err, true, res);
                } else {
                    respone.res_succes_no_result(200, 'success', false, res);
                }
            });

    }
}
exports.getAllBeerByDate = function (req, res) {
    var start = new Date(req.body.start);
    var end = new Date(req.body.end);
    var listbeertotal = [];
    var historyList = [];
    var tmp1 = [];

    if (!req.body.start || !req.body.end) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        if (req.body.group_id || req.body.group_id == undefined) {
            if (req.body.group_id == 0) {
                tmp1.push({getall: null});

            } else {
                tmp1.push({group_id: req.body.group_id});
            }

        }
        compar = {$gte: start, $lte: end};
        tmp1.push({time_boil: compar});
        async.parallel([function (callback) {
                Beer.find().exec(function (err, beer) {
                    if (err) {
                        return callback(err);
                    } else {
                        for (var i = 0; i < beer.length; i++) {
                            listbeertotal.push({
                                idbeer: beer[i]._id,
                                name: beer[i].name,
                                inventory: 0,
                                sold: 0
                            });
                        }
                        return callback(null);
                    }
                });


            }, function (callback) {
                console.log(start + "  " + end + "  " + JSON.stringify(tmp1));
                //     {
                //     time_boil: {
                //         $gte: start,
                //         $lte: end
                //     }
                // }
                History.find({$and: tmp1}).exec(function (err, historybeer) {
                    if (err || !historybeer) {
                        historyList = [];
                        return callback(null);
                    } else {
                        historyList = historybeer;
                        return callback(null);
                    }
                });
            }
            ],
            function (err) {
                if (err) {
                    respone.res_error(400, 'system err', true, res);
                } else {
                    for (var i = 0; i < historyList.length; i++) {
                        for (var j = 0; j < listbeertotal.length; j++) {
                            if (historyList[i].idbeer.equals(listbeertotal[j].idbeer)) {
                                if (historyList[i].status >= 1) {
                                    listbeertotal[j].sold = listbeertotal[j].sold + 1;
                                } else {
                                    listbeertotal[j].inventory = listbeertotal[j].inventory + 1;
                                }
                            }
                        }
                    }
                    respone.res_success(200, 'success', false, listbeertotal, res);
                }

            });
    }

}

exports.getAllBeerbyId = function (req, res) {
    var start = new Date(req.body.start);
    var end = new Date(req.body.end);
    var tmp1 = [];
    var historyList = [];
    if (!req.body.id || !req.body.start || !req.body.end) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        if (req.body.group_id || req.body.group_id == undefined) {
            if (req.body.group_id == 0) {
                tmp1.push({getall: null});

            } else {
                tmp1.push({group_id: req.body.group_id});
            }

        }
        compar = {$gte: start, $lte: end};
        tmp1.push({time_boil: compar});
        tmp1.push({idbeer: req.body.id});
        //     {
        //     idbeer: req.body.id,
        //     time_boil: {
        //         $gte: start,
        //         $lte: end
        //     }
        // }
        History.find({$and: tmp1}).sort({"time_boil": -1}).exec(function (err, historybeer) {
            if (err) {
                respone.res_error(400, 'system err', true, res);

            } else {
                for (var i = 0; i < historybeer.length; i++) {
                    historyList.push({
                        id: historybeer[i]._id,
                        idbeer: historybeer[i].idbeer,
                        time_boil: historybeer[i].time_boil,
                        create_date: historybeer[i].create_date,
                        sell_time: historybeer[i].sell_time,
                        status: historybeer[i].status,
                        volume: historybeer[i].volume,
                        return_date: historybeer[i].return_date,
                        volume_return: historybeer[i].volume_return,
                        group_id: historybeer[i].group_id
                    });
                }

                console.log("list : " + JSON.stringify(historyList));
                respone.res_success(200, 'success', false, historyList, res);
            }
        });

    }

}


exports.getAllBeerbystatusstock = function (req, res) {
    if (!req.body.idbeer || !req.body.datefind) {
        respone.res_error(400, 'one or more parameters is missing', true, res);
    } else {
        var datefind = new Date(req.body.datefind);
        var idbeer = req.body.idbeer;
        var historyList = [];

        if (idbeer == "0") {
            History.find({
                time_boil: {
                    $lte: datefind
                },
                status: 0
            }).sort({"time_boil": -1}).exec(function (err, historybeer) {
                if (err) {
                    respone.res_error(400, 'system err', true, res);

                } else {
                    for (var i = 0; i < historybeer.length; i++) {
                        historyList.push({
                            id: historybeer[i]._id,
                            idbeer: historybeer[i].idbeer,
                            time_boil: historybeer[i].time_boil,
                            create_date: historybeer[i].create_date,
                            sell_time: historybeer[i].sell_time,
                            status: historybeer[i].status,
                            volume: historybeer[i].volume,
                            return_date: historybeer[i].return_date,
                            volume_return: historybeer[i].volume_return,
                            group_id: historybeer[i].group_id
                        });
                    }

                    console.log("list : " + JSON.stringify(historyList));
                    respone.res_success(200, 'success', false, historyList, res);

                }
            });
        } else {
            History.find({
                idbeer: idbeer,
                time_boil: {
                    $lte: datefind
                },
                status: 0
            }).sort({"time_boil": -1}).exec(function (err, historybeer) {
                if (err) {
                    respone.res_error(400, 'system err', true, res);

                } else {
                    for (var i = 0; i < historybeer.length; i++) {
                        historyList.push({
                            id: historybeer[i]._id,
                            idbeer: historybeer[i].idbeer,
                            time_boil: historybeer[i].time_boil,
                            create_date: historybeer[i].create_date,
                            sell_time: historybeer[i].sell_time,
                            status: historybeer[i].status,
                            volume: historybeer[i].volume,
                            return_date: historybeer[i].return_date,
                            volume_return: historybeer[i].volume_return,
                            group_id: historybeer[i].group_id
                        });
                    }

                    console.log("list : " + JSON.stringify(historyList));
                    respone.res_success(200, 'success', false, historyList, res);
                }
            });
        }


    }

}

exports.getallfind = function (req, res) {
    var historyList = [];
    var tmp1 = [];
    var tmp2 = [];
    var tmp3 = [];
    if (req.body.group_id || req.body.group_id == undefined) {
        if (req.body.group_id == 0) {
            tmp3.push({group_id: 1});
            tmp3.push({group_id: 2});
            tmp1.push({$or: tmp3});
        } else {
            tmp1.push({group_id: req.body.group_id});
        }

    }
    if (req.body.idbeer != undefined) {
        tmp1.push({idbeer: req.body.idbeer});
    }
    if (req.body.status != undefined && req.body.status != 999 && req.body.status != 1000) {
        tmp1.push({status: req.body.status});
    }
    if (req.body.status == 999) {
        tmp2.push({status: 0});
        tmp2.push({status: 20});
        tmp1.push({$or: tmp2});
    }
    if (req.body.status == 1000) {
        tmp2.push({status: 10});
        tmp2.push({status: 30});
        tmp2.push({status: 40});
        tmp2.push({status: 101});
        tmp2.push({status: 102});
        tmp2.push({status: 103});
        tmp2.push({status: 104});
        tmp2.push({status: 105});
        tmp2.push({status: 50});
        tmp2.push({status: 106});
        tmp1.push({$or: tmp2});
    }
    if (req.body.start == undefined && req.body.end == undefined && req.body.start_sold == undefined && req.body.end_sold == undefined) {
        if (tmp1.length == 0) {
            tmp1.push({getall: null});
        }
    } else if (req.body.start_sold != undefined && req.body.end_sold != undefined) {
        var end_sold = new Date(req.body.end_sold);
        var start_sold = new Date(req.body.start_sold);
        compar = {$gte: start_sold, $lte: end_sold};
        tmp1.push({sell_time: compar});
        console.log("2");
    } else {
        if (req.body.start != undefined && req.body.end == undefined) {
            var startdate = new Date(req.body.start);
            compar = {$gt: startdate};
            tmp1.push({time_boil: compar});
            console.log("3");
        } else if (req.body.start == undefined && req.body.end != undefined) {
            var enddate = new Date(req.body.end);
            compar = {$lte: enddate};
            tmp1.push({time_boil: compar});
            console.log("4");
        } else {
            var enddate = new Date(req.body.end);
            var startdate = new Date(req.body.start);
            compar = {$gte: startdate, $lte: enddate};
            tmp1.push({sell_time: compar});
            console.log("5");
        }
    }
    History.find({$and: tmp1}).sort({time_boil: -1}).exec(function (err, historybeer) {
        if (err) {
            console.log(err);
            respone.res_error(400, 'system err1', true, res);

        } else {
            for (var i = 0; i < historybeer.length; i++) {
                historyList.push({
                    id: historybeer[i]._id,
                    idbeer: historybeer[i].idbeer,
                    time_boil: historybeer[i].time_boil,
                    create_date: historybeer[i].create_date,
                    sell_time: historybeer[i].sell_time,
                    status: historybeer[i].status,
                    volume: historybeer[i].volume,
                    return_date: historybeer[i].return_date,
                    volume_return: historybeer[i].volume_return,
                    group_id: historybeer[i].group_id
                });
            }

            console.log("list : " + JSON.stringify(historyList));
            respone.res_success(200, 'success', false, historyList, res);
        }
    });
};

exports.updatelocal = function (req, res) {
    History.find({group_id: undefined}).exec(function (err, arraybeer) {
        if (err) {
            respone.res_error(401, "sys err", true, res);

        } else if (!arraybeer) {
            respone.res_success(300, "list = null", false, res);

        } else {
            for (var i = 0; i < arraybeer.length; i++) {
                arraybeer[i].group_id = 1;
                arraybeer[i].save();

            }

            respone.res_succes_no_result(200, "success", false, res);
        }

    });

};