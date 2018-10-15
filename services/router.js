const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
 
router.route('/users/:id?')
  .get(users.get);
 
module.exports = router;
