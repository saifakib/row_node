/*
* Title: Worker Library
* Description: Worker realated files
* Author: Saif Akib
* Date: 2021-01-04
*/

//dependencies
const url = require('url')
const http = require('http')
const https = require('https')
const data = require('./data')
const { parseJSON } = require('../helper/utilities')
const { sendTwilioSMS, sendNodemailer } = require('../helper/notification')

//worker object = module scaffolding
const worker = {};

//alert user fot state change
worker.alertUserToStateChange = (newCheckData) => {

    const msg = `Alert: You check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`

    //sending sms
    sendTwilioSMS(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a state change via SMS ${msg}`)
        } else {
            console.log('There was a problem sending sms to one of the user!!')
        }
    })

    // sending email
    sendNodemailer(newCheckData.userEmail, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a state change via MAIL ${msg}`)
        } else {
            console.log('There was a problem sending mail to one of the user!!')
        }
    })


}

//Check out come
worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
    //check if check outcome is up or down

    let state = !checkOutCome.error && checkOutCome.responseCode &&
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';

    //decide whether we should alert user or not
    let alertWanted = originalCheckData.lastCheck && originalCheckData.state != state ? true : false;

    //update the check data
    const newCheckData = originalCheckData

    newCheckData.state = state;
    newCheckData.lastCheck = Date.now();

    //update data to save
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                //alert user to send the check data
                worker.alertUserToStateChange(newCheckData)
            } else {
                console.log('Alert in not needed there is no state change')
            }
        } else {
            console.log('trying save check data of one of the check')
        }
    })
}

//perform Check
worker.performCheck = (originalCheckData) => {

    //prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false
    }

    // mark to check outcome has not sent yet
    let outComeSent = false


    //parse the hostname and full url from the original data
    const parseUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true)  // true for consider querystring
    const hostname = parseUrl.hostname;
    const path = parseUrl.path    // path => url with querystring and pathname => url without querystring

    //construct the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname: hostname,
        method: originalCheckData.method.toUpperCase(),
        path: path,
        tomeout: originalCheckData.timeoutSeconds * 1000
    }

    let protocolToUse = originalCheckData.protocol === 'http' ? http : https

    const req = protocolToUse.request(requestDetails, (res) => {
        let status = res.statusCode

        //update the check outcome pass to the next step
        if (!outComeSent) {
            checkOutCome.responseCode = status;
            worker.processCheckOutCome(originalCheckData, checkOutCome)
            outComeSent = true
        }
    })

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e
        }
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome)
            outComeSent = true
        }
    })

    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: 'timeout'
        }
        if (!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome)
            outComeSent = true
        }
    })

    //req end
    req.end()
}


//validate individual check data
worker.validateCheck = (originalCheckData) => {

    if (originalCheckData && originalCheckData.id) {

        originalCheckData.state = typeof (originalCheckData.state) === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down'

        originalCheckData.lastCheck = typeof (originalCheckData.lastCheck) === 'number' &&
            originalCheckData.lastCheck > 0 ? originalCheckData.lastCheck : false

        //pass the next process
        worker.performCheck(originalCheckData)

    } else {
        console.log('Error: Check was invalid or not proper formatted!!')
    }

}

//lookup all the checks
worker.gatherAllChecks = () => {

    //get all checks
    data.list('checks', (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            checks.forEach(check => {
                //read the check
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        //pass the data to check Validator
                        worker.validateCheck(parseJSON(originalCheckData))
                    } else {
                        console.log('Error: Reading one of the check data !')
                    }
                })
            })
        } else {
            console.log('Error: Could not find any check to process')
        }
    })

}


//timer to execute the worker process once per minute
worker.loop = () => {

    setInterval(() => {
        worker.gatherAllChecks()
    }, 1000 * 60)

}


worker.init = () => {
    //check all the check
    worker.gatherAllChecks();

    //call loop for certain time check
    worker.loop();
}

worker.init();

module.exports = worker;
