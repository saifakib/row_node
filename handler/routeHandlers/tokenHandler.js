
//dependencies
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helper/utilities')


//scuffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const accetedMethods = ['get', 'post', 'put', 'delete'];
    if (accetedMethods.indexOf(requestProperties.method) > -1) {     //onlut accept this four methods
        handler._token[requestProperties.method](requestProperties, callback)
    } else {
        callback(405);
    }
}

//handler private property
handler._token = {}

handler._token.post = (requestProperties, callback) => {

    const phone = typeof (requestProperties.body.phone) === 'string' &&
        requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' &&
        requestProperties.body.password.trim().length > 0 ?
        requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashPass = hash(password)
                if (hashPass === parseJSON(userData).password) {
                    const tokenId = createRandomString(30);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObj = {
                        phone,
                        id: tokenId,
                        expires
                    }

                    //store the token
                    data.create('tokens', tokenId, tokenObj, (err2) => {
                        if (!err2) {
                            callback(200, tokenObj)
                        }
                        else {
                            callback(500, {
                                error: 'There was an error in the server side'
                            })
                        }
                    })
                }
                else {
                    callback(400, {
                        error: 'Invalid Password, Pls Provide your valid password '
                    })
                }
            } else {
                callback(400, {
                    error: 'Invalid Phone Number'
                })
            }
        })
    } else {
        callback(400, { error: 'You have a problem in your request' })
    }
};

handler._token.get = (requestProperties, callback) => {
    //check token id that its valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 30 ?
        requestProperties.queryStringObject.id : false;

    if (id) {
        data.read('tokens', id, (err, usrToken) => {
            const userToken = { ...parseJSON(usrToken) }
            if (!err && userToken) {
                callback(200, userToken)
            } else {
                callback(404, {
                    error: 'Token not found, Provide valud token!',
                });
            }
        })
    } else {
        callback(404, {
            error: 'Provide a valid token!',
        });
    }
};

handler._token.put = (requestProperties, callback) => {

    const id = typeof (requestProperties.body.id) === 'string' &&
        requestProperties.body.id.trim().length === 30 ?
        requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true ? true : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObj = parseJSON(tokenData);
            if (tokenObj.expires > Date.now()) {
                tokenObj.expires = Date.now() + 60 * 60 * 1000;

                //store updated token expires time
                data.update('tokens', id, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200)
                    } else {
                        console.log(err2)
                        callback(404, {
                            error: 'Server side problem'
                        })
                    }
                })
            } else {
                callback(404, { error: 'Token Allready Expired !!' })
            }

        })
    } else {
        callback(404, { error: 'Problem in your request' })
    }

};
handler._token.delete = (requestProperties, callback) => {
    //check token id that its check from client server
    const id = typeof (requestProperties.queryStringObject.id) === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 30 ?
        requestProperties.queryStringObject.id : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, { success: 'Token Delete successfully' })
                    } else {
                        callback(504, { error: 'Server Error' })
                    }
                })
            } else {
                callback(404, { error: 'request error' })
            }
        })
    } else {
        callback(500, { error: 'request error' })
    }
};

//token verify
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else{
            callback(false)
        }
    })
}


//export handler
module.exports = handler;