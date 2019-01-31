const express = require('express');
const router = new express.Router();
const users = require('../controllers/users.js');
const password = require('../controllers/password.js');
const reset = require('../controllers/reset.js');
const library = require('../controllers/library.js');
const igdb = require('../controllers/igdb.js');
const reviews = require('../controllers/reviews.js');
const register = require('../controllers/register.js');
const tag = require('../controllers/tag.js');

//User operations
router.route('/users/:id?')
  .get(users.get)
  .post(users.post)
  .put(users.put)
  .delete(users.delete);
 
//Password operations
router.route('/users/:id/pwd')
  .put(password.put)
  .post(password.post);

//Password reset operations
router.route('/:id/reset/:guid?')
  .get(reset.get)
  .put(reset.put)
  .post(reset.post);

//Add game to a user's library
router.route('/library/:userid/:gameid')
  .put(library.put)
  .post(library.post)
  .delete(library.delete);

//Get the user's library information
router.route('/library/:userid')
  .get(library.get);

//Using IGDB to retrieve information
router.route('/games/:name/:offset?')
  .get(igdb.getByName);

//Get specific game data
router.route('/game/:id/')
  .get(igdb.getGame);

//Reviews
router.route('/review/:gameid/:userid')
  .get(reviews.getOne)
  .post(reviews.post)
  .put(reviews.put)
  .delete(reviews.delete);

//Get reviews for a game
router.route('/reviews/:gameid')
  .get(reviews.get);

//Get reviews by user
router.route('/reviews/user/:userid')
  .get(reviews.getUser);

//Registration validation tools
router.route('/register/get-email/:email')    //Get e-mail
  .get(register.getEmail);
router.route('/register/get-userid/:userid')  //Get userid
  .get(register.getUserid);

//Tag management
router.route('/tag')
  .post(tag.post);       //Add new tag

router.route('/tag/:tagid/:userid')
  .delete(tag.delete)   //Remove tag
  .get(tag.get);        //Get all games for a tag on the user's library

module.exports = router;
