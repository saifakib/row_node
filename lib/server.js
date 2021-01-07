/*
* Title: Server Library
* Description: Server realated files
* Author: Saif Akib
* Date: 2021-01-04
*/

//dependencies
const http = require('http');
const { handleReqRes } = require('../helper/handlerRequest');
const environments = require('../helper/envirnments')

//server object = module scaffolding
const server = {};


server.createServer = () => {
    const createServer = http.createServer(server.handleReqRes);
    createServer.listen(environments.PORT, () => {
        console.log(`Server Running at this ${environments.PORT} port in ${environments.ENV_NAME}`);
    });

}

server.handleReqRes = handleReqRes;

//start the server
server.init = () => {
    server.createServer();
}

//export module
module.exports = server;