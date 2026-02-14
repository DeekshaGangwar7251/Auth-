const mongoose=require("mongoose");

require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("DB connection is successful"))
    .catch((error)=>{
        console.log("Issue an error");
        console.log(error.message);
        process.exit(1);
    });
};