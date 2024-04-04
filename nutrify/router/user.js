const router = require("express").Router();
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {customError} = require('../middleware/errorMiddleware')


// endpoint for registering user 
router.post("/register", (req, res, next)=>{
    
    let user = req.body;

    if(user.name==undefined || user.email==undefined || user.password==undefined || user.age==undefined){
        return next(customError(400, "Please provide all the required fields"))
    }
   

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err)
        {
            bcrypt.hash(user.password,salt,async (err,hpass)=>{
                if(!err)
                {
                    user.password=hpass;
                    try 
                    {
                        let doc = await userModel.create(user)
                        res.status(201).send({message:"User Registered"})
                    }
                    catch(err){
                        console.log(err);
                        next(customError(500, err.message))
                    }
                }
            })
        }
    })

    
})


// endpoint for login 

router.post("/login",async (req, res, next)=>{

    let userCred = req.body;

    if(userCred.email==undefined || userCred.password==undefined){
        return next(customError(400, "Please provide email and password"))
    }

    try 
    {
        const user=await userModel.findOne({email:userCred.email});
        if(user!==null)
        {
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true)
                {
                    jwt.sign({email:userCred.email} ,process.env.JWT_SECRET, (err,token)=>{
                        if(!err)
                        {
                            res.send({message:"Login Success",token:token,userid:user._id,name:user.name});
                        }
                    })
                }
                else 
                {
                    res.status(403).send({message:"Incorrect password"})
                }
            })
        }
        else 
        {
            res.status(404).send({message:"User not found"})
        }


    }
    catch(err)
    {
        console.log(err);
        next(customError(500, err.message))
    }



})

module.exports = router;