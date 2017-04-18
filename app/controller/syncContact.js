/**
 * Created by NGOCHUNG on 2/14/2017.
 */
var Odoo = require('../../configs/databaseodoo');
var resp = require('../helpper/respones');


exports.getcontact = function (req, res) {
    var odoo = Odoo.gethostodoo();
    odoo.connect(function (err) {
        if (err) {
            console.log(err);
            resp.res_error(400, "not connect odoo", true, res);
        } else {
            console.log("connect to Odoo success" + new Date);
            var params = {
                fields: ['id', 'name', 'parent_id', 'email', 'phone', 'mobile', 'street'],
                domain: [['parent_id.id', '>', '0']],
                limit: 1000,
                offset: 0
            }
            odoo.search_read('res.partner', params, function (err, resultSet) {
                if (err) {
                    console.log("res partner err ", err);
                    resp.res_error(400, 'system err', true, res);
                } else {
                    console.log("res partner ", JSON.stringify(resultSet));
                    resp.res_success(200, "success", false, resultSet, res);
                }
            });
        }
    });
}