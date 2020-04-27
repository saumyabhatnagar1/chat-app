const socket=io()

const $messageForm=document.querySelector('#chatform')
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages')
const $location=document.querySelector('#location');

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-template').innerHTML;

socket.on('message',(mssg)=>{

    console.log(mssg)
    const html=Mustache.render(messageTemplate,{
        message:mssg
    });
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(mapsurl)=>{

    console.log(mapsurl)
    const html=Mustache.render(locationTemplate,{
        mapsurl
    });
    $location.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('click',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled')
    const message=(document.getElementById('message').value);
    
   
    
    socket.emit('mssg',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value='';
        $messageFormInput.focus();
        if(error)
        return console.log(error);
        console.log('Mesaage delivered')
    })
})
document.querySelector('#send-location').addEventListener('click',(e)=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    return alert('not working')

    navigator.geolocation.getCurrentPosition((position)=>{
        $locationButton.removeAttribute('disabled')
        socket.emit('sendLocation',position.coords.latitude,position.coords.longitude,(mssg)=>{
            console.log(mssg)
        })
    })
})
