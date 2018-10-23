const reset = require('../db_apis/reset.js');

//POST requests handling - CREATE
function getUserFromRec(req) {
  const user = {
    USERPASSWORD: req.body.USERPASSWORD,
    GUID: req.params.guid
  };
 
  return user;
}
 
async function post(req, res, next) {
  try {

    let user = getUserFromRec(req);
 
    user = await reset.create(user, usrParam);
 
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
    USEREMAIL: req.body.USEREMAIL
  };
 
  return user;
}
async function put(req, res, next) {
  try {
    let user = getUserFromRecPUT(req);
 
    const usrParam = {

      USEREMAIL: user.USEREMAIL
    };

    var resp = await reset.process(user, usrParam);
 
    if (resp == "EMAIL_SENT") {
      res.status(200).end(resp);
    } else {
      res.status(404).end("ERROR");
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;