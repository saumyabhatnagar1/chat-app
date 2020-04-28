const express=require('express');
const path=require('path')
const http=require('http');
const socketio=require('socket.io');
const Filter=require('bad-words')
const {generateMessage} =require('./utils/messages')
const {generateLocationMessage}=require('./utils/Locationmssg')

const app=express();
const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000;
app.use(express.static(publicDirectoryPath))
let count=0;
io.on('connection',(socket)=>{    
    console.log('new web socket io connection')
    socket.emit('message',generateMessage('Welcome!'))
    socket.broadcast.emit('message',generateMessage('A new user has joined'))

    socket.on('mssg',(message,callback)=>{

        const filter=new Filter()
        if(filter.isProfane(message))
        //return callback('Profanity is not allowed')
        message=filter.clean(message)
        io.emit('message',generateMessage(message))
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has disconnected'))
    })
    socket.on('sendLocation',(latitude,longitude,callback)=>{

        callback('Location Shared');
        io.emit('locationMessage',generateLocationMessage(`https://maps.google.com?q=${latitude},${longitude}`))
    })
})

server.listen(port,()=>{
    console.log(`server is running at ${port}`)
})