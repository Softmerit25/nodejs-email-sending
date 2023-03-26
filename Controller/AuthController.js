import mongoose from "mongoose";
import User from "./../model/User.js"
import bcrypt from "bcryptjs";
import { createError } from "../utils/error";
import  jwt  from "jsonwebtoken";


export const registerUser = async (req, res, next,) =>{
    try{

        // Checking if user already exists
        const existingUser = await User.findOne({email: req.body.email});

        if(existingUser){
           throw Error("User with the provided email already exists"); 
        }


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        ...req.body,
        password: hash,
    });

    await newUser.save();
    res.status(200).send("Account has been created!"); 

    }catch(err){
        next(err)
    }
};




export const loginUser = async (req, res, next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user) return next(createError(404, "Account not found!"))

        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isCorrect) return next(createError(400, "Wrong Credentials!"))

        const token = jwt.sign({id:user._id}, process.env.TOKEN_KEY)
        const {password, ...others} = user._doc;

        res.cookie("access_token", token,{
            httpOnly: true,
        }).status(200)
        .json(others);

    }catch(err){
        next(err);
    }
};