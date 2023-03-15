const {check,body}=require('express-validator');
const model=require('../models');
const User=model.User

const validRegister=[
body('firstName').not().isEmpty().withMessage('Firstname is required'),
body('password','Password length must be atleast 3 character').isLength({min:3}),
body("email").isEmail().withMessage("email is not valid")]

const validLogin = [
    body('password','Password length must be atleast 3 character').isLength({min:3}),
    body("email").isEmail().withMessage("email is not valid")
]

const validemail=[
    body("email").isEmail().withMessage("email is not valid")
]

const validPassword = [
    body('password','Password length must be atleast 3 character').isLength({min:3}),
    body('cpassword','Password length must be atleast 3 character').isLength({min:3}),
]

    

module.exports={validRegister,validLogin,validemail,validPassword};