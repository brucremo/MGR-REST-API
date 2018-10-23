var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});

async function sendMail(to, text) {

    var mailOptions = {
        from: 'youremail@gmail.com',
        to: to,
        subject: 'Password Reset Request',
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {

            console.log(error);
        } else {

            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendMail = sendMail;
