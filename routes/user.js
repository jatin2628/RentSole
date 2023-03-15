const userController = require('../controller/user');
const express = require('express');
const { body, validationResult } = require('express-validator');
const authvalid=require('../middleware/validation');
const authvalidresult=require("../middleware/validationresult");
const router = express.Router();

router.post('/register',userController.postRegister);


router.post('/login',userController.postLogin);

router.get('/forgetPassword',userController.getForgetPassword);

router.post('/forgetPassword',authvalid.validemail,authvalidresult,userController.postForgetPassword);

router.get('/resetPassword/:token',userController.getResetPassword);

router.post('/resetPassword',authvalid.validPassword,authvalidresult,userController.postResetPassword);

router.post('/filter',userController.filterData);

// router.post('/register',userController.postRegister);


// router.post('/register',userController.postRegister);


module.exports = router;