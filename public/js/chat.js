const socket = io()
socket.on('Welcome',(message)=>{                  // receives from server side
    console.log(message);
})
document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault()
  let msg = e.target.elements.message.value
  socket.emit('Message',msg,(error)=>{                 //callbacks are event aknowledgements, assuring client received from server.
    if(error){
      return console.log(error);
    }
    console.log("Message has been delivered");
  })
})
document.querySelector('#Location-btn').addEventListener('click',()=>{
  if(!navigator.geolocation){
    alert('Geolocation is not supported in your browser')
  }
  navigator.geolocation.getCurrentPosition((position)=>{
    const {latitude: lat,longitude: lon} = position.coords
    socket.emit('location',{lat,lon},()=>{
      console.log("Location has been sent!");
    })
  })
})