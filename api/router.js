const router = require('express').Router();
const userRouter = require('../user/router');
const todoListRouter = require('../todo-list/router');
const todoItemRouter = require('../todo-item/router');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.status(200).send('<p>Wunderlist 2.0 API 🤔📝</p>');
});
router.use('/users', userRouter);
router.use('/todo-lists', auth, todoListRouter);
router.use('/todo-items', auth, todoItemRouter);

router.get('/auth', auth, (req, res) => {
    res.status(200).send('<p>User is authorized</p>');
});

module.exports = router;
