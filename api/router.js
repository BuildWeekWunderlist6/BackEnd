const router = require('express').Router();
const userRouter = require('../user/router');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.status(200).send('<p>Wunderlist 2.0 API 🤔📝</p>');
});
router.use('/users', userRouter);

router.get('/auth', auth, (req, res) => {
    res.status(200).send('<p>User is authorized</p>');
});

module.exports = router;
