const reset = require('../db_apis/reset.js');
 
//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    const context = {};
 
    context.id = req.params.id;
    context.guid = req.params.guid;
 
    const rows = await reset.checkGUID(context);
 
    if (req.params.id && req.params.guid) {
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
 
    user = await reset.create(user);
 
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