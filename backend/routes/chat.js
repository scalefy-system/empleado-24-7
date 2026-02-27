const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateChat } = require('../middleware/validator');

router.post('/', rateLimiter, validateChat, controller.sendMessage);
router.delete('/:sessionId', controller.resetSession);

module.exports = router;
