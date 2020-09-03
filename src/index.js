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
io.on('connection',(socket)=>{             //socket contains info about connected client
    console.log("Web Socket Connection on!");
    socket.emit('Welcome','Welcome!')            // sending to client side
    socket.broadcast.emit('Welcome','A new user has joined!')
    socket.on('Message',(msg)=>{
        io.emit('Welcome',msg)        //io sends to all connected clients at once. socket sends to individual.
    })
    socket.on('location',(obj)=>{
        io.emit('Welcome',`Location: Latitude:${obj.lat} and Longitude:${obj.lon}`)
    })
    socket.on('disconnect',()=>{
        io.emit('Welcome','The user has left!')
    })
})

server.listen(port,()=>{
    console.log("App listening to port",port);
})