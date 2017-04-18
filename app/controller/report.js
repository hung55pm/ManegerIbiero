/**
 * Created by NGOCHUNG on 2/8/2017.
 */
var Odoo = require('../../configs/databaseodoo');
var respone = require('../helpper/respones');


exports.getreportkiddy = function (req, res) {

    if (!req.body.start || !req.body.end || !req.body.type || !req.body.cat_id) {
        respone.res_error(400, "one or more parameters is missing", true, res);
    } else {
        var startdate = req.body.start;
        var enddate = req.body.end;
        var typerp = req.body.type;
        var cat_id=req.body.cat_id;
        var odoo = Odoo.gethostodoo();

// Connect to Odoo
        odoo.connect(function (err) {
            if (err) {
                done();
                return console.log(err);
            } else {
                console.log("connect to Odoo success report");
            }
            var args = [
                [],
                {
                    tz: odoo.context.tz,
                    uid: odoo.context.uid,
                },
            ];//args

            var params = {
                model: 'vinnetcms.report',
                method: 'salein_saleout_report_by_category',
                args: args,
                kwargs: {from: startdate, to: enddate, type: typerp, cat_id: cat_id},
            };//params

// View Delivery Order
            odoo.rpc_call('/web/dataset/call_kw', params, function (err, result) {
                if (err) {
                    respone.res_error(400, 'system err', true, res);
                    console.log(err);
                    return;
                }//if

                var delivery_order = result;
                respone.res_success(200,"success",false,result,res);
                console.log(delivery_order);
            });//odoo.rpc_call
        });

    }
}