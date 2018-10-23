const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
const password = require('../controllers/password.js');
const reset = require('../controllers/reset.js');

router.route('/users/:id?')
  .get(users.get)
  .post(users.post)
  .put(users.put)
  .delete(users.delete);
 
router.route('/users/:id/pwd')
  .put(password.put)
  .post(password.post);

router.route('/:id/reset/:guid?')
  .put(reset.put)
  .post(reset.post);

module.exports = router;
