const router = require('express').Router();

const defaultRes = (req, res) => {
    res.status(200).send('<p>Wunderlist 2.0 API 🤔📝</p>');
};

router.get('/', defaultRes);
router.get('/api', defaultRes);

module.exports = router;
