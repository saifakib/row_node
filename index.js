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
const data = require('./lib/data')

//app object = module scaffolding
const app = {};

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


app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environments.PORT, () => {
        console.log(`Server Running at this ${environments.PORT} port in ${environments.ENV_NAME}`);
    });

}

app.handleReqRes = handleReqRes;

//start the server
app.createServer();
