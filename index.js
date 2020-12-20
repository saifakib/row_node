/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up and down time of user defined link
* Author: Saif Akib
* Date: 2020-12-12
*/

//dependencies
const http = require('http');
const { handleReqRes } = require('./helper/handlerRequest');
const environments = require('./helper/envirnments')

//app object = module scaffolding
const app = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environments.PORT, () => {
        console.log(`Server Running at this ${environments.PORT} port in ${environments.ENV_NAME}`);
    });

}

app.handleReqRes = handleReqRes;

//start the server
app.createServer();
