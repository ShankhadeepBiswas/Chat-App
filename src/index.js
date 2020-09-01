require('dotenv').config()
const path = require('path') // core module
const express = require('express')
const app=express();
const http = require('http') //core module
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const port = process.env.PORT 

app.use(express.static(path.join(__dirname,'../public')))

io.on('connection',()=>{
    console.log("Web Socket Connection on!");
})

server.listen(port,()=>{
    console.log("App listening to port",port);
})