const socket=io()
//Elements
const $join_form= document.querySelector('#join-room-form')
const $rooms = $join_form.querySelector('#Rooms')
//Template
const $room_template = document.querySelector('#rooms-template').innerHTML

socket.on('Rooms',({rooms})=>{
    if(rooms.length===0)
        rooms=['No room online']
    const html = Mustache.render($room_template,{
        rooms
      })
      $rooms.innerHTML= html
})
