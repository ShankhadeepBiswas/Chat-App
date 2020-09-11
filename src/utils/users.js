const users=[]
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
    users.push({id,username,room})
    return { id,username,room }
    
}
const removeUser=(id)=>{
    const index = users.findIndex((user)=>user.id === id)
    if(id!== -1){
        return users.splice({id},1)
    }else{
        return {error:'No user by that id'}
    }
}
const getUser = (id)=>{
    return users.find((user)=>user.id === id)
}
const getUsersInRoom = (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}