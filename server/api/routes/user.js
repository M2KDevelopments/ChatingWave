/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
 */

//imports
const express = require('express');
const router = express.Router();
const ControllerUser = require("../controllers/user");
const { auth } = require('../middlewares/authorization');

// API URL - https://{domain}/api/user
router.get('/', auth, ControllerUser.getUser);

// API URL - https://{domain}/api/user
router.delete('/', auth, ControllerUser.deleteUser);


module.exports = router;