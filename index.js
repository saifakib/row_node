/*
* Title: Uptime Monitoring Application | Project Initial Files
* Description: A RESTful API to monitor up and down time of user defined link | Initial File to start server and workers
* Author: Saif Akib
* Date: 2021-01-04
*/

//dependencies
const server = require('./lib/server')
const worker = require('./lib/worker')

//app object = module scaffolding
const app = {};

app.init = () => {
    //start server
    server.init();

    //start worker
    worker.init();
}

app.init();

module.exports = app;
