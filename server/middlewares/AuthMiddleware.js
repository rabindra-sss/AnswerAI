import jwt from 'jsonwebtoken'
import { createError } from '../error.js';

export const authUser= (req,res,next)=>{
    try
    {   //console.log(1)
    const token= req.cookies.access_token;
    console.log(req.headers)
    //console.log('auth user')
    if(!token) next(createError(401, 'you are not authenticated'))

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if(!decoded) next(createError(401, 'you are not authenticated'));
    
    req.user= decoded;
    //console.log(req.user)
    next();}
    catch(err){
        throw(err);
    }
}