require('dotenv').config()
const path = require('path') // core module
const express = require('express')
const app=express();
const Filter = require('bad-words')
const http = require('http') //core module
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const port = process.env.PORT 

app.use(express.static(path.join(__dirname,'../public')))
io.on('connection',(socket)=>{             //socket contains info about connected client
    console.log("Web Socket Connection on!");
    const filter = new Filter()
    socket.emit('Welcome','Welcome!')            // sending to client side
    socket.broadcast.emit('Welcome','A new user has joined!')
    socket.on('Message',(msg,callback)=>{
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!');
        }
        io.emit('Welcome',msg)        //io sends to all connected clients at once. socket sends to individual.
        callback()
    })
    socket.on('sendlocation',(obj,callback)=>{
        io.emit('location-url',`https://www.google.com/maps?q=${obj.lat},${obj.lon}`)
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('Welcome','The user has left!')
    })
})

server.listen(port,()=>{
    console.log("App listening to port",port);
})