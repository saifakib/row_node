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
    twilio: {                           //save info in twilio.txt file
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
    mailInfo: {
        mail : '',
        password : '',
    }
}

environments.production = {
    PORT: 8000,
    ENV_NAME: 'production',
    secretKey : 'productionSecret',
    maxCheck : 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
    mailInfo: {
        mail : '',
        password : '',
    }
}

let currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'development'

let environmentToExport =
    typeof(environments[currentEnvironment]) === 'object'
        ? environments[currentEnvironment]
        : environments.development

module.exports = environmentToExport;