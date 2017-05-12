/**
 * Created by tungxuan on 5/14/16.
 */

var nodemailer = require('nodemailer');
var emailConfig = require('../../configs/email');

var transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false,
    ignoreTLS: true,
    requireTLS: false,
    auth: {user: emailConfig.email, pass: emailConfig.password}
});

exports.sendEmail = function(receivers, subject, content, callback) {
    var to = '';
    var mailOptions = {
        from: emailConfig.email,
        to: receivers,
        subject: subject,
        text: content
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info) {
        console.log('send email completed', error, info);
        if (error) {
            console.log(error);
            return callback(error, null);
        }
        callback(null, info);
    });
};
