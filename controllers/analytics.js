const User = require('../models/usermodels');
const Course = require('../models/coursemodels');

exports.userCount = async(req,res) => {
    try{
        const usercount = await User.countDocuments();
        const usersbyrole = await User.aggregate([
            {$group: {_id: "$role", count: {$sum:1}}}
        ]);
        res.status(200).json({usercount,usersbyrole});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.userReport = async(req,res) => {
    try{
        const userreport = await User.aggregate([
            {$match: {active: true}},
            {$group: {
                _id: '$preferredLanguage',
                activeusers: { $sum: 1 },
                students: {$sum: {$cond: [{ $eq: ['$role', 'student'] }, 1, 0]}},
                instructors: {$sum: {$cond: [{ $eq: ['$role', 'instructor'] }, 1, 0]}}
            }},
            {$addFields: {
                totalStudents: '$students',
                totalInstructors: '$instructors'
            }},
            {$project: {
                _id:1,
                activeusers:1,
                totalstudents:'$students',
                totalinstructors:'$instructors'
            }}
        ]);

        res.status(200).json({userreport});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.courseCount = async(req,res) => {
    try{
        const courseCount = await Course.aggregate([
            {$group: {_id: '$category', count: {$sum: 1}}},
            {$sort: {count:-1}}
        ]);

        res.status(200).json({courseCount});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.coursePopularity = async(req,res) => {
    try{
        const coursepopular = await Course.aggregate([
            {$match: {enrollmentCount:{$gt:0}}},
            {$sort: {enrollmentCount: -1}},
            {$limit:5},
            {$project: {title:1,instructor:1,enrollmentCount:1}}
        ]);

        res.status(200).json({coursepopular});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};

exports.courseProgress = async(req,res) => {
    try {
        const durationCategories = await Course.aggregate([
            {$addFields: {
                durationCategory: {
                    $switch: {
                        branches: [
                            { case: { $lte: ["$duration", 5] }, then: "short" },
                            { case: { $and: [{ $gt: ["$duration", 5] }, { $lte: ["$duration", 15] }] }, then: "medium" },
                            { case: { $gt: ["$duration", 15] }, then: "long" }
                        ],
                        default: "unknown"
                    }
                }
            }},
            {$group: {_id: "$durationCategory",count: { $sum: 1 }}},
            {$project: {_id: 0,durationCategory: "$_id",count: 1}}
        ]);
        res.status(200).json({ durationCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.engagement = async(req,res) => {
    const {page = 1,limit = 10} = req.query;
    try{
        const engagementreport = await User.aggregate([
            {$group: {_id: '$preferredLanguage',totalUsers: {$sum: 1}}},
            {$addFields: {
                mostCommonPreferences: '$_id',
                totalPreferences: '$totalUsers'
            }},
            {$project: {
                _id:0,
                mostCommonPreferences:1,
                totalPreferences:1
            }},
            {$skip: (page-1)*limit},
            {$limit: parseInt(limit)}
        ]);
        res.status(200).json({page,limit,engagementreport});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};


exports.summary = async(req,res) => {
    const {page=1, limit=5} = req.query;
    try{
        const Summary = await User.aggregate([
            {$facet: {
                users: [
                    {$group: {
                        _id: '$role',
                        userCount:{$sum:1},
                        avgCoursesEnrolled:{$avg:{$size:"$enrolledCourses"}}
                    }},
                    {$addFields: {mostPopularCourse: {$first:'$preferredLanguage'}}},
                    {$project: {
                        _id:1,
                        userCount:1,
                        avgCoursesEnrolled:1,
                        mostPopularCourse:1
                    }},
                    {$skip:(page-1)*limit},
                    {$limit:parseInt(limit)}
                ],
                courses: [
                    {$group:{
                        _id:'$category',
                        avgEnrollment:{$avg:'$enrollmentCount'},
                        maxEnrollment:{$max:'$enrollmentCount'},
                        totalenrollmentCount:{
                            $sum:{
                                $cond:[
                                    {$gt:['$enrollmentCount',0]},
                                    1,
                                    0
                                ]
                            }
                        }
                    }},
                    {$sort:{avgEnrollment: -1}},
                    {$skip:(page-1)*limit},
                    {$limit:parseInt(limit)}
                ]

            }}
        ]);
        res.status(200).json({page,limit,Summary});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};


exports.customReport = async(req,res) => {
    const {
        filterField,filterValue,sortField='_id',sortOrder = 1,page=1,limit=10} = req.body;

    try{
        const customreport = await User.aggregate([
            {$match: {[filterField]:filterValue}},
            {$addFields: {enrollmentCount: {$size: '$enrolledCourses'}}},
            {$sort: {[sortField]: parseInt(sortOrder)}},
            {$skip: (page-1)*limit},
            {$limit: parseInt(limit)},
            {$project:{
                name:1,
                role:1,
                preferredLanguage:1,
                enrollmentCount:1
            }}
        ]);
        res.status(200).json({page,limit,customreport});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};