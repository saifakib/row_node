/*
* Title: Routes
* Description: Application Routes
* Author: Saif Akib
* Date: 2020-12-12
*/

//dependencies
const { samplehandler } = require('./handler/routeHandlers/sampleHandler');


const routes = {
    sample : samplehandler   // ex: 127.0.0.1:8080/sample
}

module.exports = routes;