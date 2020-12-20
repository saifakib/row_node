/*
* Title: file read and write 
* Description: file read and write here
* Author: Saif Akib
* Date: 2020-12-21
*/

//dependencies

const fs = require('fs');
const path = require('path');

//mudule scaffoling
const lib = {}

//base directory of this data folder
lib.basadir = path.join(__dirname, '../.data/');

//write data to file
lib.create = (dir, file, data, callback) => {
    //open file for writing
    fs.open(lib.basadir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {          //wx is a mode
        if(!err && fileDescriptor ) {
            //convert data to stringify
            const stringData = JSON.stringify(data)

            //write data to file and then clode it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false)
                        } else{
                            callback('Error Closing to New File')
                        }
                    })
                } else {
                    callback("Error writing to new file !")
                }
            })
        } else {
            callback('Could not create new file, its allready exits')
        }
    })
}

lib.read = (dir, file, callback) => {
    fs.readFile(lib.basadir+dir+'/'+file+'.json','utf-8',(err, data) => {
        callback(err, data)
    })
}

lib.update = (dir, file, data, callback) => {
    //open file for reading and writing
    fs.open(lib.basadir+dir+'/'+file+'.json','r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //convert update data to string
            const strngData = JSON.stringify(data)

            //truncate the file
            fs.truncate(fileDescriptor, (err2) => {
                if(!err2) {
                    //write file and close it
                    fs.writeFile(fileDescriptor, strngData, (err3) => {
                        if(!err3) {
                            //closing the file
                            fs.close(fileDescriptor, (err4) => {
                                if(!err4) {
                                    callback(false);
                                } else {
                                    callback('Error Closing the file');
                                }
                            })
                        } else {
                            callback('Error Writing to file')
                        }
                    })
                } else {
                    callback('Error truncating file')
                }
            })
        } else {
            callback('Could not open this file its may not be exits')
        }
    })
}

lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basadir+dir+'/'+file+'.json', (err) => {
        if(!err) {
            callback(false)
        } else {
            callback('Error deleting')
        }
    })
}

module.exports = lib;