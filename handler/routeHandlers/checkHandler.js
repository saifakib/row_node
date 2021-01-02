
//dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helper/utilities')
const tokenHandler = require('./tokenHandler')
const { maxCheck } = require('../../helper/envirnments')

//scuffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const accetedMethods = ['get', 'post', 'put', 'delete'];
    if (accetedMethods.indexOf(requestProperties.method) > -1) {     //onlut accept this four methods
        handler._check[requestProperties.method](requestProperties, callback)
    } else {
        callback(405);
    }
}

//handler private property
handler._check = {}

handler._check.post = (requestProperties, callback) => {

    let protocol = typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ?
        requestProperties.body.method : false;

    let successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {

        const token = typeof requestProperties.headerObject.token === 'string'
            ? requestProperties.headerObject.token : false

        //lookup the user phone by token id
        if (token) {
            data.read('tokens', token, (err, tokenData) => {
                if (!err && tokenData) {
                    let userPhone = parseJSON(tokenData).phone;
                    //lookup the user data
                    data.read('users', userPhone, (err2, userData) => {
                        if (!err2 && userData) {
                            //varify token
                            tokenHandler._token.verify(token, userPhone, (tokeIsValid) => {
                                if (tokeIsValid) {
                                    let userObject = parseJSON(userData)
                                    let userChecks = typeof (userObject.checks) === 'object' &&
                                        userObject.checks instanceof Array ? userObject.checks : [];

                                    if (userChecks.length < maxCheck) {
                                        let checkId = createRandomString(15)
                                        let checkObject = {
                                            id: checkId,
                                            phone: userPhone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeoutSeconds
                                        }
                                        // save object
                                        data.create('checks', checkId, checkObject, (err3) => {
                                            if (!err3) {
                                                //add checkId to user object
                                                userObject.checks = userChecks
                                                userObject.checks.push(checkId)

                                                //update this user object
                                                data.update('users', userPhone, userObject, (err4) => {
                                                    if (!err4) {
                                                        callback(200, checkObject)

                                                    } else {
                                                        callback(403, { error: 'There a Server side problem' })

                                                    }
                                                })
                                            } else {
                                                callback(403, { error: 'There a Server side problem' })
                                            }
                                        })
                                    } else {
                                        callback(403, {
                                            error: 'User allready reached  check limit'
                                        })
                                    }
                                } else {
                                    callback(403, {
                                        error: 'Token Validation expired'
                                    })
                                }
                            })
                        } else {
                            callback(403, {
                                error: 'User Not Found'
                            })
                        }
                    })
                } else {
                    callback(403, {
                        error: 'You are not authorized'
                    })
                }
            })
        } else {
            callback(403, {
                error: 'You have a problem in your request'
            })
        }
    } else {
        callback(404, {
            error: 'You have a problem in your request'
        })
    }
};

handler._check.get = (requestProperties, callback) => {
    //get id from query string
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 15 ? requestProperties.queryStringObject.id : false

    if (id) {
        //lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                //varify tokens
                const token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false

                tokenHandler._token.verify(token, parseJSON(checkData).phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData))
                    } else {
                        callback(403, { error: 'Authentication Problem' })
                    }
                })
            } else {
                callback(403, {
                    error: 'Server Internal Error'
                })
            }
        })
    } else {
        callback(403, {
            error: 'You have a problem in your request'
        })
    }
};

handler._check.put = (requestProperties, callback) => {
    //verify check id
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 15 ?
        requestProperties.body.id : false
    //verifrify others terms
    let protocol = typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ?
        requestProperties.body.method : false;

    let successCodes = typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (error, checkData) => {
                if (!error && checkData) {
                    let checkObject = parseJSON(checkData)
                    //verify tokens
                    const token = typeof requestProperties.headerObject.token === 'string'
                        ? requestProperties.headerObject.token : false

                    tokenHandler._token.verify(token, checkObject.phone, (tokeIsValid) => {
                        if (tokeIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol
                            }
                            if (url) {
                                checkObject.url = url
                            }
                            if (method) {
                                checkObject.method = method
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes
                            }
                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds
                            }

                            //store the check object with update
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, checkObject)
                                } else {
                                    callback(500, { error: "Server side problem" })
                                }
                            })
                        } else {
                            callback(403, { error: "Authentication Problem" })
                        }
                    })
                } else {
                    callback(403, { error: "There is a problem Server Side" })
                }
            })
        } else {
            callback(403, { error: "You must put at least one terms for update" })
        }
    } else {
        callback(403, { error: "you have a problem in your request" })
    }
};

handler._check.delete = (requestProperties, callback) => {
    //get id from query string
    const id = typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 15 ? requestProperties.queryStringObject.id : false

    if (id) {
        //lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                //varify tokens
                const token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false

                tokenHandler._token.verify(token, parseJSON(checkData).phone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        //delete checkData
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                //remove from user data
                                data.read('users', parseJSON(checkData).phone, (err3, userData) => {
                                    if (!err3 && userData) {
                                        let userObject = parseJSON(userData)
                                        let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                        //remove check id from user checks list
                                        let targetCheckPosition = userChecks.indexOf(id)
                                        if(targetCheckPosition > -1) {
                                            userChecks.splice(targetCheckPosition, 1)
                                            userObject.checks = userChecks

                                            //resave data
                                            data.update('users', userObject.phone, userObject, (err5) => {
                                                if(!err5) {
                                                    callback(200,{ success : "check remove"})
                                                } else {
                                                    callback(500, { error: "There was an error"})
                                                }
                                            })
                                        } else {
                                            callback(500, {error : "The Check ID that you are trying to remove  is not found in user Checks list"})
                                        }
                                    } else {
                                        callback(500, { error: "server error" })
                                    }
                                })
                            } else {
                                callback(500, { error: "server error" })
                            }
                        })
                    } else {
                        callback(403, { error: 'Authentication Problem' })
                    }
                })
            } else {
                callback(403, {
                    error: 'Server Internal Error'
                })
            }
        })
    } else {
        callback(403, {
            error: 'You have a problem in your request'
        })
    }
};


//export handler
module.exports = handler;