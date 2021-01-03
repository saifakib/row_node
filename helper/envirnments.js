/*
* Title:  Envirnment variables
* Description: Handle Envirnment variables
* Author: Saif Akib
* Date: 2020-12-21
*/

//declare a scuffolding
const environments = {}

environments.development = {
    PORT: 4000,
    ENV_NAME: 'development',
    secretKey : 'developmentSecret',
    maxCheck : 5,
    twilio: {
        fromPhone: '+15017122661',
        accountSid: 'AC52e232a6c4715ce630cda1d6931dbd4b',
        authToken: '201015c2b74f4f70de863facac8c7ae3',
    }
}

environments.production = {
    PORT: 8000,
    ENV_NAME: 'production',
    secretKey : 'productionSecret',
    maxCheck : 5,
    twilio: {
        fromPhone: '+15017122661',
        accountSid: 'AC52e232a6c4715ce630cda1d6931dbd4b',
        authToken: '201015c2b74f4f70de863facac8c7ae3',
    }
}

let currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'development'

let environmentToExport =
    typeof(environments[currentEnvironment]) === 'object'
        ? environments[currentEnvironment]
        : environments.development

module.exports = environmentToExport;