const Course = require('../models/coursemodels');
const User = require('../models/usermodels');
const mongoose = require('mongoose');

exports.createCourse = async(req,res) => {
    try{
        const course = new Course(req.body);
        await course.save();
        res.status(201).send(course);
    }
    catch(error){
        res.status(400).send({message: 'Unable to create course!',error});
    }
};

exports.createCourseManual = async(req,res) => {
    try{
        const {title,instructor,duration,max_capacity,category,schedule} = req.body;
        const newCourse = new Course({
            title,instructor,duration,max_capacity,category,schedule
        });
        const saveCourse = await newCourse.save();
        res.status(201).json(saveCourse);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

exports.getCourses = async(req,res) => {
    const {title,instructor} = req.query;
    try{
        const filter = {};
        if(title){
            filter.title = {$regex: title, $options: 'i'};
        }
        if(instructor){
            filter.instructor = {$regex: instructor, $option: 'i'};
        }
        const courses = await Course.find(filter, 'title instructor duration category');
        res.status(200).send(courses);
    }
    catch(error){
        res.status.send(500).send({message: "Error in Getting course!",error});
    }
};

exports.filterCourses = async(req,res) => {
    const {instructor,max_capacity,minDuration,day,titlekey} = req.query;
    try{
        const query = {};
        if(instructor){
            query.instructor = instructor;
        }
        if(max_capacity){
            query.max_capacity = {$gte: parseInt(max_capacity)};
        }
        if(minDuration){
            query.minDuration = {$gte: parseInt(minDuration)};
        }
        if(day){
            query['schedule.days'] = day;
        }
        if(titlekey){
            query.title = {$regex:titlekey,$options: 'i'};
        }
        const courses = await Course.find(query);
        res.status(200).send(courses);
    }
    catch(error){
        res.status(400).send({message: 'Enter in retrieving course!',error});
    }
};

exports.updateCourse = async(req,res) => {
    try{
        const course = await Course.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
        if(!course){
            return res.status(404).send({message: 'Invalid Course!'});
        }
        res.status(200).send(course);
    }
    catch(error){
        res.status(400).send({messgae: 'Cannot update course!',error});
    }
};

exports.deleteCourse = async(req,res) => {
    try{
        const course = await Course.findByIdAndDelete(req.params.id);
        if(!course){
            return res.status(404).send({message: 'Invalid Course!'});
        }
        res.status(200).send({message: 'Course deleted !', course});
    }
    catch(error){
        res.status(500).send({message: 'Error in Deleting!',error});
    }
};

exports.getEnrolledStudents = async(req,res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: 'Invalid Course!'});
    }
    try{
        const students = await User.find({courseIds: id,role: 'student'});
        res.status(200).json(students);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.searchCourses = async(req,res) => {
    const {title} = req.query;
    try{
        const courses = await Course.find({
            title: {$regex: title, $options: 'i'},
        });
        res.status(200).send(courses);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};