const bcrypt=require("bcrypt"); //for password hashing

const User=require("../models/User");  //import model so that we can interact with db using model

const jwt = require("jsonwebtoken");

require("dotenv").config();

//SIGNUP HANDLER  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.signup=async(req,res)=>{
    console.log("SIGNUP API HIT", req.body); 
try{
      //get data
      const{name,email,password,role}=req.body;
      //check if user already exist
      const existingUser = await User.findOne({email});

      if (existingUser){
        return res.status(400).json({
            success:false,
            message:'User already Exists',

        });
      }

    //secure password

    let hashedPassword;
    try{
        hashedPassword=await bcrypt.hash(password,10);
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'Error in hashing password',
        });
    }

    //create entry for user
    const user=await User.create({
        name,email,password:hashedPassword,role
    })

    return res.status(200).json({
        success:true,
        message:'User Created Successfuly',
    });
}
catch(error){
       console.error(error);
       return res.status(500).json({
        success:false,
        message:'User cannot be registered,please try again later',
       });
}
}

//LOGIN HANDLER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.login=async(req,res)=>{
    try{
       //data fetch
       const{email,password}=req.body;
       //validation on email and password
       if(!email||!password){
        return res.status(400).json({
            success:false,
            message:'please fill all the details carefully',
        });
       }
       //check for registered user
       let user=await User.findOne({email});
      //if not a registered user
       if(!user){
        return res.status(401).json({
            success:false,
            message:'user is not registered',
        });
       }

       const payload={
        email:user.email,
        id:user.id,
        role:user.role,
       };
       //verify password and generate JWT token
       if(await bcrypt.compare(password,user.password)){
          //password match //create token
         let token = jwt.sign(payload,
                            process.env.JWT_SECRET,
                            {
                              expiresIn:"2h",
                            } );
    
     user=user.toObject();
     user.token=token;
     user.password=undefined;   //ye password db me se nhi ,user ka jo object nikala hai usme  se htaya hai
     const options={
        expires:new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true,
        sameSite: "lax",
        
     }

     //create cookie : teen parameters pass krne pdte hain: 1. cookie name, cookie data , options(valadity etc.)
     res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:'User logged in successfully',
     });

    // res.status(200).json({
    //     success:true,
    //     token,
    //     user,
    //     message:'User logged in successfully',
    //  });
    }
       else{
        //password do not match
        return res.status(403).json({
            success:false,
            message:"Password incorrect",
        });
       }
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:'Login Failure',
       })
    }
}
