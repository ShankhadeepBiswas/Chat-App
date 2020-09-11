require('dotenv').config()
const path = require('path') // core module
const express = require('express')
const app=express();
const Filter = require('bad-words')
const http = require('http') //core module
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)                         //binding socketio server with raw http server
const {generateMsg,generateLoc} = require('../public/js/message')
const {addUser,removeUser,getUser,getUsersInRoom} = require('../src/utils/users')

const port = process.env.PORT 

app.use(express.static(path.join(__dirname,'../public')))

io.on('connection',(socket)=>{             //socket contains info about connected client
    console.log("Web Socket Connection on!");
    const filter = new Filter()
    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id : socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('Welcome',generateMsg('Welcome!'))            // sending to client side
        socket.broadcast.to(user.room).emit('Welcome',generateMsg( `${user.username} has joined the chat!`))
        callback()
    })

    socket.on('Message',(msg,callback)=>{
        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!');
        }
        io.emit('Welcome',generateMsg(msg))        //io sends to all connected clients at once. socket sends to individual.
        callback()
    })
    socket.on('sendlocation',(obj,callback)=>{
        io.emit('location-url',generateLoc(`https://www.google.com/maps?q=${obj.lat},${obj.lon}`))
        callback()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        io.to(user.room).emit('Welcome',generateMsg(`${user.username} has left the chat`))
    })
})

server.listen(port,()=>{
    console.log("App listening to port",port);
})