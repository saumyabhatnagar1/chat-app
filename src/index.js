const express=require('express');
const path=require('path')
const http=require('http');
const socketio=require('socket.io');
const Filter=require('bad-words')
const {generateMessage} =require('./utils/messages')
const {generateLocationMessage}=require('./utils/Locationmssg')
const {addUser,removeUser,getUser,getUserRoom}=require('./utils/users')

const app=express();
const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000;
app.use(express.static(publicDirectoryPath))
let count=0;
io.on('connection',(socket)=>{  
    
    socket.on('joinRoom',({username,room},callback)=>{

        const {error,user}=  addUser({id:socket.id,username,room})
        if(error){
           return callback(error)
        }
        socket.join(user.room)
        console.log('new web socket io connection')
        socket.emit('message',generateMessage(user.username,'Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username,`${user.username}, has joined`))

        callback();
    })



    socket.on('mssg',(message,callback)=>{
        const user=getUser(socket.id)

        const filter=new Filter()
        if(filter.isProfane(message))
        //return callback('Profanity is not allowed')
        message=filter.clean(message)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })
    socket.on('disconnect',()=>{
        
        const user=removeUser(socket.id)
        if(user)
        io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has disconnected`))
    })
    socket.on('sendLocation',(latitude,longitude,callback)=>{

        const user=getUser(socket.id)
        callback('Location Shared');
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://maps.google.com?q=${latitude},${longitude}`))
    })
})



server.listen(port,()=>{
    console.log(`server is running at ${port}`)
})