const socket = io()
socket.on('Welcome',(message)=>{                  // receives from server side
    console.log(message);
})
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#Location-btn')

$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.setAttribute('disabled','disabled')    // disabling the button after sending a message
  let msg = e.target.elements.message.value
  socket.emit('Message',msg,(error)=>{                 //callbacks are event aknowledgements, assuring client received from server.
    $messageFormButton.removeAttribute('disabled')          // enabling button after successful message delivery
    $messageFormInput.value=''                              // clearing textbox after sending a message
    $messageFormInput.focus()                               //focuses cursor on the input textbox
    if(error){
      return console.log(error);
    }
    console.log("Message has been delivered");
  })
})
document.querySelector('#Location-btn').addEventListener('click',()=>{
  $locationBtn.setAttribute('disabled','disabled')
  if(!navigator.geolocation){
    alert('Geolocation is not supported in your browser')
  }
  navigator.geolocation.getCurrentPosition((position)=>{
    const {latitude: lat,longitude: lon} = position.coords
    socket.emit('location',{lat,lon},()=>{
      $locationBtn.removeAttribute('disabled')
      console.log("Location has been sent!");
    })
  })
})