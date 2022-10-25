const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const speakeasy = require("speakeasy")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const refreshModel = require('../models/refreshTokenModel')
const generateTokens = require("../utils/generateTokens");
const verifyRefreshToken = require('../utils/verifyRefreshToken.js');
const refreshTokens=[]
const SECRET_KEY = process.env.SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

// to SignUp
const signup = async(req,res) => {
    
    
    const{ mobileNumber, MPin, reTypeMPin} = req.body;
    try{
        
        // Check Existing user
        const existingUser =await userModel.findOne({mobileNumber:mobileNumber});
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
        if(MPin!=reTypeMPin){
            return res.status(400).json({message: "MPin and retype MPin not Match"})
        }
        
        //Hashed Password
        const hashedMPin = await bcrypt.hash(MPin, 10);

        //User Creation
        const result = await  userModel.create({
            mobileNumber:mobileNumber,
            MPin:hashedMPin
        })

        // Token Generation
        // const token = jwt.sign({mobileNumber:result.mobileNumber,id:result._id }, SECRET_KEY)
        res.status(201).json({userModel:result})

    }catch (error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
}


// to Signin
const signin = async(req,res) =>{
    const{mobileNumber,MPin} = req.body;
    try{
        // Check Existing user
        const existingUser =await userModel.findOne({mobileNumber:mobileNumber});
        if(!existingUser){
            return res.status(404).json({message: "User not found"})
        }

        //to Match Credentials (MPin)
        const matchMPin = await bcrypt.compare(MPin, existingUser.MPin);

        if(!matchMPin){
            return res.status(400).json({message:"Invalid Credentials"})
        }
      

        // signin -token generation
        // const token = jwt.sign({mobileNumber:existingUser.mobileNumber,id:existingUser._id }, SECRET_KEY,{expiresIn:'1h'})
        // const refresh_token = jwt.sign({mobileNumber:existingUser.mobileNumber,id:existingUser._id }, REFRESH_TOKEN,{expiresIn:'1d'})
        // // refreshTokens.push(refresh_token)
        // const refreshTokens = new refreshModel({refresh_token,userId:existingUser._id}) 
        // await refreshTokens.save()
        const token =await generateTokens(existingUser) // function call to generate tokens 
        // res.cookie("refreshToken",refresh_token,{httpOnly:true,maxAge:24 * 60 * 60 * 1000})
        // res.status(200).json({userModel:existingUser,token:token})
        res.status(200).json({userModel:existingUser,access_token:token})

    }catch (error){
console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
}


const renewRefreshToken = async(req,res) => {
    try {
     const refreshToken = req.body.refreshToken
    if(!refreshToken || refreshTokens.includes(refreshToken)){
        res.status(403),json({message:"Unauthorized User"})
    }
    jwt.verify(refreshToken,REFRESH_TOKEN,(err,user)=>{
        if(!err){
            const token = jwt.sign({mobileNumber:existingUser.mobileNumber,id:existingUser._id }, SECRET_KEY,{expiresIn:'30s'})
            return res.status(201).json({token})
        }else{
            return res.status(404).json({message: "User not found"})
        }
    })
} catch (error) {
    next(error);
  }
}



async function GetNewAccessToken(req, res) {
	try{
		const response = await verifyRefreshToken(req.body.refreshToken).catch((err)=>res.send(err)) // if verification fails the return error response

		const accessToken = jwt.sign(
			{id: response.tokenDetails.id },
			process.env.SECRET,
			{ expiresIn: "20m" }
		); 
		res.status(200).json({
			error: false,
			accessToken,
			message: "Access token created successfully",
		});
	}

	catch{
		((err) => res.status(400).json(err));
	}
};

// forgot password


// const getOtp=async(req, res) => {
//   try {
//     const secret = speakeasy.generateSecret({length: 10})
//             res.send({
//           "token": speakeasy.totp({
//           secret: secret.base32,
//           encoding: "base32",
//           step: 60
//       }),
//       "secret":secret.base32,
     
//   })
// }
// catch (error) {
    
//     res.status(500).send(error)
//      } 
// } 

// const verifyOtp = async(req, res) => {
//   const otp = req.body.token;
//   const mobileNumber=req.body.mobileNumber;
//   const MPin = req.body.MPin
//   const user =  userModel.findOne({mobileNumber:mobileNumber})
//   const verfied = speakeasy.totp.verify({secret: req.body.secret, encoding: 'base32', token: otp,window:0,step:60});
//   if(verfied){
//           user.updateOne({mpinHash:MPin},(err,docs)=>{
//              if(err){
//                 return res.send(err)
//              }
//              res.send("mpin updated")
//           })
         
//      }
//   else{
//       res.send("invalid otp")
//   }
// }
const getOtp = async (req, res) => {
  try {
      const secret = speakeasy.generateSecret({ length: 10 });
      res.send({
          OTP: speakeasy.totp({
              secret: secret.base32,
              encoding: "base32",
              step: 60,
          }),
          secret: secret.base32,
      });
  } catch (err) {
      res.json({ message: err.message });
  }
};

//verification of number using speakeasy
let verifyOtp = async (req, res, next) => {
  try {
      const result = speakeasy.totp.verify({
          secret: req.body.secret,
          encoding: "base32",
          token: req.body.OTP,
          window: 0,
          step: 60,
      });
      if (result) {
          // res.send({
          //     message: "Verified",
          // });
          next();
      } else {
          res.json({ message: "Verification unsuccessful" });
      }
  } catch (err) {
      res.json({ message: err.message });
  }
};


//logout function
let logout = async (req, res) => {
  try {
      await User.findOneAndUpdate(
          { mobileNumber: req.body.mobileNumber },
          { loggedIn: false }
      );
      const userToken = await Token.findOne({
          refresh_token: req.body.refresh_token,
      }); // finding document with the matched refresh token
      if (!userToken) {
          return res.status(200).json({
              error: false,
              message: "You have logged out already!",
          }); // if no user exists, by default return logged out
      } else {
          await userToken.remove();
          res.json({ error: false, message: "Logged out successfully" });
      }
  } catch (err) {
      res.json({ error: true, message: err.message });
  }
};

module.exports = {signup, signin,logout,GetNewAccessToken,getOtp,verifyOtp}