const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course');

const authMiddleware = require('../middlewares/authmiddleware');
const roleMiddleware = require('../middlewares/rolemiddleware');

router.post('/',authMiddleware,roleMiddleware('admin','instructor'),courseController.createCourse);
router.post('/create',authMiddleware,roleMiddleware('admin','instructor'),courseController.createCourseManual);
router.get('/',authMiddleware,courseController.getCourses);
router.get('/filter',authMiddleware,courseController.filterCourses);
router.get('/search',authMiddleware,courseController.searchCourses);
router.put('/:id',authMiddleware,roleMiddleware('admin','instructor'),courseController.updateCourse);
router.delete('/:id',authMiddleware,roleMiddleware('admin'),courseController.deleteCourse);
router.get('/:id/enrolled',authMiddleware,roleMiddleware('admin','instructor'),courseController.getEnrolledStudents);

module.exports = router;