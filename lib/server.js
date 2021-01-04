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
//const data = require('./lib/data')

//server object = module scaffolding
const server = {};

//testing file system
//write data
// data.create('test','firstfile', {'country':'Bangkok','lan':'english'}, (err)=>{
//     console.log(`error is `, err)
// })
//read data
// data.read('test','firstfile', (err, data) => {
//     console.log(err, data)
// })
//Update data
// data.update('test','firstfile', {'country':'India','lan':'Hindi'}, (err)=>{
//     console.log(`error is `, err)
// })
//deleting file
// data.delete('test','firstfile', (err) => {
//     console.log(err)
// })

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