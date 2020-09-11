const { text } = require("express");

const generateMsg =(text,user)=>{
    return {
        user,
        text,
        createdAt: new Date().getTime()
    }
}
const generateLoc = (url,user) =>{
    return {
        user,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMsg,
    generateLoc
}