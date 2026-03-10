const User = require('../models/usermodels');
const Course = require('../models/coursemodels');

exports.createUser = async (req,res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    }
    catch(error){
        res.status(400).send({message: 'Error in Creating user!',error});
    }
};

exports.createUserManual = async(req,res) => {
    try{
        const {name,email,role,preferredLanguage,profile} = req.body;
        const newUser = new User({name,email,role,preferredLanguage,profile})
        const saveuser = await newUser.save();
        res.status(200).json(saveuser);
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

exports.getUsers = async(req,res) => {
    const {role} = req.query;
    try{
        const filter = role?{role}:{};
        const users = await User.find(filter).populate({
            path: 'enrolledCourses',
            model: 'Course',
            select: 'name'
        });
        res.status(200).send(users);
    }
    catch(error){
        res.status(500).send({message: 'Error in retriving user!',error});
    }
};

exports.getUsersByRole = async(req,res) => {
    const {role} = req.query;
    try{
        const users = await User.find({role});
        res.status(200).send(users);
    }
    catch(error){
        res.status(400).send({message: 'Enter in retrieving user by role!',error});
    }
};

exports.advanceFilter = async(req,res) => {
    const {preferredLanguages,platform,biokeyword} = req.query;
    try{
        const filter = {};
        if(preferredLanguages){
            filter['profile.preferrences.preferredLanguages'] = preferredLanguages;
        }
        if(platform){
            filter['profile.socialLinks.platform'] = platform;
        }
        if(biokeyword){
            filter['profile.bio'] = {$regex:biokeyword,$options:'i'};
        }
        const users = await User.find(filter);
        res.status(200).send(users);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.updateUser = async(req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
        if(!user){
            return res.status(404).send({message: 'Invalid user!'});
        }
        res.status(200).send(user);
    }
    catch(error){
        res.status(400).send({messgae: 'Cannot update course!',error});
    }
};

exports.deleteUser = async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send({message: 'Invalid user!'});
        }
        res.status(200).send({message: 'User deleted !', user});
    }
    catch(error){
        res.status(500).send({message: 'Error in Deleting!',error});
    }
};

exports.enrollCourse = async(req,res) => {

    const {id} = req.params;
    const {courseName} = req.body;

    try{
        const user = await User.findById(id);
        const course = await Course.findOne({title: courseName});

        if(!user || !course){
           return res.status(404).json({message: 'Cant find user or course!'});
        }

        if(user.role !== 'student'){
            return res.status(403).json({message: 'Only students can apply!'});
        }

        if(user.enrolledCourses.includes(course._id)){
            return res.status(400).json({message: 'User already enrolled in this course!'});
        }

        if(course.enrolledstudets.length >= course.max_capacity){
            return res.status(400).json({message: 'Max Capacity reached!'});
        }

        user.enrolledCourses.push(course._id);
        course.enrolledstudets.push(user._id);

        await user.save();
        await course.save();

        res.status(200).json({message: 'User enrolled!'});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.searchUsers = async(req,res) => {
    const {bio} = req.query;

    try{
        const users = await User.find({
            'profile.bio': {$regex:bio,$options:'i'},
        });
        res.status(200).send(users);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.refreshToken = (req,res)=>{
    res.status(200).json({
        accessToken: req.newAccessToken
    });
};