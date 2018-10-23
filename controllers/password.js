const password = require('../db_apis/password.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    const context = {};
 
    context.id = req.params.id;
 
    const rows = await password.find(context);
 
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
    USERPASSWORD: req.body.USERPASSWORD
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {

    let user = getUserFromRec(req);
 
    user = await password.create(user);
 
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

//PUT requests handling - OK

function getUserFromRecPUT(req) {
  const user = {
    USERID: req.body.USERID,
    USERPASSWORD: req.body.USERPASSWORD
  };
 
  return user;
}
async function put(req, res, next) {
  try {
    let user = getUserFromRecPUT(req);
 
    const usrParam = {

      USERID: user.USERID
    };

    var resp = await password.pair(user, usrParam);
 
    if (resp.USERPASSWORD) {
      res.status(200).json(resp);
    } else {
      res.status(404).end("HASH_ERROR");
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.put = put;