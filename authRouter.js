const Router = require('express');
const { check } = require('express-validator');

const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

// указываем все пути, которые пригодятся для реализации аутенфикации и вторым параметром те функции, которые буду вызываться при этом пути
router.post(
  '/registration',
  [
    check('username', 'Username cant be empty').notEmpty(),
    check('password', 'Password must be contains 4-10 symbols').isLength({ min: 4, max: 10 }),
  ],
  controller.registration,
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['USER', 'ADMIN']), controller.getUsers);

module.exports = router;
