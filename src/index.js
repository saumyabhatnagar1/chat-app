const express=require('express');
const path=require('path')
const http=require('http');
const socketio=require('socket.io');


const app=express();
const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000;
app.use(express.static(publicDirectoryPath))
let count=0;
io.on('connection',(socket)=>{    
    console.log('new web socket io connection')
    socket.emit('message','Welcome!')
    socket.broadcast.emit('message','A new user has joined')

    socket.on('mssg',(message,callback)=>{
        
        io.emit('message',message)
        callback('Delivered')
    })
    socket.on('disconnect',()=>{
        io.emit('message','A user has disconnected')
    })
    socket.on('sendLocation',(latitude,longitude)=>{
        io.emit('message',`https://maps.google.com?q=${latitude},${longitude}`)
    })
})

server.listen(port,()=>{
    console.log(`server is running at ${port}`)
})