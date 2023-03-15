const models = require('../models');
const Image = models.Image;
const jwt = require('jsonwebtoken');



  exports.imageUpload = async (req,res)=>{

    try {

      const token = req.token; 
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
       
     if(!verifyUser){
        res.status(400).json({msg:"please login for access this permission"})
        return;
     }
     const userid = verifyUser.id;

        const data = await Image.create({
            caption:req.body.caption,
            user_id:userid,
            file_name:req.file.filename
        })
        res.status(201).json({status:"Success",data:data})
        
    } catch (e) {
      console.log(e)
        res.status(500).json(e)
    }

  }

  
