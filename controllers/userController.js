const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")


const signup = async(req,res) => {
    
    
    // const{ mobileNumber, MPin} = req.body;
    // try{
        
    //     //Check Existing user
    //     // const existingUser =await userModel.findOne({mobileNumber:mobileNumber});
    //     // if(existingUser){
    //     //     return res.status(400).json({message: "User already exists"})
    //     // }
        
    //     // //Hashed Password
    //     // const hashedMPin = await bcrypt.hash(MPin, 10);

    //     // //User Creation
    //     // const result = await  userModel.create({
    //     //     mobileNumber:mobileNumber,
    //     //     MPin:hashedMPin
    //     // })

    //     //Token Generation
    //     // const token = jwt.sign({MPin:result.mobileNumber}, SECRET_KEY)
    // }catch (error){

    // }


}

const signin = (req,res) =>{
    
}

module.exports = {signup, signin}