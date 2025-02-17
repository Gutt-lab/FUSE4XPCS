const express = require('express');
const { body, header } = require('express-validator');
const  MySQLUserRepository = require('../../repositories/mysql-users.repo')
const AuthController = require('../controllers/user-auth.controller');
const AuthService = require('../../../domain/services/user-auth.service')
//const authMiddleware = require('../middleware/auth');

const router = express.Router();

const userRepository = new MySQLUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);



const validateAuth = [
  body('login_name').isLength({ min: 3 }),
  body('user_pwd').isLength({ min: 3 })
];

const validateToken= [
  header('token').isLength({ min: 20 })
];


router.post('/authenticate-user', validateAuth, authController.login.bind(authController));
router.get('/validate-user', validateToken, authController.validateToken.bind(authController));


module.exports = router;

