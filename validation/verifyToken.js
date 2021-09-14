const router = require('express').Router();
const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token || token === null) return res.status(401).json({errorMessage:"Access Denied",errorMessageDetails:[]});
    try{
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.locals.user_id = verified.user_id
        next();
    }
    catch(err){
        res.status(401).json({errorMessage:"Access Denied",errorMessageDetails:[]});
    }
}

module.exports = verifyToken;