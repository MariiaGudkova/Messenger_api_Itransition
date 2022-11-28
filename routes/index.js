const router = require("express").Router();
const { login, sendMessage, getUserInfo } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.use(auth);
router.get("/me", getUserInfo);
router.patch('/sendmessage', sendMessage);

module.exports = router;