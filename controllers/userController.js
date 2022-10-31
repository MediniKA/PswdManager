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
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_VALUE));
        const hashedMPin = await bcrypt.hash(MPin, salt);

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
    console.log(err)
      res.json({ message: err.message });
  }
};


//function to forgot password
let forgotPassword = async (req, res) => {
    try {
        const MPinNew = req.body.newMPin
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_VALUE));
        const newMPin = await bcrypt.hash(MPinNew.toString(), salt);
        console.log(newMPin)
        await userModel.findOneAndUpdate(
            { mobileNumber: req.body.mobileNumber },
            { MPin: newMPin }
        );
        res.json({ message: "MPin changed successfully" });
    } catch (err) {
        console.log(err)
        res.json({ message: err.message });
    }
};

//password reset when logged in
let resetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({userId:req.userId});
        console.log(user)
        const result = await bcrypt.compare(
            req.body.MPin.toString(),
            user.MPin
        );

        if (result) {
            res.json({ message: "Your new mPin cannot be same as old!" });
        } else {
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT_VALUE));
            const newmPin = await bcrypt.hash(req.body.MPin.toString(), salt);
            await userModel.findOneAndUpdate(
                { id: req.userId },
                { MPin: newmPin }
            );
            res.json({ message: "MPin changed successfully" });
        }
    } catch (error) {
        console.log(error)
        res.json({ message: error });
    }
};

async function resetMPin(req,res){
    if(typeof req.body.oldMPin!="number") return res.send("Enter a valid 4-digit old MPin")
    if(typeof req.body.newMPin!="number") return res.send("Enter a valid 4-digit new MPin")
    if(req.body.oldMPin==req.body.newMPin) return res.send("New MPin cannot be same as old MPin")
    if(req.body.newMPin.toString().length!=4) return res.send("Enter a valid 4-digit new MPin")
    if(req.body.oldMPin.toString().length!=4) return res.send("Enter a valid 4-digit old MPin")
    const [userData] = await userModel.find({mobileNumber: req.User.mobileNumber}).clone()
    console.log(userData)
    try {
        if(await bcrypt.compare(req.body.oldMPin.toString(), userData.MPin.toString())) { //compare MPin 
            const salt = await bcrypt.genSalt(Number(process.env.SALT)); // salt generation
            const hashedPassword = await bcrypt.hash(req.body.newMPin.toString(), salt) // bcrypting MPin
            await userModel.findOneAndUpdate({ mobileNumber: req.existingUser.mobileNumber},{ MPin: hashedPassword },(err)=>{ //Update in database
                if(err) return res.send(err)
            }).clone();
            res.status(200).send("MPin successfully Updated")
        } 
        else {
            return res.status(401).send('Wrong Old MPin')
        }
    } 
    catch(err) {
        return res.status(500).send(err)
    }
}

//logout function
let logout = async (req, res) => {
  try {
      await userModel.findOneAndUpdate(
          { mobileNumber: req.body.mobileNumber },
          { loggedIn: false }
      );
      const userToken = await refreshModel.findOne({
          refresh_token: req.body.refreshToken,
      });                                       // finding document with the matched refresh token
      if (!userToken) {
          return res.status(200).json({
              error: false,
              message: "You have logged out already!",
          });                                   // if no user exists, by default return logged out
      } else {
          await userToken.remove();
          res.json({ error: false, message: "Logged out successfully" });
      }
  } catch (err) {
      res.json({ error: true, message: err.message });
  }
};

module.exports = {signup, signin,logout,GetNewAccessToken,getOtp,verifyOtp, forgotPassword,resetMPin, resetPassword}