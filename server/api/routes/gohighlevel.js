/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
 */

//imports
const express = require('express');
const router = express.Router();
const Controller = require("../controllers/gohighlevel");

// API URL - https://{domain}/api/gohighrevel
router.get('/oauth', Controller.oauth);

// API URL - https://{domain}/api/facebook/callback
router.get('/callback', Controller.callback); 

 
module.exports = router;