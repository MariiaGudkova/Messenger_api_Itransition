const router = require('express').Router();
const { login, sendMessage, getUserInfo, getUsers } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.use(auth);
router.get('/me', getUserInfo);
router.get('/users', getUsers);
router.patch('/sendmessage', sendMessage);

module.exports = router;