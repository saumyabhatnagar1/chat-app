const socket=io()

const $messageForm=document.querySelector('#chatform')
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages')
// const $submit=document.querySelector('#sbnbtn')
//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-template').innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


const autoscroll=()=>{
    const $newMessage=$messages.lastElementChild
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    const visibleHeight=$messages.offsetHeight;
    const containerHeight=$messages.scrollHeight;
    const scrollOffset=$messages.scrollTop+visibleHeight;

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight

    }

}
socket.on('message',(mssg)=>{

    console.log(mssg)
    const html=Mustache.render(messageTemplate,{
        username:mssg.username,
        message:mssg.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})



socket.on('locationMessage',(mapsurl)=>{

    console.log(mapsurl)
    const html=Mustache.render(locationTemplate,{
        username:mapsurl.username,
        mapsurl:mapsurl.url,
        createdAt:moment(mapsurl.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

$messageFormButton.addEventListener('click',(e)=>{
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

socket.emit('joinRoom',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
})
socket.on('roomData',({room,users})=>{

    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
    console.log(users,room)
})