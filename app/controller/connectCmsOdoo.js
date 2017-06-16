/**
 * Created by NGOCHUNG on 1/19/2017.
 */
var Odoo = require('../../configs/databaseodoo');
var Beer = require('../models/beers');
var History = require('../models/history-brewing');
var Machine = require('../models/machine');

var async = require('async');
var moment = require('moment');

exports.checklistbeer = function (done) {
    var odoo = Odoo.gethostodoo();
    var FormulaArr = [];
// Connect to Odoo
    odoo.connect(function (err) {
        if (err) {
            console.log(err);
            done();
            return;
        } else {
            console.log("connect to Odoo success" + new Date);
        }

        var params = {
            fields: ['formula_id', 'name'],
            domain: [],
            limit: 100,
            offset: 0
        }

        odoo.search_read('vinnetcms.brew_formula', params, function (err, resultSet) {
            if (err) {
                console.log(err);
                done();
                return;
            } else {
                console.log(resultSet);
                function _contains(formula_id, mongo_array) {
                    for (var i in mongo_array) {
                        if (mongo_array[i].formula_id == formula_id)
                            return mongo_array[i]._id;
                    }
                    return false;
                }

                function _find_formula_by_id(id) {
                    for (var i in FormulaArr) {
                        if (FormulaArr[i].id == id) {
                            return FormulaArr[i].mongo_id;
                        }
                    }
                }

                function _find_ptuid(arr, ptuid) {
                    for (var i in arr) {
                        if (arr[i].ptuid == ptuid) {
                            return arr[i].group_id;
                        }
                    }
                }

                Beer.find().exec(function (err, result) {
                    if (err) {// update beer khi result = null
                        console.log(err);
                        done();
                    } else {
                        if (!result) {
                            for (var i = 0; i < resultSet.length; i++) {
                                var beer = new Beer({
                                    name: resultSet[i].name,
                                    formula_id: resultSet[i].formula_id
                                });
                                beer.save(function (err) {
                                    console.log(err);
                                });
                                if (beer._id)
                                    FormulaArr.push({
                                        id: resultSet[i].id,
                                        formula_id: resultSet[i].formula_id,
                                        mongo_id: beer._id
                                    });
                            }
                        } else {
                            console.log(result);
                            for (var i = 0; i < resultSet.length; i++) {
                                mongo_id = _contains(resultSet[i].formula_id, result);
                                if (!mongo_id) {
                                    var beer = new Beer({
                                        name: resultSet[i].name,
                                        formula_id: resultSet[i].formula_id
                                    });
                                    beer.save(function (err) {
                                        console.log(err);
                                    });
                                    if (beer._id)
                                        FormulaArr.push({
                                            id: resultSet[i].id,
                                            formula_id: resultSet[i].formula_id,
                                            mongo_id: beer._id
                                        });
                                } else {
                                    FormulaArr.push({
                                        id: resultSet[i].id,
                                        formula_id: resultSet[i].formula_id,
                                        mongo_id: mongo_id
                                    });
                                }
                            }
                        }
                        var params = {
                            //Odoo only accept GMT date/time. So we must subtract 7hours from current time,
                            //and subtract 1 days for searching yesterday records
                            domain: [['state', 'in', ['1', '2']], ['account_id.phone', 'in', ['0985688699', '0918272810']],'|', ['brew_date', '>', moment().subtract(24, "hours").format()],['completed_date', '>', moment().subtract(24, "hours").format()]],
                            limit: 100,
                            fields: ['package_id', 'brew_date', 'completed_date', 'formula_id', 'ptuid', 'account_id'],
                            offset: 0
                        };
                        odoo.search_read('vinnetcms.brew_package', params, function (err, packRS) {
                            if (err) {

                                console.log("Error: ", err);
                                done();
                            } else {
                                //console.log(packRS);
                                // var arr=[];
                                // for (var k=0;k<packRS.length;k++){
                                //     if(packRS[k].ptuid=="cb400270"){
                                //         arr.push(packRS[k].package_id)
                                //     }
                                //
                                // }
                                // console.log("arr"+arr.length);
                                // async.each(arr,function (item) {
                                //     History.findOne({package_id:item},function (err, result) {
                                //         if(err || !result){
                                //             return
                                //         }else {
                                //             result.group_id=2;
                                //             result.save();
                                //         }
                                //     })
                                // });


                                async.each(packRS, function (pack, callback) {
                                    async.waterfall([function (dones) {
                                        Machine.find().exec(function (err, arrmachine) {
                                            dones(err, arrmachine);
                                        })
                                    }, function (arrmachine, dones) {
                                        History.findOne({
                                            package_id: pack.package_id
                                        }, function (err, result) {
                                            if (err) dones(err);
                                            if (!result) {
                                                var mongo_id = _find_formula_by_id(pack.formula_id[0]);
                                                if (mongo_id) {
                                                    var ptuid = _find_ptuid(arrmachine, pack.ptuid);
                                                    var ngay_nau;
                                                    var group_beer;
                                                    console.log("brew"+pack.brew_date+"---"+pack.completed_date);
                                                    if(pack.brew_date){
                                                        ngay_nau=pack.brew_date;
                                                    }else {
                                                        ngay_nau=pack.completed_date;
                                                    }

                                                    if (ptuid) {

                                                        group_beer=ptuid;
                                                    } else {
                                                        group_beer=1;
                                                    }
                                                    var history = new History({
                                                        idbeer: mongo_id,
                                                        time_boil: ngay_nau + "+000",
                                                        status: 0,
                                                        package_id: pack.package_id,
                                                        group_id: group_beer
                                                    });
                                                    history.save(function (err) {
                                                        console.log('Save pacage error: ', err);
                                                    });
                                                }

                                                dones(null)
                                            }
                                        });
                                    }], function (err) {
                                        done();
                                    });

                                });

                                done();
                            }
                        });
                    }
                });
            }
        });
    });
}
