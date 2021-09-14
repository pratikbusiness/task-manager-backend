const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userModel = require('../models/user') 
const {checkValidationResult, registerSchema, loginSchema} = require('../validation');
const verifyToken = require('../validation/verifyToken');

// Signup
router.post('/register', registerSchema, checkValidationResult, async (req,res)=>{
    try{
        //HASH PASSWORDS
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(req.body.password, salt);
        //STARTING EXECUTION
        const newUser = new userModel({
            _id:mongoose.Types.ObjectId(),
            email:req.body.email,
            phone:req.body.phone,
            password:hashedPassword,
            status:'verified',
        });
        newUser.save(function (err,savedUser) {
            if (err){
                return res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
            }
            res.status(200).json({successMessage:"User Registered Successfully!"});
        });
    }
    catch(err){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})

// Login
router.post('/login', loginSchema, checkValidationResult, async (req,res)=>{
    try{
        const user = await userModel.findOne({email:req.body.email}).exec();
        if (!user){
            const validationResult = 
            {
                errorMessage: "Email ID / Password Incorrect",
                errorMessageDetails:[]
            }
            return res.status(401).send(validationResult);
        }
        else if (user.status === undefined || user.status === 'blocked'){
            const validationResult = 
            {
                errorMessage: "Access Blocked. Please contact us for more information",
                errorMessageDetails:[]
            }
            return res.status(401).send(validationResult);
        }
        else if(user.status === 'verified'){
            const validPassword = await bcrypt.compare(req.body.password,user.password);
            if(!validPassword){
                const validationResult = 
                {
                    errorMessage: "Email ID / Password Incorrect",
                    errorMessageDetails:[]
                }
                return res.status(401).send(validationResult);
            }
            else{
                //Creating JSON webtoken 2 days validitiy
                const token = jwt.sign({ user_id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 172800 });
                res.status(200).json({
                    successMessage:'Login Successful! Redirecting Now',
                    successMessageDetails:{
                        token : token
                    },
                });
            }
        }        
    }
    catch(err){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})

// Verify Token
router.get("/verify",verifyToken, async (req,res)=>{
    res.status(200).json({successMessage:'User Verified Successfully'})
})

module.exports = router;