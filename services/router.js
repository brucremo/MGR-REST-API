const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
const password = require('../controllers/password.js');

router.route('/users/:id?')
  .get(users.get)
  .post(users.post)
  .put(users.put)
  .delete(users.delete);
 
router.route('/users/pwd')
  .put(password.put)
  .post(password.post);

module.exports = router;
