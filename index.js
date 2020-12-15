/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up and down time of user defined link
* Author: Saif Akib
* Date: 2020-12-12
*/

//dependencies
const http = require('http');
const { handleReqRes } = require('./helper/handlerRequest');

//app object = module scaffolding
const app = {};

app.config = {
    PORT : 8000
};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.PORT, () => {
        console.log(`Server Running at this ${app.config.PORT} port`);
    });

}

app.handleReqRes = handleReqRes;

//start the server
app.createServer();
