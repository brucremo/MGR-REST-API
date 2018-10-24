const password = require('../db_apis/password.js');

//POST requests handling - CREATE
function getUserFromRec(req) {
  const user = {
    USERID: req.body.USERID,
    USERPASSWORD: req.body.USERPASSWORD,
    USERNEWPASSWORD: req.body.USERNEWPASSWORD
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {

    let user = getUserFromRec(req);

    const usrParam = {

      USERID: user.USERID
    };
 
    user = await password.create(user, usrParam);
 
    if(user.USERPASSWORD){

      return res.status(201).json(user);
    }else{

      res.status(501).end(user);
    }
    
  } catch (err) {

    res.status(500).end(err);
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
