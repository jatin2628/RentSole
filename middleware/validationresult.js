const {validationResult}=require('express-validator');


const validresult=(req, res,next) => {
    // Validate incoming input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}
module.exports=validresult;