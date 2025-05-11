/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
 */

//imports
const express = require('express');
const router = express.Router();
const Controller = require("../controllers/google");

// API URL - https://{domain}/api/google/oauth
router.get('/oauth', Controller.oauth);

// API URL - https://{domain}/api/google/callback
router.get('/callback', Controller.callback);

 // API URL - https://{domain}/api/google/oauth
router.post('/oauth', Controller.signIn);

 

module.exports = router;