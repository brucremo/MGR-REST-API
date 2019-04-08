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
const relationship = require('../controllers/relationship.js');
const search = require('../controllers/search.js');
const group = require('../controllers/group.js');
const grouprequests = require('../controllers/grouprequests.js')
const grouproles = require('../controllers/grouproles.js');
const thread = require('../controllers/thread.js');

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

//Friend relationship management
router.route('/friends')
  .get(relationship.get)        //Get all friends for a user
  .post(relationship.post)      //Add friend to user circle
  .put(relationship.put)        //Update friendship status
  .delete(relationship.delete); //Remove friend

//Search for Users/groups
router.route('/search')
  .get(search.get);

//Groups functionality
router.route('/group')
  .get(group.get)             //Get group information
  .post(group.post)           //Create group
  .put(group.put)             //Update group information
  .delete(group.delete);      //Delete group

router.route('/user-groups')
  .get(group.getGroupsUser);

//Role add/remove functionality
router.route('/role-add')
  .post(grouproles.post);

router.route('/role-remove')
  .delete(grouproles.del);

//Group requests functionality
router.route('/group-request')
  .delete(grouprequests.del)
  .put(grouprequests.put)
  .post(grouprequests.post);

//Threads CRUD
router.route('/thread')
  .get(thread.get)
  .post(thread.post)
  .put(thread.put)
  .delete(thread.delete);

router.route('/thread-status')
  .put(thread.putStatus);

module.exports = router;