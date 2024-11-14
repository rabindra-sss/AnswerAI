import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { createError } from '../error.js';
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js';
export const signup = async (req,res,next)=>{
    
    try 
    {const {userId,password}= req.body;
    //validation
    if(!userId||!password) {
        next("provide all")
    }
    
    const user= UserModel(req.body);

    await user.save();

    res.status(200).send({
        success: true,
        message: 'user created successfully',
        user:{
            userId: user.userId,
        }
    })}
    catch(err) {
        //console.log('error in signup controller')
        //console.log(err)
        next(err)
    }
}
// log in
export const signin= async (req,res,next)=>{
    
    try
    {
    const {userId}= req.body;

    const user= await UserModel.findOne({userId:userId});
    if(!user) {return next(createError(404,"user not found"))}
    
    const ismatch= await user.comparepassword(req.body.password);
    //console.log(ismatch)
    if(!ismatch) {return next(createError(400, "wrong credentials"))}
    
    const token= jwt.sign({id: user._id}, process.env.JWT_KEY);
    
    console.log(token)
    const {password, ...others}= user._doc;
    
    res.cookie("access_token", token, {
        httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'None', // Ensure cookie works for cross-site requests
    maxAge: 3600 * 1000, // 1 hour in milliseconds
    domain: 'localhost', // Make sure to set the correct domain
    path: '/',
      }).status(200).send({
        success: true,
        message: 'logged in successfully',
        user: others
    })
    }
    catch(err){
        throw(err);
        // const error= createError(404,"could not found user");
        // next(error);
    }
}

