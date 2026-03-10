const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

const authMiddleware = require('../middlewares/authmiddleware');
const roleMiddleware = require('../middlewares/rolemiddleware');
const validatemiddleware = require('../middlewares/validation');
const refreshToken = require('../middlewares/validation');

router.post('/login', validatemiddleware.loginValidation);
router.post('/', validatemiddleware.validateUser, userController.createUser);
router.post('/create', validatemiddleware.validateUser, userController.createUserManual);
router.get('/',authMiddleware,roleMiddleware('admin','instructor'),userController.getUsers);
router.get('/role',authMiddleware,roleMiddleware('admin'),userController.getUsersByRole);
router.get('/advance-filter',authMiddleware,roleMiddleware('admin','instructor'),userController.advanceFilter);
router.get('/search',authMiddleware,roleMiddleware('admin','instructor'),userController.searchUsers);
router.put('/:id',authMiddleware,userController.updateUser);
router.delete('/:id',authMiddleware,roleMiddleware('admin'),userController.deleteUser);
router.post('/:id/enroll',authMiddleware,roleMiddleware('student'),userController.enrollCourse);
router.post('/refresh-token',refreshToken,userController.refreshToken);

module.exports = router;