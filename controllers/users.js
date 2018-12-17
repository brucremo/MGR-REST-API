const users = require('../db_apis/users.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    const context = {};
 
    context.id = req.params.id;
 
    const rows = await users.find(context);
 
    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;

//POST requests handling - CREATE
function getUserFromRec(req) {
  const user = {
    USERID: req.body.USERID,
    USERPASSWORD: req.body.USERPASSWORD,
    USERNAME: req.body.USERNAME,
    USERSUMMARY: req.body.USERSUMMARY,
    USERJOINDATE: req.body.USERJOINDATE,
    USERAVATAR: req.body.USERAVATAR,
    USERLOCATION: req.body.USERLOCATION,
    USERAGE: req.body.USERAGE,
    USEREMAIL: req.body.USEREMAIL
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {

    let user = getUserFromRec(req);
 
    user = await users.create(user);
 
    res.status(201).json(user.USERID.toUpperCase() + "_ADDED");
  } catch (err) {
    if(err.errorNum == 1){

      res.status(501).end("ERROR_USER_EXISTS");
    }else{

      res.status(500).end(err.message);
    }
  }
}
 
module.exports.post = post;

//PUT requests handling - UPDATE - OK

function getUserFromRecPUT(req) {
  const user = {
    USERID: req.body.USERID,
    USERNAME: req.body.USERNAME,
    USERSUMMARY: req.body.USERSUMMARY,
    USERJOINDATE: req.body.USERJOINDATE,
    USERAVATAR: req.body.USERAVATAR,
    USERLOCATION: req.body.USERLOCATION,
    USERAGE: req.body.USERAGE
  };
 
  return user;
}
async function put(req, res, next) {
  try {
    let user = getUserFromRecPUT(req);
 
    user = await users.update(user);
 
    if (user.rowsAffected !== 0) {
      res.status(200).json(user.USERID.toUpperCase() + "_UPDATED");
    } else {
      res.status(404).end("UPDATE_ERROR");
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.put = put;

//DELETE requests handling - DELETE
async function del(req, res, next) {
  try {
 
    const success = await users.delete(req.params.id);
 
    if (success) {
      res.status(204).end("USER" + req.params.id.toUpperCase() + "_CREATED");
    } else {
      res.status(409).end("ERROR_USERID_NONEXISTENT");
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.delete = del;