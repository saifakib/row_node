/*
* Title:  Utilities
* Description: Utilities
* Author: Saif Akib
* Date: 2020-12-21
*/

//dependencies
const crypto = require('crypto');
const environments = require('./envirnments')

//declare a scuffolding
const utilities = {}

//parse json string to object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString)
        //converted json to object like this example
        // {
        //     firstname: 'saif',
        //     lastname: 'akib',
        //     phone: '01842317359',
        //     tosAggrement: true
        // }
    } catch {
        output = {};
    }

    return output;
}

//hash
utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(string)
            .digest('hex')
        return hash;
    } else {
        return false;
    }
}

module.exports = utilities;