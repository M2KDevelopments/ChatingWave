/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
 */

//imports
const express = require('express');
const router = express.Router();
const Controller = require("../controllers/facebook");

// API URL - https://{domain}/api/facebook/webhook
router.get('/webhook', Controller.webhookVerify);

// API URL - https://{domain}/api/facebook/callback
router.get('/callback', Controller.callback);

// API URL - https://{domain}/api/facebook/callback/chrome
router.get('/callback/chrome', Controller.callback);

// API URL - https://{domain}/api/facebook/webhook
router.post('/webhook', Controller.webhook);

 
module.exports = router;