


const handler = {};

handler.notfoundhandler = (requestProperties, cb) =>{
    console.log(requestProperties);
    cb(404, {
        message : "Your request not found",
    })
}

module.exports = handler;