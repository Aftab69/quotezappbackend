const express = require("express");
const router = express.Router();
const User = require("./Model");
const Picture = require("./Picturemodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/home",async(req,res)=>{
    try{
        let pic = await Picture.find().sort({date:-1})
        res.send(pic)
    }catch(error){
        console.log(error)
    }
})

router.get("/api/profile",async(req,res)=>{
    try{
        const verifiedToken = jwt.verify(req.cookies.jwtoken,process.env.PRIVATEKEY);
        const userData = await User.findOne({_id:verifiedToken._id})
        if(userData){
            res.status(200).send(userData);
        } else {
            res.status(400).json({"message":"User unauthorised"})
        }
    } catch(error){
            res.status(400).json({"message":"User unauthorised"})
    }
})

router.post("/register",async(req,res)=>{
    try{
        const { name, email, password, cpassword } = req.body;
        if(!name || !email || !password || !cpassword){
            res.status(400).json({"message":"Please fill your form"})
        }
        const userExist = await User.findOne({email:email});
        if(userExist){
            res.status(401).json({"message":"Email already exists"})
        } else if(password!==cpassword){
            res.status(402).json({"message":"The password confirmation does not match"})
        } else {
            const newUser = new User({name,email,password,cpassword});
            newUser.password =await bcrypt.hash(newUser.password,12);
            newUser.cpassword =await bcrypt.hash(newUser.cpassword,12);
            await newUser.save();
            res.status(200).json({"message":"User successfully registered"});
        }
    }catch(error){
        console.log(error)
    }
})

router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).json({"message":"Please fill your form"})
        }
        const userExist = await User.findOne({email:email});
        if(!userExist){
            res.status(401).json({"message":"Invalid credentials"})
        }
        const passwordMatched =await bcrypt.compare(password,userExist.password);
        if(!passwordMatched){
            res.status(401).json({"message":"Invalid credentials"})
        } else if(passwordMatched){
            const token = jwt.sign({_id:userExist._id},process.env.PRIVATEKEY);
            userExist.tokens.push({token: token});
            userExist.save();
            res.cookie("jwtoken",token);
            res.status(200).json({"message":"User successfully logged in"})
        }
    }catch(error){
        console.log(error)
    }
})

router.post("/upload", async(req,res)=>{
    try{
        const { background, fontFamily, valquote, valinput, date } = req.body;
        const verifiedToken = jwt.verify(req.cookies.jwtoken,process.env.PRIVATEKEY);
        const particularUser = await User.findOne({_id:verifiedToken._id})
        particularUser.pictures.push({background, fontFamily, valquote, valinput, date});
        await particularUser.save();
        const newPicture = new Picture({
            background, fontFamily, valquote, valinput, date
        })
        await newPicture.save();
        res.status(200).send(particularUser);
    }catch(error){
        console.log(error)
    }
})

module.exports = router;