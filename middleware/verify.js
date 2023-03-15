const jwt = require('jsonwebtoken');



const verifyUser = (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
        res.status(500).json('Please login o continue');
    }else{
        const bearer = token.split(" ");
        const dem = bearer[1];
        // req.token = dem;
        const user = jwt.verify(dem,process.env.SECRET_KEY);
        req.userid = user.id;
    }
    next();
    
}

module.exports = verifyUser;