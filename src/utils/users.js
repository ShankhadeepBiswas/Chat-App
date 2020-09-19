const users=[]
var rooms=[]
const addUser = ({id,username,room})=>{
    //Cleaning data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    //Validation
    if(!username || !room){
        return {error: 'Username or Room required!'}
    }
    const existingUser= users.find((user)=>user.username === username && user.room === room)
    if(existingUser){
        return {error : 'Username and Room already taken!'}
    }
    //Store User
    const user = { id,username,room }
    users.push(user)
    return {user}

}
const removeUser=(id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if(index!== -1){
        return users.splice(index,1)[0]
    }
}
const getUser = (id)=>{
    return users.find((user)=>user.id === id)
}
const getUsersInRoom = (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}
const getRooms = ()=>{
    rooms= users.map((user)=>user.room)
    return rooms.filter((room,index)=>rooms.indexOf(room)==index)
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}
