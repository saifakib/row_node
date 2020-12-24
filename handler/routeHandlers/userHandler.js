
//dependencies
const data = require('../../lib/data');
const { hash } = require('../../helper/utilities')
const { parseJSON } = require('../../helper/utilities')


//scuffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const accetedMethods = ['get', 'post', 'put', 'delete'];
    if (accetedMethods.indexOf(requestProperties.method) > -1) {     //onlut accept this four methods
        handler._user[requestProperties.method](requestProperties, callback)
    } else {
        callback(405);
    }
}

//handler private property
handler._user = {}

handler._user.post = (requestProperties, callback) => {

    const firstname = typeof requestProperties.body.firstname === 'string' &&
        requestProperties.body.firstname.trim().length > 0 ?
        requestProperties.body.firstname : false;

    const lastname = typeof (requestProperties.body.lastname) === 'string' &&
        requestProperties.body.lastname.trim().length > 0 ?
        requestProperties.body.lastname : false;

    const phone = typeof (requestProperties.body.phone) === 'string' &&
        requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' &&
        requestProperties.body.password.trim().length > 0 ?
        requestProperties.body.password : false;

    const tosAggrement = typeof (requestProperties.body.tosAggrement) === 'boolean' ?
        requestProperties.body.tosAggrement : false;


    if (firstname && lastname && phone && password && tosAggrement) {
        //Check that this phone number is allready exits
        data.read('users', phone, (err1, filedata) => {
            if (err1) {
                const userObject = {
                    firstname,
                    lastname,
                    phone,
                    password: hash(password),
                    tosAggrement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request'
        })
    }
};
handler._user.get = (requestProperties, callback) => {
    //check phone number that its valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11 ?
        requestProperties.queryStringObject.phone : false;

    if (phone) {
        data.read('users', phone, (err, usr) => {
            const user = { ...parseJSON(usr) }
            if (!err && user) {
                delete user.password;
                callback(200, user)
            } else {
                callback(404, {
                    error: 'Requested user was not found!',
                });
            }
        })
    } else {
        callback(404, {
            error: 'Requested user was not found!',
        });
    }
};
handler._user.put = (requestProperties, callback) => {

    const firstname = typeof requestProperties.body.firstname === 'string' &&
        requestProperties.body.firstname.trim().length > 0 ?
        requestProperties.body.firstname : false;

    const lastname = typeof (requestProperties.body.lastname) === 'string' &&
        requestProperties.body.lastname.trim().length > 0 ?
        requestProperties.body.lastname : false;

    const phone = typeof (requestProperties.body.phone) === 'string' &&
        requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' &&
        requestProperties.body.password.trim().length > 0 ?
        requestProperties.body.password : false;

    if (phone) {
        if (firstname || lastname || password) {
            data.read('users', phone, (err, usrData) => {
                const userData = { ...parseJSON(usrData) }

                if (!err && userData) {
                    if (firstname) {
                        userData.firstname = firstname
                    }
                    if (lastname) {
                        userData.lastname = lastname
                    }
                    if (password) {
                        userData.password = hash(password)
                    }
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, { success: 'User updated successfully' })
                        } else {
                            callback(404, { error: 'There is a problem in server side' })
                        }
                    })
                } else {
                    callback(404, {
                        error: 'You have a problemin your request'
                    })
                }
            })
        } else {
            callback(404, { error: 'You have a problem in your request' })
        }
    } else {
        callback(404, { error: 'Invalid Phone number, please try again' })
    }
};
handler._user.delete = (requestProperties, callback) => {
    //check phone number that its valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11 ?
        requestProperties.queryStringObject.phone : false;
    if(phone) {
        data.read('users', phone, (err,user) => {
            if(!err && user) {
                data.delete('users', phone, (err2) => {
                    if(!err2) {
                        callback(200, { success: 'User Delete successfully'})
                    } else {
                        callback(504, { error : 'Server Error'})
                    }
                })
            } else {
                callback(404, { error : 'Your request error'})
            }
        })
    } else {
        callback(404, { error : 'Your request error'})
    }
};


//export handler
module.exports = handler;