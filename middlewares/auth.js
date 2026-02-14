//auth,isStudent,isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{

    try{
      //extract JWT token
      //PENDING:other ways to fetch token

     console.log("cookies",req.cookies.token);
     console.log("body",req.body);
     console.log("header",req.header("Authorization"));

      const token = req.cookies.token||
                    req.body?.token||
                    req.header("Authorization").replace("Bearer ", "");

      if(!token ){
        return res.status(401).json({
           success:false,
           message:'Token Missing', 
        });
      }

      //verify token
      try{
        const decode= jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
       //why this?
        req.user=decode;
        }
      
       catch(error){
         return res.status(401).json({
            success:false,
            message:'token is invalid',
        });
      }
      next();

    } catch(error){
       return res.status(401).json({
        success:false,
        message:'Something went wrong,while verifying the token',
       });
    }

};

// exports.auth = (req, res, next) => {
//   try {
//     console.log("cookies:", req.cookies);
//     console.log("body:", req.body);
//     console.log("header:", req.header("Authorization"));

//     const token =
//       req.cookies?.token ||
//       req.body?.token ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token Missing",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("decoded:", decoded);

//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.log("AUTH ERROR:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Something went wrong, while verifying the token",
//     });
//   }
// };

//next middleware (isStudent)

exports.isStudent=(req,res,next)=>{
    try{
      if(req.user.role !=="Student"){
        return res.status(403).json({
            success:false,
            message:'This is a protected route for students',
        });
      }
      next();
    } catch(error){
       return res.status(500).json({
        success:false,
        message:'User Role is not matching',
       });
    }
}

//next middleware(isAdmin)

exports.isAdmin=(req,res,next)=>{
    try{
      if(req.user.role !=="Admin"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for Admins',
        });
      }
      next();
    } catch(error){
       return res.status(500).json({
        success:false,
        message:'User Role is not matching',
       });
    }
}

