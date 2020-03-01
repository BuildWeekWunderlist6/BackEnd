const router = require('express').Router();
const userRouter = require('../user/router');

router.get('/', (req, res) => {
    res.status(200).send('<p>Wunderlist 2.0 API 🤔📝</p>');
});
router.use('/users', userRouter);

module.exports = router;
