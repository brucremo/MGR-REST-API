const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
const password = require('../controllers/password.js');
const reset = require('../controllers/reset.js');
const library = require('../controllers/library.js');
const igdb = require('../controllers/igdb.js');
const reviews = require('../controllers/reviews.js');

router.route('/users/:id?')
  .get(users.get)
  .post(users.post)
  .put(users.put)
  .delete(users.delete);
 
router.route('/users/:id/pwd')
  .put(password.put)
  .post(password.post);

router.route('/:id/reset/:guid?')
  .get(reset.get)
  .put(reset.put)
  .post(reset.post);

//Add game to a user's library
router.route('/library/:userid/:gameid')
  .put(library.put)
  .delete(library.delete);

router.route('/library/:userid')
  .get(library.get);

//Using IGDB to retrieve information
router.route('/games/:name/:offset?')
  .get(igdb.getByName);

router.route('/game/:id/')
  .get(igdb.getGame);

//Reviews
router.route('/review/:gameid/:userid')
  .post(reviews.post)
  .delete(reviews.delete);

router.route('/reviews/:gameid')
  .get(reviews.get);

module.exports = router;
