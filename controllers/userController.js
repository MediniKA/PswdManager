const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const SECRET_KEY = process.env.SECRET

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
        const token = jwt.sign({mobileNumber:existingUser.mobileNumber,id:existingUser._id }, SECRET_KEY)
        res.status(200).json({userModel:existingUser,token:token})

    }catch (error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
}


// forgot password



const loginWithPhoneOtp = async (req, res, next) => {
    try {
  
      const { phone } = req.body;
      const user = await User.findOne({ phone });
  
      if (!user) {
        next({ status: 400, message: PHONE_NOT_FOUND_ERR });
        return;
      }
  
      res.status(201).json({
        type: "success",
        message: "OTP sended to your registered phone number",
        data: {
          userId: user._id,
        },
      });
  
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      user.phoneOtp = otp;
      user.isAccountVerified = true;
      await user.save();
      // send otp to phone number
      await fast2sms(
        {
          message: `Your OTP is ${otp}`,
          contactNumber: user.phone,
        },
        next
      );
    } catch (error) {
      next(error);
    }
  };
  
module.exports = {signup, signin}