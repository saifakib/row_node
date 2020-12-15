
//module scaffolding
const handler = {};

handler.samplehandler = (requestProperties, cb) =>{
    console.log(requestProperties);
    cb(200, {
        message : "this is sample url",
    })
}

module.exports = handler;