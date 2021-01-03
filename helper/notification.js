
/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author: Saif Uddin
 * Date: 03/01/2021
 *
 */

// dependencies
const https = require('https');
const { twilio } = require('./envirnments')
const queryString = require('querystring');

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
            } else{
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

//export module
module.exports = notifications;