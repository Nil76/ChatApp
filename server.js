//import express module
const express = require('express')
//import path
const path = require('path')
//create rest object
const app = express()
//create port
const PORT = process.env.PORT || 8080
//start server
const server = app.listen(PORT, () => console.log(`server listening port ${PORT}`))
//use public directory static path for index.html
app.use(express.static(path.join(__dirname, 'public')))
////////////////////////
//import socket io and pass server to it
const io = require('socket.io')(server)
//use set to maintain unique 
let socketsConected = new Set()
//listen connection event
io.on('connection', onConnected)

function onConnected(socket) {
    //handle connections
    console.log('Socket connected', socket.id)
    socketsConected.add(socket.id)
    io.emit('clients-total', socketsConected.size)

    //handle disconnections
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id)
        socketsConected.delete(socket.id)
        io.emit('clients-total', socketsConected.size)
    })

    //broadcast messages
    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    //typing status (feedback)
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}
