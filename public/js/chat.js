const socket = io()                               //controlling client side stuff 
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#Location-btn')
const $message = document.querySelector('#messages')
//Templates
const $sidebartemplate = document.querySelector('#sidebar-template').innerHTML
const $msgtemplate = document.querySelector('#msg-template').innerHTML
const $locationtemplate = document.querySelector('#location-url-template').innerHTML
//Important little functions
const autoscroll =()=>{
  //new message element
  const newMsg= $message.lastElementChild;
  //margin height of new message
  const newMsgStyles = getComputedStyle(newMsg);
  const newMsgMargin = parseInt(newMsgStyles.marginBottom);
  const newMsgHeight = newMsg.offsetHeight + newMsgMargin;
  //visible height
  const visibleHeight = $message.offsetHeight
  //Height of message container
  const containerHeight = $message.scrollHeight;
  //How far have I scrolled down
  const scrollOffset = $message.scrollTop+visibleHeight
  if(containerHeight - newMsgHeight <= scrollOffset){
    $message.scrollTop= $message.scrollHeight
  }
}
function disableState(){
  $messageFormInput.value =''
  $messageFormButton.setAttribute('disabled','disabled')
}
//Query String parsing and options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true})
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
  const html = Mustache.render($msgtemplate,{
    username: msg.user,
    message : msg.text,
    createdAt : moment(msg.createdAt).format('h:mm a (L)')
  })        //which template to render using Mustache library
  $message.insertAdjacentHTML('beforeend',html)        //inserting each message in div element
  autoscroll()
})
socket.on('roomData',({room,users})=>{
  const html = Mustache.render($sidebartemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML= html
})

$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.disabled=true
  let msg = e.target.elements.message.value
  socket.emit('Message',msg,(error)=>{                 //callbacks are event aknowledgements, assuring client received from server.
    $messageFormInput.value=''                              // clearing textbox after sending a message
    $messageFormInput.focus()                               //focuses cursor on the input textbox
    if(error){
     return alert(error);
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
socket.on('location-url',(URL)=>{
  const html = Mustache.render($locationtemplate,{
    username:URL.user,
    url: URL.url,
    createdAt: moment(URL.createdAt).format('h:mm a (L)')})
  $message.insertAdjacentHTML('beforeend',html)
  autoscroll()
})
socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error);
    location.href='/';
  }
})