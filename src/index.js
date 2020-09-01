const path = require('path')
const express = require('express')
const app=express();
const port = process.env.PORT || 5000
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'../public')))
app.get('/',(req,res)=>{
    res.render('index')
})
app.listen(port,()=>{
    console.log("App listening to port",port);
})