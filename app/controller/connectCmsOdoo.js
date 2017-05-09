/**
 * Created by NGOCHUNG on 1/19/2017.
 */
var Odoo = require('../../configs/databaseodoo');
var Beer = require('../models/beers');
var History = require('../models/history-brewing');

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
                            domain: [['state', 'in', ['1', '2']], ['account_id.phone', 'in', ['0985688699','0918272810']], ['brew_date', '>', moment().subtract(31, "hours").format()]],
                            limit: 100,
                            fields: ['package_id', 'brew_date', 'completed_date', 'formula_id'],
                            offset: 0
                        };
                        odoo.search_read('vinnetcms.brew_package', params, function (err, packRS) {
                            if (err) {

                                console.log("Error: ", err);
                                done();
                            } else {
                                console.log(packRS);
                                async.each(packRS, function (pack, callback) {
                                    History.findOne({
                                        package_id: pack.package_id
                                    }, function (err, result) {
                                        if (err) return;
                                        if (!result) {
                                            var mongo_id = _find_formula_by_id(pack.formula_id[0]);
                                            if (mongo_id) {
                                                var history = new History({
                                                    idbeer: mongo_id,
                                                    time_boil: pack.brew_date + "+000",
                                                    status: 0,
                                                    package_id: pack.package_id
                                                });
                                                history.save(function (err) {
                                                    console.log('Save pacage error: ', err);
                                                });
                                            }
                                        }
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
