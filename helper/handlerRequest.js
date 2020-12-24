/*
* Title: Handle Request Response
* Description: Handle Request Response
* Author: Saif Akib
* Date: 2020-12-12
*/

//dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notfoundhandler } = require('../handler/routeHandlers/notFoundHandler');
const { parseJSON } = require('../helper/utilities')

//module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    const parseUrl = url.parse(req.url, true);  // true for consider query string and false for ingnore query string
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headerObject = req.headers;

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject
    }

    const decoder = new StringDecoder('utf-8');
    let realdata = '';

    const chooseHandler = routes[trimmedPath] ? routes[trimmedPath] : notfoundhandler;

    //data event listener 
    req.on('data', (buffer) => {
        realdata += decoder.write(buffer);
    })

    //end of data event listener
    req.on('end', () => {
        realdata += decoder.end();
        
        requestProperties.body = parseJSON(realdata);
        
        chooseHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);

            //return the final response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        //res.end('Hello')
    })

    // console.log(parseUrl); 
    // console.log(path);
    
}
module.exports = handler;