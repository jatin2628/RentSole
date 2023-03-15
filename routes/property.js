const propertyController = require('../controller/property');
const express = require('express');
const verifyUserr = require('../middleware/verify');
const multer = require('multer');

const router = express.Router();



const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/image");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    },
  });

  const upload = multer({
    storage:multerStorage
  });




router.post('/property',verifyUserr,propertyController.createProperty);

router.post('/image',upload.array('file_name'),verifyUserr,propertyController.imageUpload);

router.delete('/image',verifyUserr,propertyController.imageDelete);

router.post('/amenity',upload.array('icon'),verifyUserr,propertyController.createAmenity);

router.get('/amenity',verifyUserr,propertyController.getAmenity);


router.post('/propertyimage',verifyUserr,propertyController.propertyImage);

router.get('/propertydetail',verifyUserr,propertyController.propertydetail);

router.post('/propertyamenity',verifyUserr,propertyController.propertyAmenity);

router.post('/propertyroom',verifyUserr,propertyController.propertyRoom);

router.post('/propertyroomimages',verifyUserr,propertyController.propertyRoomImage);

router.post('/furnishingstatus',verifyUserr,propertyController.furnishingStatus);

router.post('/question',verifyUserr,propertyController.postQuestion);

router.get('/question',verifyUserr,propertyController.getQuestion);

router.put('/property',verifyUserr,propertyController.updateProperty);

router.delete('/property',verifyUserr,propertyController.deleteProperty);


router.post('/propertyapplicant',verifyUserr,propertyController.propertyApplicant);


module.exports = router;