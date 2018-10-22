const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
const password = require('../controllers/password.js');

router.route('/users/:id?')
  .get(users.get)
  .post(users.post)
  .put(users.put)
  .delete(users.delete);
 
router.route('/users/:id/pwd')
  .post(password.post)
  .put(password.put);

module.exports = router;
