/*
* Title: Routes
* Description: Application Routes
* Author: Saif Akib
* Date: 2020-12-12
*/

//dependencies
const { samplehandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');
const { tokenHandler } = require('./handler/routeHandlers/tokenHandler');
const { checkHandler } = require('./handler/routeHandlers/checkHandler');



const routes = {
    sample : samplehandler,   // ex: 127.0.0.1:8080/sample
    user : userHandler   ,   // /user
    token : tokenHandler,
    check : checkHandler
}

module.exports = routes;