const jwt = require('jsonwebtoken');
const User = require('../models/usermodels');

const validateUser = (req,res,next)=>{
    const {name,email} = req.body;
    if(!name || !email){
        return res.status(400).json({
        message:"Name and email required"
    });
}
next();
};

const loginValidation = async (req,res,next)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
            message:"User not found"
        });
    }

    const accessToken = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
    const refreshToken = jwt.sign({id:user._id},process.env.JWT_REFRESH_SECRET,{expiresIn:'15d'});
    res.status(200).json({accessToken,refreshToken});
}catch(error){
    next(error);
}
};

module.exports = {validateUser,loginValidation};