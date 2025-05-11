/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
 */

//imports
const express = require('express');
const router = express.Router();
const Controller = require("../controllers/email");
 
// API URL - https://{domain}/api/email/passport
router.get('/password/forgot', Controller.passwordForgotView);

// API URL - https://{domain}/api/email/oauth
router.post('/oauth', Controller.oauth);

// API URL - https://{domain}/api/email/signup
router.post('/signup', Controller.signup);

// API URL - https://{domain}/api/email/passport/reset
router.post('/password/reset', Controller.reset);

// API URL - https://{domain}/api/email/passport/forgot
router.post('/password/forgot', Controller.forgot);


module.exports = router;