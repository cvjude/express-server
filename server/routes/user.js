import express from 'express';
import 'express-async-errors';
import UserController from '../controllers/userController';
import middlewares from '../middlewares';

const userRoute = express();
const { verifyToken, validateLogin, validateUser } = middlewares;
const { signUp, login, logout } = UserController;

userRoute.post('/', validateUser, signUp);
userRoute.post('/login', validateLogin, login);

userRoute.post('/logout', verifyToken, logout);

export default userRoute;
