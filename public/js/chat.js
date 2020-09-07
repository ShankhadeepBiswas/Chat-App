const socket = io()                               //controlling client side stuff 
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#Location-btn')
const $message = document.querySelector('#message')
//Templates
const $msgtemplate = document.querySelector('#msg-template').innerHTML
const $locationtemplate = document.querySelector('#location-url-template').innerHTML

function disableState(){
  $messageFormButton.setAttribute('disabled','disabled')
}

$messageFormInput.addEventListener('input',(e)=>{
  e.preventDefault()
  if($messageFormInput.value == ''){
    disableState()
  }else{
    if($messageFormButton.hasAttribute('disabled'))
    {
    $messageFormButton.removeAttribute('disabled')  
    }
  }
})

socket.on('Welcome',(msg)=>{                  // receives from server side
  const html = Mustache.render($msgtemplate,{msg})        //which template to render using Mustache library
  $message.insertAdjacentHTML('beforeend',html)        //inserting each message in div element
})

$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  disableState()    // disabling the button after sending a message
  let msg = e.target.elements.message.value
  socket.emit('Message',msg,(error)=>{                 //callbacks are event aknowledgements, assuring client received from server.
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
    socket.emit('sendlocation',{lat,lon},()=>{
      $locationBtn.removeAttribute('disabled')
      console.log("Location has been sent!");
    })
  })
})
socket.on('location-url',(url)=>{
  const html = Mustache.render($locationtemplate,{url})
  $message.insertAdjacentHTML('beforeend',html)
})