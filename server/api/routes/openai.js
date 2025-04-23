const router = require('express').Router();
const Controller = require('../controllers/openai');

router.get('/', Controller.get)
router.ws('/websocket', Controller.websocket);

module.exports = router;