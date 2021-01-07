
/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Saif Uddin
 * Date: 03/01/2021
 *
 */

// dependencies
const https = require('https');
const queryString = require('querystring');
const nodemailer = require('nodemailer');
const { twilio, mailInfo } = require('./envirnments')
const { mailVerify } = require('./utilities')


//module scaffolding 
const notifications = {}

//send sms to user using twilio API
notifications.sendTwilioSMS = (phone, msg, callback) => {
    //input validation
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false
    const msgBody = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if (userPhone && msgBody) {
        // cofigure the payload request
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: msgBody
        }

        // stringify the payload
        const stringifyPayload = queryString.stringify(payload)

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            console.log('Status Code: ' + res.statusCode)
            console.log('headers', res.headers)
            const status = res.statusCode;
            if (status === 200 || status === 201) {
                callback(false)
            } else {
                callback(`Status code returned was ${status}`)
            }
        })

        req.on('error', (err) => {
            callback(err)
        })
        req.write(stringifyPayload)
        req.end()

    } else {
        callback('Given parameters were missing or invalid')
    }
}

//sending mail to user using Node mailer
notifications.sendNodemailer = (mail, msg, callback) => {

    //input validation
    const userMail = typeof mail === 'string' && mailVerify(mail) === true ? maile : false
    const msgBody = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    //create reusable transporter object
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailInfo.mail, 
            pass: mailInfo.password,
        },
    });

    //mail deatils
    const mailOptions = {
        from: mailInfo.mail, // sender address
        to: userMail, // list of receivers
        subject: "Hello ✔", // Subject line
        text: msgBody, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(`Mail can not be send ${error}`)
        }
        callback(false)
    });
}

//export module
module.exports = notifications;