const userRouter = require('express').Router();
const { validateProfileBody } = require('../middlewares/validator');
const {
  getUser, updateUser, // createUser,
} = require('../controllers/users');

userRouter.get('/me', getUser);

userRouter.patch('/me', validateProfileBody, updateUser);

module.exports = userRouter;
