const users = require('../db_apis/users.js');
 
//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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
    USERLOCATION: req.body.USERLOCATION
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let user = getUserFromRec(req);
 
    user = await users.create(user);
 
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
 
module.exports.post = post;

//PUT requests handling - UPDATE - OK
async function put(req, res, next) {
  try {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let user = getUserFromRec(req);
 
    user = await users.update(user);
 
    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.put = put;

//DELETE requests handling - DELETE
async function del(req, res, next) {
  try {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 
    const success = await users.delete(req.params.id);
 
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.delete = del;