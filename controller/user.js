const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = models.User;
const Property = models.Property;
const {  validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

var mailTransporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
})







exports.postRegister = async (req,res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        const checkUser = User.findOne({where:{email:email}});
        if(!checkUser){
            res.status(500).json({message:"Email already exist"});
            return;
        }

        const hashPass = await bcryptjs.hash(password,12);

        const user = await User.create(
            {
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashPass
            
        }
        );

        const payload = {
            id:user.id,
            email:user.email
        }

        const secret = process.env.SECRET_KEY;
        const token = jwt.sign(payload,secret,{expiresIn:'12h'});
        res.status(200).json({success:"ok",msg:"Register Successful",data:user,token:token});
        
    } catch (e) {
        console.log(e)
        res.status(500).json({message:e})
    }


}

exports.postLogin = async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({where: {email:email}});
        if(!user){
            res.status(400).json({message:"Invalid email Credential"});
            return;
        }
            const isMatch = await bcryptjs.compare(password,user.password);
            if(!isMatch){
                res.status(400).json({message:'Invalid email Credential'});
                return;
            }
                
            const payload = {
            id:user.id,
            email:user.email
            }

            const secret = process.env.SECRET_KEY;
            const token = jwt.sign(payload,secret,{expiresIn:'12h'});
            res.status(200).json({success:"ok",msg:"login Successful",data:user,token:token});
        
        
    } catch (e) {
        res.status(400).json(e)
    }


}


exports.getForgetPassword = (req,res,next) => {
    res.render('forgetPassword');
}

exports.postForgetPassword = async (req,res,next) => {
    try {
        const email =req.body.email;

        const user = await User.findOne({where:{email:email}});

        if(!user){
            res.send("User not exist");
            return;
        }

        const payload = {
            email:user.email,
            id:user.id
        }

        const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'15m'});

        
        const link = `http://localhost:3000/resetPassword/${token}`
        console.log(link);
        

        var message = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Password Reset Link",
            text: link,
     
          };

          mailTransporter.sendMail(message,(err)=>{
            if(err){
                console.log(err);
            }
          })


        res.status(200).json({success:'ok',msg:"We have sent instruction to reset password over your registration email address"});
        
    } catch (e) {
        res.send(e);
        console.log(e);
    }
}

exports.getResetPassword = async (req,res,next) => {
    try {

        const token = req.params.token;

        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);

        const {id} = verifyUser;

        const user = await User.findOne({where:{id:id}});

        if(id!=user.id){
            res.send('Invalid Id.....')
        }
        
        res.render('resetPassword',{token});



    } catch (e) {
        console.log(e)
    }
}

exports.postResetPassword = async (req,res,next) => {
    try {
        const token = req.body.token;
        const upassword = req.body.password;
        const cpassword = req.body.cpassword;

        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        const {id} = verifyUser;

        const user = await User.findOne({where    :{id:id}});

        // if(id!=user.id){
        //     res.send('Invalid Id.....')
        // }


        if(upassword == cpassword){
            const hashPassword = await bcryptjs.hash(upassword,12);           
             const updateData = await User.update(
                {
                    password:hashPassword
                },{
                    where:{id:user.id}
                }
            )
        } 
        res.status(200).json({success:'ok',msg:"Password Updated Succesfully"})
    } catch (e) {
        console.log(e)
    }
}


exports.filterData = async (req,res)=>{
    try {
        const {type,keyword} = req.body;

        const search = [];
        const typeArray = [];

        if(type!=undefined){
            typeArray.push({isBlocked:type})
        }

        if(keyword){
            search.push({
                [Op.or]:[
                    {firstName:{[Op.like]:`%${keyword}%`}},
                    {email:{[Op.like]:`%${keyword}%`}}
                ]
            })
        }

        const conditiondata = [...typeArray,...search];





        const user = await User.findAll({where:conditiondata})
        
        const data = [];
        for(us of user){
                     
               const {count,rows} = await Property.findAndCountAll({
                    where:{user_id:us.id}
                })
                data.push({
                    userid:us.id,
                    properties:count
                });
                                
        }
        res.status(200).json({data : data})
        
    } catch (e) {
        res.status(500).json({error:e})
    }
}


