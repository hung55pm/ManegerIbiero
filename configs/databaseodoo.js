/**
 * Created by NGOCHUNG on 2/15/2017.
 */

var Odoo = require('odoo');
exports.gethostodoo=function () {
    var odoo = new Odoo({
        host: '10.20.1.194',
        port: 8069,
        database: 'vinnet',
        username: 'test',
        password: 'vinnet@123'
    });

    return odoo
}
