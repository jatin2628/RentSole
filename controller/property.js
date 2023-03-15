const models = require('../models');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');
const {Op} =require('sequelize');
const property_question_option = require('../models/property_question_option');

const Property = models.Property;
const Amenity = models.Amenity;
const Image = models.Image;
const Property_Image = models.Property_Image
const Property_Amenity = models.Property_Amenity;
const Property_Room = models.Property_Room;
const Property_Room_Image = models.Property_Room_Image;
const Furnishing_Status = models.Furnishing_Status;
const Question = models.Question;
const Question_Option = models.Question_Option;
const Property_Question = models.Property_Question;
const Property_Question_Option = models.Property_Question_Option;
const Property_Applicant = models.Property_Applicant;



exports.createProperty = async (req,res,next) => {
    try {


        const userid = req.userid;
        
       
     if(!userid){
        res.status(400).json({msg:"please login for access this permission"})
        return;
     }

     

     const {name,property_type,images,rooms,description,tenancy_status,questions,street,city,state,postal_code,amenities,country,latitude,longitude,area,furnishing_status,furnishing_details} = req.body;
     const property = await Property.create({
        user_id:userid,
        name:name,
        property_type:property_type,
        description:description,
        tenancy_status:tenancy_status,
        street:street,
        city:city,
        state:state,
        postal_code:postal_code,
        country:country,
        latitude:latitude,
        longitude:longitude,
        area:area,
        furnishing_status:furnishing_status,
        furnishing_details:furnishing_details
     })

     const amenity_array=[]
     for(const amenity of amenities){
        amenity_array.push(
          {  
            property_id:property.id,
            amenity_id:amenity.id
          }
        )
     }
    const amenitydata = await Property_Amenity.bulkCreate(amenity_array);

    const property_image = [];

    for(const pimage of images){
        property_image.push({
            property_id:property.id,
            image_id:pimage.id
        })
    }

    const propertyImage = await Property_Image.bulkCreate(property_image);

     const room_array = [];

     for(const room of rooms){
       const getImage = await Image.findOne({where:{id:room.images}});
      

        room_array.push({
            property_id:property.id,
            name:room.name,
            image_id:room.images,
            url:getImage.file_name,
            caption:getImage.caption,
            room_type:room.room_type,
            condition:room.condition,
            remark:room.remark
        })
     }

     const roomdata = await Property_Room.bulkCreate(room_array);

     const property_room_image_array = [];

     for(const rimage of roomdata){
        property_room_image_array.push({
            room_id:rimage.id,
            image_id:rimage.image_id,
            image_url:rimage.url
        })
     }

     const roomimage = await Property_Room_Image.bulkCreate(property_room_image_array);

     

    




     const property_question = [];

     const property_question_option = [];

     for(que of questions){
        const getQuestion = await Question.findOne({where:{id:que.question_id}});
        const insert_data = {
            property_id:property.id,
            question_id:que.question_id,
            option_id:que.option_id,
            title:getQuestion.title,
            type:getQuestion.type,
            has_other:getQuestion.has_other
        }
     

     const pQestion = await Property_Question.create(insert_data);
     const getOption = await Question_Option.findAll({where:{question_id:que.question_id}});

     for(const opt of getOption){
       

        const optiondata = {
            property_id:property.id,
            property_question_id:pQestion.id,
            option_id:opt.id,
            text:opt.text,
            preferred:(que.option_id==opt.id)?1:0
        }
        const propQueOpt = await Property_Question_Option.create(optiondata);
     }

     

    }



    const getProperty = await Property.findOne({
        where: { id: property.id },
        include: [
          {
            model: Image,
            as: 'property_images',
            attributes: ['id', 'file_name', 'caption', 'user_id']
  
          },
          {
            model: Amenity,
            as: 'property_amenities',
            attributes: ['id', 'name', 'icon']
          },
          {
            model: Property_Room,
            as: 'property_rooms',
            attributes: ['id', 'name', 'url', 'room_type', 'caption']
          }
  
  
        ],
      });
     

     res.status(201).json({status:'success',msg:"data inserted",data:getProperty})
        
    } catch (e) {
        console.log(e);
        res.status(500).json({msg:e});
        
    }
}




exports.updateProperty = async (req,res,next) => {
    try {
        const userid = req.userid;
       
     if(!userid){
        res.status(400).json({msg:"please login for access this permission"})
        return;
     }


     const {property_id,name,property_type,images,rooms,description,tenancy_status,questions,street,city,state,postal_code,amenities,country,latitude,longitude,area,furnishing_status,furnishing_details} = req.body;
     const property = await Property.update(
        {
        name:name,
        property_type:property_type,
        description:description,
        tenancy_status:tenancy_status,
        street:street,
        city:city,
        state:state,
        postal_code:postal_code,
        country:country,
        latitude:latitude,
        longitude:longitude,
        area:area,
        furnishing_status:furnishing_status,
        furnishing_details:furnishing_details
     },{
        where:{id:property_id}
     }
     )


     await Property_Amenity.destroy({where:{property_id:property_id}});
   
     for(const amenity of amenities){
         await Property_Amenity.create(
            {
                amenity_id:amenity.id,
                property_id:property_id
            }
        );
        
     }
   
     await Property_Image.destroy({where:{property_id:property_id}});


    for(const pimage of images){
       
        await Property_Image.create(
            {
                image_id:pimage.id,
                property_id:property_id
            }
        );
    }

    for(const room of rooms){
       const getImage = await Image.findOne({where:{id:room.images}});

        roomdata = await Property_Room.update(
            {
                    name:room.name,
                    image_id:room.images,
                    url:getImage.file_name,
                    caption:getImage.caption,
                    room_type:room.room_type,
                    condition:room.condition,
                    remark:room.remark
            },{
                where:{property_id:property_id}
             }
        )


        for(const rimage of roomdata){
            const roomimage = await Property_Room_Image.update(
                {
                    image_id:rimage.image_id,
                    image_url:rimage.url
            
                },{
                    where:{room_id:rimage.id}
                 }
            );
            
        }
    }
  

     for(que of questions){
        const getQuestion = await Question.findOne({where:{id:que.question_id}});

     const pQestion = await Property_Question.update(
        {
            question_id:que.question_id,
            option_id:que.option_id,
            title:getQuestion.title,
            type:getQuestion.type,
            has_other:getQuestion.has_other
        },{
            where:{property_id:property_id}
         }
     );
     const getOption = await Question_Option.findAll({where:{question_id:que.question_id}});

     for(const opt of getOption){
       
        const propQueOpt = await Property_Question_Option.update(
            {
                property_question_id:pQestion.id,
                option_id:opt.id,
                text:opt.text,
                preferred:(que.option_id==opt.id)?1:0
            },{
                where:{property_id:property_id}
             }
        );
     }

     

    }
     

     res.status(201).json({status:'success',msg:"updated succesfully"})
        
    } catch (e) {
        console.log(e);
        res.status(500).json({msg:e});
        
    }
}


exports.imageUpload = async (req,res)=>{

    try {

        const userid = req.userid;
       
     if(!userid){
        res.status(400).json({msg:"please login for access this permission"})
        return;
     }
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

  exports.imageDelete = async (req,res)=>{

    try {

        const token = req.token; 
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
       
     if(!verifyUser){
        res.status(400).json({msg:"please login for access this permission"})
        return;
     }
     const userid = verifyUser.id;

        const data = await Image.destroy({
            where: {
                [Op.and]: [
                  { 
                    id: req.body.id 
                },
                  { user_id:userid}
                ]
              }
        })
        res.status(201).json({status:"Success",data:data})
        
    } catch (e) {
      console.log(e)
        res.status(500).json(e)
    }

  }




exports.createAmenity = async (req,res)=>{
    try {
        

    const amenity = await Amenity.bulkCreate(req.body.data);

    res.status(201).json({status:'success',msg:"data inserted",data:amenity})

    } catch (e) {
        res.status(500).json({msg:e});
        
    }
}


exports.getAmenity = async (req,res)=>{
    try {
   
    const amenity = await Amenity.findAll({
        attributes:['id','name','icon']
    });

    res.status(201).json({status:'success',msg:"data inserted",data:amenity})

    } catch (e) {
        res.status(500).json({msg:e});
        
    }
}

exports.getQuestion = async (req,res)=> {
    try {
        
    
        const question = await Question.findAll({
            attributes:['id','user_id','title','type','has_other'],
            include:[{
                model:Question_Option,
                attributes:['id','question_id','text','prefered']
            }],
            where:{user_id:userid}
        });
    
        res.status(201).json({status:'success',msg:"data inserted",data:question})
    
        } catch (e) {
            res.status(500).json({msg:e});
            
        }
}


exports.propertyAmenity = async (req,res)=>{
    try {
        
    

    const {property_id,amenity_id} = req.body;
    const data = await Property_Amenity.create({
        property_id:property_id,
        amenity_id:amenity_id
    })
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}

exports.propertyRoom = async (req,res)=>{
    try {
        
    
    const {property_id,name,image_id,url,caption,room_type,condition,remark} = req.body;
    const data = await Property_Room.create({
        property_id:property_id,
        name:name,
        image_id:image_id,
        url:url,
        caption:caption,
        room_type:room_type,
        condition:condition,
        remark:remark
    })
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        console.log(e);
        res.status(500).json(e)
        
    }
}

exports.propertyRoomImage = async (req,res)=>{
    try {
        
    
    const {room_id,image_id,image_url} = req.body;
    const data = await Property_Room_Image.create({
        room_id:room_id,
        image_id:image_id,
        image_url:image_url
    })
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}

exports.furnishingStatus= async (req,res)=>{
    try {
    
    const {name} = req.body;
    const data = await Furnishing_Status.create({
        name:name
    })
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}


exports.propertyApplicant = async (req,res)=>{
    try {
    const data = await Property_Applicant.create(req.body)
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}

exports.postQuestion = async (req,res)=>{
    try {
        
        const userid = req.userid;
    
        const {title,type,has_other,options} = req.body;
        const question = await Question.create({
            user_id:userid,
            title:title,
            type:type,
            has_other:has_other,
        })

        const option_array = [];

        for(opt of options){
            option_array.push({
                question_id:question.id,
                text:opt.text,
                prefered:opt.preferred
            })
        }

        const optiondata = await Question_Option.bulkCreate(option_array);



        res.status(201).json({status:'success',msg:"data inserted",data:question,optiondata})
            
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
            
        }
    
}

exports.propertydetail = async (req,res) => {
    try {
        const userid = req.userid;

        const data = await Property.findAll({
            include:[{
                model:Amenity,
                attributes:['id','name','icon']
            }]
        });

        res.status(201).json({status:'success',msg:"data inserted",data:data})


        
    } catch (e) {
        res.status(500).json(e)
        
    }
}


exports.propertyImage = async (req,res)=>{
    try {
        
    

    const {property_id,image_id} = req.body;
    const data = await Property_Image.create({
        property_id:property_id,
        image_id:image_id
    })
    res.status(201).json({status:'success',msg:"data inserted",data:data})
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}


exports.deleteProperty = async (req,res) => {
    try {
        
        
        const d = await Property.destroy({
            where:{id:req.body.property_id}
        })
        res.status(201).json({status:'success',msg:"data deeleted",data:d})
        
        
    } catch (e) {
        res.status(500).json(e)
        
    }
}