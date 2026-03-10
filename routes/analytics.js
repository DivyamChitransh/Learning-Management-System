const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authmiddleware');
const roleMiddleware = require('../middlewares/rolemiddleware');

router.get('/user-count',authMiddleware,roleMiddleware('admin'),analyticsController.userCount);
router.get('/user-report',authMiddleware,roleMiddleware('admin'),analyticsController.userReport);
router.get('/course-count',authMiddleware,roleMiddleware('admin','instructor'),analyticsController.courseCount);
router.get('/course-popularity',authMiddleware,roleMiddleware('admin','instructor'),analyticsController.coursePopularity);
router.get('/course-progress',authMiddleware,roleMiddleware('admin','instructor'),analyticsController.courseProgress);
router.get('/engagement',authMiddleware,roleMiddleware('admin'),analyticsController.engagement);
router.get('/summary',authMiddleware,roleMiddleware('admin'),analyticsController.summary);
router.get('/custom-report',authMiddleware,roleMiddleware('admin'),analyticsController.customReport);

module.exports = router;