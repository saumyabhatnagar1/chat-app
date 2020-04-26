const socket=io()
socket.on('message',(mssg)=>{
    console.log(mssg)
})

document.querySelector('#subbtn').addEventListener('click',(e)=>{
    e.preventDefault();
    const message=(document.getElementById('message').value);
   
    
    socket.emit('mssg',message,(message)=>{
        console.log('message was delivered!',message)
    })
})
document.querySelector('#send-location').addEventListener('click',(e)=>{
    if(!navigator.geolocation)
    return alert('not working')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',position.coords.latitude,position.coords.longitude,)
    })
})
