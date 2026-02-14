const express = require("express");
const app=express();

require('dotenv').config();
const PORT=process.env.PORT || 4000;
app.use(express.json());
//cookie-parser 
const cookieParser=require("cookie-parser");
app.use(cookieParser());


require("./config/database").connect();

//route import and mount
const user=require("./routes/user");
app.use("/api/v1",user);

//Activate server
app.listen(PORT,()=>{
    console.log(`App is running successfully`);
})