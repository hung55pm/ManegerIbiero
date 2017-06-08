/**
 * Created by cskh on 5/23/2017.
 */
var async = require('async');
var Groups = require('../models/group');
var respone = require('../helpper/respones');
exports.addgroup = function (req, res) {
    if (!req.body.id_group || !req.body.name_group || !req.body.device_id) {
        respone.res_error(400,"one or more parameters is missing",true,res);
    } else {
        var groups = Groups({
            id_group: req.body.id_group,
            name_group: req.body.name_group,
            device_id: req.body.device_id
        });

        groups.save(function (err) {
            if (err) {
                respone.res_error(401, "sys err", true, res);
            } else {
                respone.res_succes_no_result(200, "success", false, res);
            }
        })

    }
};
