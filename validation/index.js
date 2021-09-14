let { check,validationResult } = require("express-validator")
const mongoose = require('mongoose');
const User = require('../models/user')

const addTasksSchema = () =>{
    return [
        check('title', 'Title should be between 5 & 50 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 5 , max : 50}),
        check('desc', 'Description should be minimum 25 & 250 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 25 , max : 250}),
        check('taskstatus', 'Select a valid Task Status')
            .exists().bail()
            .isString().bail()
            .isIn(['todo','doing','done'])
            .isLength({ min: 2 , max : 250}),
    ]
}

const deleteTasksSchema = () =>{
    return [
        check('email', 'Email ID should be between 5 & 50 characters')
            .exists().bail()
            .isEmail().bail()
            .isLength({ min: 6 , max : 50}).bail()
            .normalizeEmail(),
        check('password', 'Password should be minimum 6 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 6}),
    ]
}

const editTaskSchema = () =>{
    return [
        check('title', 'Title should be between 5 & 50 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 5 , max : 50}),
        check('desc', 'Description should be minimum 25 & 250 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 25 , max : 250}),
        check('taskstatus', 'Select a valid Task Status')
            .exists().bail()
            .isString().bail()
            .isIn(['todo','doing','done'])
            .isLength({ min: 2 , max : 250}),
    ]
}

const loginSchema = () =>{
    return [
        check('email', 'Email ID should be between 5 & 50 characters')
            .exists().bail()
            .isEmail().bail()
            .isLength({ min: 6 , max : 50}).bail()
            .normalizeEmail(),
        check('password', 'Password should be minimum 6 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 6}),
    ]
}

const registerSchema = () =>{
    return [
        check('email', 'Email ID should be between 5 & 50 characters')
            .exists().bail()
            .isEmail().bail()
            .isLength({ min: 6 , max : 50}).bail()
            .custom(async (email) => { 
                const emailExist = await User.where({email:email}).countDocuments();
                if (emailExist !== 0){
                    throw new Error('Email ID Already Registered') 
                } 
            }).bail()
            .normalizeEmail(),
        check('phone', 'Phone number should be between 9 & 15 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 9 , max : 15}).bail()
            .custom(async (phone) => { 
                const phoneExist = await User.where({phone:phone}).countDocuments();
                if (phoneExist !== 0) { 
                    throw new Error('Phone No Already Registered') 
                } 
            }),
        check('password', 'Password should be between 6 & 15 characters')
            .exists().bail()
            .isString().bail()
            .isLength({ min: 6 , max : 15}),
    ];
}

function checkValidationResult(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    else{
        res.status(422).json({errorMessage:'Please fill all the details correctly.',errorMessageDetails: result.array() });
    }
}

module.exports.loginSchema = loginSchema();
module.exports.registerSchema = registerSchema();
module.exports.addTasksSchema = addTasksSchema();
module.exports.deleteTasksSchema = deleteTasksSchema();
module.exports.editTaskSchema = editTaskSchema();
module.exports.checkValidationResult = checkValidationResult;